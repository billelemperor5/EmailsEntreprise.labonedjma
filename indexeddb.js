// ================================================
// LABO NEDJMA - IndexedDB Local Database Layer
// Offline-first cache for emails, units and sync metadata.
// ================================================

(function () {
    'use strict';

    const DB_NAME = 'labo_nedjma_local_database';
    const DB_VERSION = 1;
    const EMAILS_STORE = 'emails';
    const META_STORE = 'meta';
    const SYSTEM_META_KEY = 'system';

    let dbPromise = null;

    function isIndexedDBAvailable() {
        return typeof window !== 'undefined' && 'indexedDB' in window;
    }

    function openDatabase() {
        if (!isIndexedDBAvailable()) {
            return Promise.reject(new Error('IndexedDB is not supported in this browser.'));
        }

        if (dbPromise) return dbPromise;

        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                if (!db.objectStoreNames.contains(EMAILS_STORE)) {
                    const emailStore = db.createObjectStore(EMAILS_STORE, { keyPath: 'localId' });
                    emailStore.createIndex('mail', 'mail', { unique: false });
                    emailStore.createIndex('unit', 'unit', { unique: false });
                    emailStore.createIndex('status', 'status', { unique: false });
                    emailStore.createIndex('isRequest', 'isRequest', { unique: false });
                }

                if (!db.objectStoreNames.contains(META_STORE)) {
                    db.createObjectStore(META_STORE, { keyPath: 'key' });
                }
            };

            request.onsuccess = () => {
                const db = request.result;
                db.onversionchange = () => db.close();
                resolve(db);
            };

            request.onerror = () => reject(request.error || new Error('Unable to open IndexedDB.'));
        });

        return dbPromise;
    }

    function runTransaction(storeNames, mode, callback) {
        return openDatabase().then((db) => new Promise((resolve, reject) => {
            const tx = db.transaction(storeNames, mode);
            const stores = Array.isArray(storeNames)
                ? storeNames.reduce((acc, name) => {
                    acc[name] = tx.objectStore(name);
                    return acc;
                }, {})
                : tx.objectStore(storeNames);

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error || new Error('IndexedDB transaction failed.'));
            tx.onabort = () => reject(tx.error || new Error('IndexedDB transaction aborted.'));

            try {
                callback(stores);
            } catch (error) {
                tx.abort();
                reject(error);
            }
        }));
    }

    function requestToPromise(request) {
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error || new Error('IndexedDB request failed.'));
        });
    }

    function serializeValue(value) {
        if (value === null || value === undefined) return value;

        if (typeof value.toDate === 'function') {
            return value.toDate().toISOString();
        }

        if (value instanceof Date) {
            return value.toISOString();
        }

        if (Array.isArray(value)) {
            return value.map(serializeValue);
        }

        if (typeof value === 'object') {
            return Object.keys(value).reduce((acc, key) => {
                if (typeof value[key] !== 'function') {
                    acc[key] = serializeValue(value[key]);
                }
                return acc;
            }, {});
        }

        return value;
    }

    function normalizeEmailRecord(record, index) {
        const safeRecord = serializeValue(record || {});
        const prefix = safeRecord.isRequest ? 'request' : 'email';
        const keySource = safeRecord.requestId || safeRecord.mail || `${index}`;

        return {
            ...safeRecord,
            localId: `${prefix}:${keySource}`
        };
    }

    function normalizePayload(data) {
        if (Array.isArray(data)) {
            return {
                emails: data,
                units: [],
                pendingRequestsCount: data.filter((item) => item && item.isRequest).length,
                lastUpdate: null,
                syncedAt: new Date().toISOString()
            };
        }

        const payload = data || {};
        const emails = Array.isArray(payload.emails) ? payload.emails : [];

        return {
            emails,
            units: Array.isArray(payload.units) ? payload.units : [],
            pendingRequestsCount: Number.isFinite(payload.pendingRequestsCount)
                ? payload.pendingRequestsCount
                : emails.filter((item) => item && item.isRequest).length,
            lastUpdate: payload.lastUpdate || null,
            syncedAt: payload.syncedAt || new Date().toISOString()
        };
    }

    function mapPendingRequest(doc) {
        const data = serializeValue(doc.data ? doc.data() : doc);
        let displayName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
        let displayUnit = data.location || '---';
        let displayPoste = data.job || '---';

        if (data.type === 'correction') {
            displayName = 'Demande de Correction';
            displayUnit = 'Systeme';
            displayPoste = 'Modification';
        } else if (data.type === 'deactivation') {
            displayName = 'Demande de Desactivation';
            displayUnit = 'Systeme';
            displayPoste = 'Fermeture';
        }

        return {
            name: displayName || 'Utilisateur Inconnu',
            mail: data.email,
            phone: data.phone || '',
            unit: displayUnit,
            poste: displayPoste,
            status: 'En attente',
            isRequest: true,
            requestId: doc.id || data.requestId || data.email
        };
    }

    function getDefaultUnits() {
        return [
            { id: 'u1', name: 'Larbaa', color: '#3b82f6' },
            { id: 'u2', name: 'Oued Smar', color: '#f97316' },
            { id: 'u3', name: 'Douera', color: '#ec4899' },
            { id: 'u4', name: 'El Oued', color: '#0d9488' },
            { id: 'u5', name: 'Rahmania', color: '#475569' },
            { id: 'u6', name: 'Autres Unites', color: '#8b5cf6' }
        ];
    }

    function setDiagnosticAttribute(name, value) {
        if (typeof document !== 'undefined' && document.documentElement) {
            document.documentElement.setAttribute(name, String(value));
        }
    }

    async function initIndexedDB() {
        await openDatabase();
        return true;
    }

    async function saveEmailsToIndexedDB(data) {
        const payload = normalizePayload(data);
        const records = payload.emails.map(normalizeEmailRecord);
        const meta = {
            key: SYSTEM_META_KEY,
            units: serializeValue(payload.units),
            pendingRequestsCount: payload.pendingRequestsCount,
            lastUpdate: payload.lastUpdate,
            syncedAt: payload.syncedAt
        };

        await runTransaction([EMAILS_STORE, META_STORE], 'readwrite', (stores) => {
            stores[EMAILS_STORE].clear();
            records.forEach((record) => stores[EMAILS_STORE].put(record));
            stores[META_STORE].put(meta);
        });

        setDiagnosticAttribute('data-indexeddb-emails', records.length);
        setDiagnosticAttribute('data-indexeddb-synced-at', payload.syncedAt);

        return {
            ...payload,
            emails: records.map(({ localId, ...record }) => record)
        };
    }

    async function loadEmailsFromIndexedDB() {
        const db = await openDatabase();
        const tx = db.transaction([EMAILS_STORE, META_STORE], 'readonly');
        const emailsStore = tx.objectStore(EMAILS_STORE);
        const metaStore = tx.objectStore(META_STORE);

        const emails = await requestToPromise(emailsStore.getAll());
        const meta = await requestToPromise(metaStore.get(SYSTEM_META_KEY));

        return {
            emails: (emails || []).map(({ localId, ...record }) => record),
            units: (meta && Array.isArray(meta.units)) ? meta.units : [],
            pendingRequestsCount: meta ? (meta.pendingRequestsCount || 0) : 0,
            lastUpdate: meta ? (meta.lastUpdate || null) : null,
            syncedAt: meta ? (meta.syncedAt || null) : null
        };
    }

    async function clearIndexedDB() {
        await runTransaction([EMAILS_STORE, META_STORE], 'readwrite', (stores) => {
            stores[EMAILS_STORE].clear();
            stores[META_STORE].clear();
        });
        return true;
    }

    async function syncFirestoreToIndexedDB(options = {}) {
        if (typeof window.db === 'undefined' && typeof db === 'undefined') {
            throw new Error('Firestore is not initialized.');
        }

        const firestore = typeof window.db !== 'undefined' ? window.db : db;
        const emailsSnapshot = options.emailsSnapshot || await firestore.collection('emails').get();

        let pendingSnapshot = options.pendingRequestsSnapshot || null;
        if (!pendingSnapshot) {
            try {
                pendingSnapshot = await firestore.collection('pendingRequests')
                    .where('status', '==', 'pending')
                    .get();
            } catch (error) {
                if (typeof window !== 'undefined' && window.DEBUG) {
                    console.info('Pending requests are not available for this session.');
                }
            }
        }

        let units = Array.isArray(options.units) ? options.units : [];
        if (!units.length) {
            try {
                const unitsDoc = await firestore.collection('settings').doc('units_config').get();
                units = unitsDoc.exists ? (unitsDoc.data().list || []) : getDefaultUnits();
            } catch (error) {
                units = getDefaultUnits();
            }
        }

        let lastUpdate = options.lastUpdate || null;
        if (!lastUpdate && !options.skipAppSettings) {
            try {
                const appDoc = await firestore.collection('settings').doc('app').get();
                lastUpdate = appDoc.exists ? (appDoc.data().lastUpdate || null) : null;
            } catch (error) {
                lastUpdate = null;
            }
        }

        const officialEmails = emailsSnapshot.docs.map((doc) => serializeValue(doc.data()));
        const pendingRequests = pendingSnapshot ? pendingSnapshot.docs.map(mapPendingRequest) : [];
        const emails = [...officialEmails, ...pendingRequests].map((item) => {
            const statusLower = String(item.status || '').toLowerCase();
            if (statusLower.startsWith('bloqu') || statusLower.startsWith('desactiv') || statusLower.startsWith('désactiv')) {
                return { ...item, name: '-' };
            }
            return item;
        });

        const payload = {
            emails,
            units: serializeValue(units),
            pendingRequestsCount: pendingRequests.length,
            lastUpdate,
            syncedAt: new Date().toISOString()
        };

        await saveEmailsToIndexedDB(payload);
        return payload;
    }

    window.initIndexedDB = initIndexedDB;
    window.saveEmailsToIndexedDB = saveEmailsToIndexedDB;
    window.loadEmailsFromIndexedDB = loadEmailsFromIndexedDB;
    window.clearIndexedDB = clearIndexedDB;
    window.syncFirestoreToIndexedDB = syncFirestoreToIndexedDB;
    window.__laboIndexedDBLayerReady = true;
    if (typeof document !== 'undefined' && document.documentElement) {
        document.documentElement.setAttribute('data-indexeddb-layer', 'ready');
    }
})();
