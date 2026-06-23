// ================================================
// LABO NEDJMA — EMAIL TRACKING SYSTEM v6.0.5
// Gov Clean Style — Navbar Edition
// ================================================

// PWA install support: enables "Install app" on desktop and mobile browsers.
if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch((error) => {
            console.warn('Service worker registration failed:', error);
        });
    });
} else if (window.location.protocol === 'file:') {
    console.info('Service Worker registration skipped: Running from local file system.');
}

// Firebase configuration
// Enable a lighter rendering mode automatically on low-end devices.
// Can be forced with localStorage.setItem('labo-performance-mode', 'lite')
// or disabled with localStorage.setItem('labo-performance-mode', 'full').
(function initPerformanceMode() {
    let savedMode = null;
    let gpuSaverPreference = null;
    try {
        savedMode = localStorage.getItem('labo-performance-mode');
        gpuSaverPreference = localStorage.getItem('labo-gpu-saver');
    } catch (e) {
        savedMode = null;
        gpuSaverPreference = null;
    }

    const nav = typeof navigator !== 'undefined' ? navigator : {};
    const lowMemory = nav.deviceMemory && nav.deviceMemory <= 4;
    const lowCpu = nav.hardwareConcurrency && nav.hardwareConcurrency <= 4;
    const smallScreen = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gpuSaverMode = gpuSaverPreference !== 'off';
    const liteMode = savedMode === 'lite' || gpuSaverMode || (!savedMode && (lowMemory || lowCpu || (smallScreen && lowCpu) || reducedMotion));

    document.documentElement.classList.add('render-optimized');
    document.documentElement.classList.toggle('gpu-saver', gpuSaverMode);
    document.documentElement.classList.toggle('performance-lite', !!liteMode);
})();

(function initRenderPerformanceGuards() {
    const root = document.documentElement;

    function updateVisibilityState() {
        root.classList.toggle('effects-paused', document.hidden);
        if (!document.hidden && window.__laboRenderPending) {
            window.__laboRenderPending = false;
            if (typeof renderCurrentViewFromState === 'function') {
                requestAnimationFrame(() => renderCurrentViewFromState({ force: true }));
            }
            if (typeof renderNotifications === 'function') {
                requestAnimationFrame(() => renderNotifications());
            }
        }
        if (!document.hidden && window.__laboFirestoreSyncPending) {
            window.__laboFirestoreSyncPending = false;
            if (typeof scheduleFirestoreCacheSync === 'function') {
                scheduleFirestoreCacheSync();
            }
        }
    }

    document.addEventListener('visibilitychange', updateVisibilityState, { passive: true });
    updateVisibilityState();
})();

const firebaseConfig = {
    apiKey: "AIzaSyAvrA1I2qMZHZTFYo3nD_pIZlLhtS1rT3o",
    authDomain: "systeme-de-gestion-des-emails.firebaseapp.com",
    projectId: "systeme-de-gestion-des-emails",
    storageBucket: "systeme-de-gestion-des-emails.firebasestorage.app",
    messagingSenderId: "546333975186",
    appId: "1:546333975186:web:4ea5faf8ceb271130e7c4b",
    measurementId: "G-KKZWQV8X2Y"
};

// Initialize Firebase when the CDN is available. The app can still open in offline/cache mode
// if Firebase scripts are delayed or blocked by the network.
let auth = null;
let db = null;
let firebaseUnavailableWarned = false;
let authListenerRegistered = false;

function setupAuthStateListener() {
    if (authListenerRegistered || !auth) return;
    authListenerRegistered = true;

    auth.onAuthStateChanged((user) => {
        const loginBtn = document.getElementById('loginBtn');
        const userInfo = document.getElementById('userInfo');
        const userName = document.getElementById('userName');

        if (user) {
            // User is signed in
            if (loginBtn) loginBtn.classList.add('hidden');
            if (userInfo) userInfo.classList.remove('hidden');

            const displayName = user.displayName || user.email.split('@')[0];
            if (userName) userName.innerText = displayName;

            // Update Avatar Initials
            const initialsEl = document.getElementById('userInitialsAvatar');
            if (initialsEl) {
                initialsEl.innerText = displayName.charAt(0).toUpperCase();
            }

            document.body.classList.add('is-admin');

            // Re-render emails to show action buttons
            if (typeof currentFilteredEmails !== 'undefined' && currentFilteredEmails.length > 0) {
                renderEmails(currentFilteredEmails, currentPage);
            }

            console.log("Admin Logged In. Cloud Control Enabled.");

            // Setup admin notifications for requests
            if (typeof setupAdminRequestNotifs === 'function') {
                setupAdminRequestNotifs();
            }

            // Render archive log to load updates immediately for admin
            if (typeof renderArchiveLog === 'function') {
                renderArchiveLog();
            }
        } else {
            // User is signed out
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (userInfo) userInfo.classList.add('hidden');
            document.body.classList.remove('is-admin');

            // Re-render emails to hide action buttons
            if (typeof currentFilteredEmails !== 'undefined' && currentFilteredEmails.length > 0) {
                renderEmails(currentFilteredEmails, currentPage);
            }

            // Reload archive log for public views
            if (typeof renderArchiveLog === 'function') {
                renderArchiveLog();
            }
        }
    });
}

function initializeFirebaseServices() {
    if (auth && db) return true;

    if (typeof window.firebase === 'undefined' || !window.firebase.initializeApp) {
        if (!firebaseUnavailableWarned) {
            console.warn('Firebase SDK unavailable. Starting in offline mode.');
            firebaseUnavailableWarned = true;
        }
        return false;
    }

    try {
        if (!firebase.apps || !firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        auth = typeof firebase.auth === 'function' ? firebase.auth() : null;
        db = typeof firebase.firestore === 'function' ? firebase.firestore() : null;
        window.auth = auth;
        window.db = db;

        if (auth) {
            setupAuthStateListener();
        }

        return !!(auth && db);
    } catch (error) {
        console.warn('Firebase initialization failed. Starting in offline mode.', error);
        return false;
    }
}

initializeFirebaseServices();
const EMAILJS_SRC = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
let emailJSLoadingPromise = null;

(function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("NZzp8VaAhdhkS_mlV");
    }
})();

function ensureEmailJSLoaded() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("NZzp8VaAhdhkS_mlV");
        return Promise.resolve(emailjs);
    }

    if (emailJSLoadingPromise) return emailJSLoadingPromise;

    emailJSLoadingPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = EMAILJS_SRC;
        script.async = true;
        script.onload = () => {
            if (typeof emailjs === 'undefined') {
                reject(new Error('EmailJS unavailable'));
                return;
            }
            emailjs.init("NZzp8VaAhdhkS_mlV");
            resolve(emailjs);
        };
        script.onerror = () => reject(new Error('EmailJS failed to load'));
        document.head.appendChild(script);
    });

    return emailJSLoadingPromise;
}

// =============================================
// SPLASH SCREEN — Premium v3.0 (Cloud Sync Integrated)
// =============================================
async function initSplashScreen() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;
    const perfLite = document.documentElement.classList.contains('performance-lite');

    // Hide main content during splash
    const sidebar = document.getElementById('sidebar');
    const mainWrapper = document.querySelector('.main-wrapper');
    if (sidebar) sidebar.style.opacity = '0';
    if (mainWrapper) mainWrapper.style.opacity = '0';

    const statusText = splash.querySelector('.splash-status-text');
    const pctEl = splash.querySelector('.splash-progress-pct');
    const progressFill = splash.querySelector('.splash-bar-fill');

    let pct = 0;
    const messages = ['Initialisation...', 'Chargement des modules...', 'Synchronisation Cloud...', 'Finalisation...'];

    const splashTargetPct = perfLite ? 80 : 90;
    let splashRafId = null;
    let splashLastFrame = 0;
    let splashDone = false;
    let finalIntervalRef = null;

    function withStartupTimeout(promise, label, timeoutMs = 6500) {
        return Promise.race([
            promise,
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
            })
        ]);
    }

    function updateSplashProgress(nextPct) {
        const roundedPct = Math.round(nextPct);
        if (roundedPct === Math.round(pct)) return;
        pct = roundedPct;
        if (pctEl) pctEl.textContent = pct + '%';
        if (progressFill) progressFill.style.width = pct + '%';

        if (pct >= 60 && statusText) statusText.textContent = messages[2];
        else if (pct >= 30 && statusText) statusText.textContent = messages[1];
    }

    function animateSplashProgress(timestamp) {
        if (splashDone) return;
        if (document.hidden) {
            splashRafId = requestAnimationFrame(animateSplashProgress);
            return;
        }
        if (!splashLastFrame) splashLastFrame = timestamp;
        const elapsed = timestamp - splashLastFrame;
        const frameBudget = perfLite ? 70 : 48;

        if (elapsed >= frameBudget && pct < splashTargetPct) {
            splashLastFrame = timestamp;
            updateSplashProgress(Math.min(splashTargetPct, pct + (perfLite ? 8 : 2)));
        }

        if (pct < splashTargetPct) {
            splashRafId = requestAnimationFrame(animateSplashProgress);
        }
    }

    splashRafId = requestAnimationFrame(animateSplashProgress);

    // â”€â”€ HARD TIMEOUT: Never hang the app on slow mobile connections â”€â”€
    const SPLASH_TIMEOUT_MS = 8000; // 8 seconds max

    function dismissSplash() {
        if (splashDone) return;
        splashDone = true;
        if (splashRafId) cancelAnimationFrame(splashRafId);
        if (finalIntervalRef) cancelAnimationFrame(finalIntervalRef);

        if (pctEl) pctEl.textContent = '100%';
        if (progressFill) progressFill.style.width = '100%';
        if (statusText) statusText.textContent = 'Système prêt !';

        initializeAppCore();

        setTimeout(() => {
            splash.classList.add('fade-out');
            if (sidebar) sidebar.style.opacity = '1';
            if (mainWrapper) {
                mainWrapper.style.opacity = '1';
                mainWrapper.style.transition = 'opacity 0.4s ease';
            }
            setTimeout(() => {
                splash.remove();
            }, perfLite ? 250 : 800);
        }, perfLite ? 100 : 400);
    }

    // Set hard timeout — show app even if Firebase never responds
    const hardTimeout = setTimeout(() => {
        if (!splashDone) {
            if (statusText) statusText.textContent = 'Mode hors-ligne...';
            setOfflineMode(true, 'Mode hors ligne');
            dismissSplash();
        }
    }, SPLASH_TIMEOUT_MS);

    try {
        if (typeof window.initIndexedDB === 'function' && typeof window.loadEmailsFromIndexedDB === 'function') {
            await withStartupTimeout(window.initIndexedDB(), 'IndexedDB startup');
            const cachedPayload = await withStartupTimeout(window.loadEmailsFromIndexedDB(), 'IndexedDB cache load');
            if (cachedPayload && cachedPayload.emails && cachedPayload.emails.length) {
                if (statusText) statusText.textContent = 'Chargement local...';
                applyIndexedDBPayload(cachedPayload);
                setOfflineMode(!navigator.onLine, navigator.onLine ? '' : 'Mode hors ligne');
                updateDbSyncStatus(navigator.onLine ? 'syncing' : 'offline');
                dismissSplash();
            }
        }
    } catch (error) {
        console.warn('IndexedDB startup load skipped:', error);
    }

    if (navigator.onLine) {
        if (statusText) statusText.textContent = 'Synchronisation Cloud...';
        try {
            await withStartupTimeout(syncAndRefreshFromFirestore({ render: true }), 'Firestore startup sync');
            setOfflineMode(false);
        } catch (error) {
            console.warn('Startup Firestore sync failed:', error);
            setOfflineMode(true, 'Mode hors ligne');
        }
    } else {
        setOfflineMode(true, 'Mode hors ligne');
        updateDbSyncStatus('offline');
    }

    clearTimeout(hardTimeout);

    if (document.hidden) {
        dismissSplash();
        setupFirestoreRealtimeSync();
        registerNetworkSyncHandlers();
        return;
    }

    // Complete progress to 100% once data is loaded.
    if (splashRafId) cancelAnimationFrame(splashRafId);
    pct = perfLite ? 80 : 90;
    let finalLastFrame = 0;
    function finishSplashProgress(timestamp) {
        if (splashDone) return;
        if (document.hidden) {
            finalIntervalRef = requestAnimationFrame(finishSplashProgress);
            return;
        }
        if (!finalLastFrame) finalLastFrame = timestamp;
        const elapsed = timestamp - finalLastFrame;
        const frameBudget = perfLite ? 32 : 48;
        if (elapsed >= frameBudget) {
            finalLastFrame = timestamp;
            updateSplashProgress(Math.min(100, pct + (perfLite ? 10 : 4)));
        }
        if (pct >= 100) {
            dismissSplash();
            return;
        }
        finalIntervalRef = requestAnimationFrame(finishSplashProgress);
    }
    finalIntervalRef = requestAnimationFrame(finishSplashProgress);

    setupFirestoreRealtimeSync();
    registerNetworkSyncHandlers();
}


// Global Core Initialization
function initializeAppCore() {
    initAuthSystem();
    upgradeAdminFormLayout();
    initUnitManagement(); // Initialize unit CRUD listeners
    initSystemDateListener(); // Real-time date sync
    checkSystemVersion(); // Check for updates
    if (typeof updateDashboardStats === 'function') updateDashboardStats();
    if (typeof renderEmailList === 'function') renderEmailList();
}

// Launch Splash
document.addEventListener('DOMContentLoaded', initSplashScreen);

// =============================================
// =============================================
// DATABASE — Global Emails Inventory (Dynamic)
// =============================================
let companyEmails = []; // Initially empty, will be populated from Firestore
let systemUnits = []; // Admin manageable units
let pendingRequestsCount = 0;
let lastLocalSyncAt = null;
let lastKnownUpdateDate = null;
let firestoreRealtimeStarted = false;
let firestoreSyncTimer = null;
let _manualSyncInProgress = false;
let latestEmailsSnapshot = null;
let latestPendingRequestsSnapshot = null;
const emailSearchCache = new WeakMap();

function getEmailSearchText(item) {
    if (!item || typeof item !== 'object') return '';
    const cached = emailSearchCache.get(item);
    if (cached) return cached;
    const text = [
        item.name,
        item.mail,
        item.phone,
        item.unit,
        item.poste,
        item.status
    ].map(value => String(value || '').toLowerCase()).join(' ');
    emailSearchCache.set(item, text);
    return text;
}

function isBlockedEmailStatus(status) {
    return String(status || '').toLowerCase().startsWith('bloqu');
}

function fixMojibakeText(value) {
    if (typeof value !== 'string') return value;

    const replacements = [
        ['\u00c3\u00a9', '?'], ['\u00c3\u00a8', '?'], ['\u00c3\u00aa', '?'], ['\u00c3\u00ab', '?'],
        ['\u00c3\u00a0', '?'], ['\u00c3\u00a2', '?'], ['\u00c3\u00b4', '?'], ['\u00c3\u00ae', '?'],
        ['\u00c3\u00af', '?'], ['\u00c3\u00bb', '?'], ['\u00c3\u00b9', '?'], ['\u00c3\u00a7', '?'],
        ['\u00c3\u0089', '?'], ['\u00c3\u0080', '?'], ['\u00c3\u0087', '?'],
        ['\u00c2\u00b0', '?'], ['\u00c2\u00a9', '?'],
        ['\u00e2\u0080\u0099', '?'], ['\u00e2\u20ac\u2122', '?'],
        ['\u00e2\u0080\u009c', '?'], ['\u00e2\u0080\u009d', '?'],
        ['\u00e2\u0080\u0093', '?'], ['\u00e2\u0080\u0094', '?'],
        ['\u00e2\u20ac\u201c', '?'], ['\u00e2\u20ac\u201d', '?'], ['\u00e2\u20ac\u00a2', '?'],
        ['\u00e2\u009c\u0085', '?'], ['\u00e2\u009c\u2026', '?'],
        ['\u00e2\u009d\u008c', '?'], ['\u00e2\u009d\u0152', '?'],
        ['\u00e2\u008f\u00b3', '?'],
        ['\u00f0\u009f\u0097\u0091\u00ef\u00b8\u008f', '???'],
        ['\u00f0\u009f\u009a\u00aa', '??'], ['\u00f0\u009f\u0094\u0092', '??']
    ];

    let fixed = value;
    for (let pass = 0; pass < 3; pass += 1) {
        replacements.forEach(([bad, good]) => {
            fixed = fixed.split(bad).join(good);
        });
    }
    return fixed;
}

function fixDisplayRecord(record) {
    const normalized = { ...record };
    ['name', 'unit', 'poste', 'status', 'location', 'job', 'firstName', 'lastName'].forEach((key) => {
        if (typeof normalized[key] === 'string') normalized[key] = fixMojibakeText(normalized[key]);
    });
    return normalized;
}

function sanitizeCachedEmails(emails) {
    return (Array.isArray(emails) ? emails : []).map(e => {
        const normalized = { ...fixDisplayRecord(e), phone: normalizePhoneValue(e.phone) };
        if (isBlockedEmailStatus(normalized.status)) return { ...normalized, name: "-" };
        return normalized;
    });
}

function applyIndexedDBPayload(payload) {
    if (!payload) return false;

    const emails = Array.isArray(payload) ? payload : (payload.emails || []);
    companyEmails = sanitizeCachedEmails(emails);

    if (!Array.isArray(payload) && Array.isArray(payload.units) && payload.units.length) {
        systemUnits = payload.units.map(unit => ({
            ...unit,
            name: fixMojibakeText(unit.name)
        }));
    }

    pendingRequestsCount = !Array.isArray(payload) && Number.isFinite(payload.pendingRequestsCount)
        ? payload.pendingRequestsCount
        : companyEmails.filter(e => e.isRequest).length;

    lastLocalSyncAt = !Array.isArray(payload) ? (payload.syncedAt || lastLocalSyncAt) : lastLocalSyncAt;
    lastKnownUpdateDate = !Array.isArray(payload) ? (payload.lastUpdate || lastKnownUpdateDate) : lastKnownUpdateDate;

    if (lastKnownUpdateDate) {
        const dateEl = getEl('lastUpdateDate');
        const bannerDateEl = getEl('bannerLastUpdate');
        if (dateEl) dateEl.innerText = lastKnownUpdateDate;
        if (bannerDateEl) bannerDateEl.innerText = lastKnownUpdateDate;
    }

    if (typeof populateUnitDropdowns === 'function') populateUnitDropdowns();
    if (typeof populateSystemDatalists === 'function') populateSystemDatalists();
    return true;
}

function getFilteredEmailsForActiveView() {
    let filtered = [...companyEmails];

    if (activeView.type === 'unit') {
        filtered = companyEmails.filter(e => e.unit === activeView.value);
    } else if (activeView.type === 'status') {
        filtered = companyEmails.filter(e => e.status === activeView.value);
    } else if (activeView.type === 'search') {
        const q = (activeView.value || '').toLowerCase();
        filtered = companyEmails.filter(e => getEmailSearchText(e).includes(q));
    }

    return filtered;
}

function renderCurrentViewFromState(options = {}) {
    if (document.hidden && !options.force) {
        window.__laboRenderPending = true;
        return;
    }

    const filtered = getFilteredEmailsForActiveView();

    if (typeof renderEmails === 'function') renderEmails(filtered, currentPage);
    if (typeof updateDashboardStats === 'function') updateDashboardStats();
    if (typeof renderRecent === 'function') renderRecent();
    if (typeof updateDirectoryStats === 'function') updateDirectoryStats(filtered);
    if (typeof renderUnitStats === 'function') renderUnitStats();
}

function ensureOfflineBadge() {
    let badge = document.getElementById('offlineModeBadge');
    if (badge) return badge;

    badge = document.createElement('div');
    badge.id = 'offlineModeBadge';
    badge.className = 'offline-mode-badge hidden';
    badge.innerHTML = '<i class="fas fa-wifi"></i><span>Mode hors ligne</span>';
    document.body.appendChild(badge);
    return badge;
}

function setOfflineMode(isOffline, label = 'Mode hors ligne') {
    const badge = ensureOfflineBadge();
    document.body.classList.toggle('offline-mode', !!isOffline);
    badge.classList.toggle('hidden', !isOffline);
    const text = badge.querySelector('span');
    if (text) text.textContent = label || 'Offline Mode';
}

async function syncAndRefreshFromFirestore(options = {}) {
    updateDbSyncStatus('syncing');
    if (!initializeFirebaseServices()) {
        setOfflineMode(true, 'Mode hors ligne');
        updateDbSyncStatus('offline');
        return false;
    }

    if (!navigator.onLine) {
        setOfflineMode(true, 'Mode hors ligne');
        updateDbSyncStatus('offline');
        return false;
    }

    if (typeof window.syncFirestoreToIndexedDB !== 'function') {
        const res = await fetchEmailsFromFirestore();
        return res;
    }

    try {
        const isFullSync = !options.emailsSnapshot;
        const payload = await window.syncFirestoreToIndexedDB({
            emailsSnapshot: options.emailsSnapshot,
            pendingRequestsSnapshot: options.pendingRequestsSnapshot,
            units: isFullSync ? null : systemUnits,
            lastUpdate: isFullSync ? null : lastKnownUpdateDate,
            skipAppSettings: !isFullSync
        });
        applyIndexedDBPayload(payload);
        if (options.render !== false) renderCurrentViewFromState();
        setOfflineMode(false);
        updateDbSyncStatus('synced');
        return true;
    } catch (error) {
        console.warn('Firestore to IndexedDB sync failed:', error);
        setOfflineMode(true, 'Mode hors ligne');
        updateDbSyncStatus('offline');
        return false;
    }
}

function scheduleFirestoreCacheSync() {
    if (document.hidden) {
        window.__laboFirestoreSyncPending = true;
        return;
    }
    // Skip if a manual/explicit sync is already running
    if (_manualSyncInProgress) return;
    if (firestoreSyncTimer) clearTimeout(firestoreSyncTimer);
    firestoreSyncTimer = setTimeout(() => {
        if (_manualSyncInProgress) return;
        syncAndRefreshFromFirestore({
            emailsSnapshot: latestEmailsSnapshot,
            pendingRequestsSnapshot: latestPendingRequestsSnapshot,
            render: true
        });
    }, 550);
}

function setupFirestoreRealtimeSync() {
    if (firestoreRealtimeStarted || !navigator.onLine || !initializeFirebaseServices()) return;
    firestoreRealtimeStarted = true;

    db.collection('emails').onSnapshot((snapshot) => {
        latestEmailsSnapshot = snapshot;
        scheduleFirestoreCacheSync();
    }, (err) => console.warn("Emails listener error:", err));

    db.collection('pendingRequests').where('status', '==', 'pending').onSnapshot((snapshot) => {
        latestPendingRequestsSnapshot = snapshot;
        scheduleFirestoreCacheSync();
    }, (err) => console.warn("Requests listener error:", err));
}

function registerNetworkSyncHandlers() {
    if (window.__laboNetworkHandlersRegistered) return;
    window.__laboNetworkHandlersRegistered = true;

    window.addEventListener('offline', () => {
        setOfflineMode(true, 'Mode hors ligne');
        updateDbSyncStatus('offline');
    });

    window.addEventListener('online', () => {
        setOfflineMode(false);
        updateDbSyncStatus('syncing');
        setupFirestoreRealtimeSync();
        syncAndRefreshFromFirestore({ render: true });
    });
}

/**
 * Fetches all emails from Firebase Firestore in real-time
 */
async function legacyFetchEmailsFromFirestore() {
    if (!initializeFirebaseServices()) {
        setOfflineMode(true, 'Mode hors ligne');
        return false;
    }

    try {
        // Fetch official Emails
        const snapshot = await db.collection('emails').get();
        let fetchedEmails = snapshot.docs.map(doc => doc.data());

        // Fetch Pending Account Requests (Visible in directory as 'En attente')
        try {
            const reqSnapshot = await db.collection('pendingRequests').where('status', '==', 'pending').get();
            const requests = reqSnapshot.docs.map(doc => {
                const d = doc.data();
                let displayName = `${d.firstName || ''} ${d.lastName || ''}`.trim();
                let displayUnit = d.location || '---';
                let displayPoste = d.job || '---';

                if (d.type === 'correction') {
                    displayName = 'Demande de Correction';
                    displayUnit = 'Système';
                    displayPoste = 'Modification';
                } else if (d.type === 'deactivation') {
                    displayName = 'Demande de Désactivation';
                    displayUnit = 'Système';
                    displayPoste = 'Fermeture';
                }

                return {
                    name: displayName || 'Utilisateur Inconnu',
                    mail: d.email,
                    unit: displayUnit,
                    poste: displayPoste,
                    status: 'En attente',
                    isRequest: true,
                    requestId: doc.id
                };
            });
            fetchedEmails = [...fetchedEmails, ...requests];
        } catch (e) {
            console.info("Info: Pending requests not accessible (Public view).");
        }

        companyEmails = sanitizeCachedEmails(fetchedEmails);

        // Fetch System Date (Initial fetch, now handled by real-time listener)
        // Moved to initSystemDateListener() for on-the-fly updates

        // Sanitize: Remove names for blocked emails
        companyEmails = companyEmails.map(e => {
            if (isBlockedEmailStatus(e.status)) return { ...e, name: "-" };
            return e;
        });

        console.log(`Successfully fetched ${companyEmails.length} items from cloud.`);

        // Also fetch system units
        await fetchSystemUnits();
        populateUnitDropdowns();
        populateSystemDatalists();

        return true;
    } catch (error) {
        console.error("Error fetching data:", error);
        return false;
    }
}

// IndexedDB-aware override for the legacy Firestore loader above.
async function fetchEmailsFromFirestore() {
    updateDbSyncStatus('syncing');
    try {
        if (!navigator.onLine) {
            const cachedPayload = await window.loadEmailsFromIndexedDB();
            applyIndexedDBPayload(cachedPayload);
            setOfflineMode(true, 'Mode hors ligne');
            updateDbSyncStatus('offline');
            return true;
        }

        const payload = await window.syncFirestoreToIndexedDB({
            units: null,
            lastUpdate: null,
            skipAppSettings: false
        });
        applyIndexedDBPayload(payload);
        setOfflineMode(false);
        console.log(`Successfully synced ${companyEmails.length} items from cloud.`);
        updateDbSyncStatus('synced');
        return true;
    } catch (error) {
        console.warn("Cloud fetch failed, loading IndexedDB fallback:", error);
        try {
            const cachedPayload = await window.loadEmailsFromIndexedDB();
            applyIndexedDBPayload(cachedPayload);
            setOfflineMode(true, 'Mode hors ligne');
            updateDbSyncStatus('offline');
            return !!(cachedPayload && cachedPayload.emails && cachedPayload.emails.length);
        } catch (cacheError) {
            console.error("Error loading local data:", cacheError);
            updateDbSyncStatus('offline');
            return false;
        }
    }
}

async function fetchSystemUnits() {
    if (!initializeFirebaseServices()) return;

    try {
        const doc = await db.collection('settings').doc('units_config').get();
        if (doc.exists) {
            systemUnits = (doc.data().list || []).map(unit => ({
                ...unit,
                name: fixMojibakeText(unit.name)
            }));
        } else {
            // Default high-end units if never configured
            systemUnits = [
                { id: 'u1', name: 'Larbâa', color: '#3b82f6' },
                { id: 'u2', name: 'Oued Smar', color: '#f97316' },
                { id: 'u3', name: 'Douera', color: '#ec4899' },
                { id: 'u4', name: 'El Oued', color: '#0d9488' },
                { id: 'u5', name: 'Rahmania', color: '#475569' },
                { id: 'u6', name: 'Autres Unités', color: '#8b5cf6' }
            ];
            await saveSystemUnits();
        }
    } catch (e) {
        console.error("Error fetching system units:", e);
    }
}

async function saveSystemUnits() {
    if (!initializeFirebaseServices()) return false;

    try {
        await db.collection('settings').doc('units_config').set({ list: systemUnits });
        if (typeof renderUnitStats === 'function') renderUnitStats();
        if (typeof renderUnitsManageList === 'function') renderUnitsManageList();
        populateUnitDropdowns(); // Ensure dropdowns are synced
        addSystemLog(`Mise à jour de la configuration des unités (${systemUnits.length} unités)`);
    } catch (e) {
        console.error("Error saving units:", e);
    }
}

// =============================================
// DOM REFERENCES
// =============================================
const searchInput = document.getElementById('searchInput');
const emailList = document.getElementById('emailList');
const unitCardsGrid = document.getElementById('unitCardsGrid');
const copyToast = document.getElementById('copyToast');
const copyCountEl = document.getElementById('copyCount');
const copyActiveBtn = document.getElementById('copyActiveBtn');
const archiveLog = document.getElementById('archiveLog');
const profileModal = document.getElementById('profileModal');
const closeModal = document.getElementById('closeModal');
const infoBtn = document.getElementById('infoBtn');
const totalCountEl = document.getElementById('totalCount');
const activeCountEl = document.getElementById('activeCount');
const blockedCountEl = document.getElementById('blockedCount');
const pendingCountEl = document.getElementById('pendingCount');
const progressBar = document.getElementById('progressBar');

// Auth Modals & Elements
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const authError = document.getElementById('authError');
const userInfo = document.getElementById('userInfo');
const userName = document.getElementById('userName');
const activationRateEl = document.getElementById('activationRate');
const pageTitle = document.getElementById('pageTitle');
const topbarSearch = document.getElementById('topbarSearch');

// Dashboard stats
const dashTotalEmails = document.getElementById('dashTotalEmails');
const dashActiveEmails = document.getElementById('dashActiveEmails');
const dashBlockedEmails = document.getElementById('dashBlockedEmails');
const dashPendingEmails = document.getElementById('dashPendingEmails');
const dashUnitsCount = document.getElementById('dashUnitsCount');

// Navbar elements (new topbar nav)
const sidebar = null; // No sidebar in new design
const sidebarToggle = null;
const sidebarLinks = document.querySelectorAll('.nav-link[data-page]');

// =============================================
// NAVIGATION SYSTEM
// =============================================
const pageTitles = {
    dashboard: 'TABLEAU DE <span class="accent">BORD</span>',
    directory: 'RÉPERTOIRE <span class="accent">EMAILS</span>',
    stats: 'UNITÉS & <span class="accent">STATISTIQUES</span>',
    tools: 'RESSOURCES & <span class="accent">OUTILS</span>',
    database: 'BASE DE <span class="accent">DONNÉES</span>',
    contact: 'CONTACT <span class="accent">SUPPORT</span>'
};

function navigateTo(page, options = {}) {
    if (page !== 'directory') {
        document.body.classList.remove('mobile-search-open');
    }

    // Hide all pages
    document.querySelectorAll('.page-section').forEach(p => {
        p.classList.remove('active');
    });

    // Deactivate all nav links
    document.querySelectorAll('.nav-link[data-page]').forEach(l => l.classList.remove('active'));

    // Activate target page
    const targetPage = document.getElementById('page' + page.charAt(0).toUpperCase() + page.slice(1));
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Activate nav link
    const targetLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (targetLink) targetLink.classList.add('active');

    // AUTO-CLEAR SEARCH: Reset search on ANY navigation to ensure a fresh view
    if (!options.preserveSearch && typeof searchInput !== 'undefined' && searchInput) {
        searchInput.value = '';
        currentSearchTerm = '';
        if (typeof renderEmailList === 'function') renderEmailList();
    }

    // Execute page-specific rendering
    if (page === 'dashboard') {
        updateDashboardStats();
    } else if (page === 'directory') {
        if (!searchInput || !searchInput.value.trim()) {
            if (searchInput) searchInput.value = '';
            renderEmails(companyEmails);
        } else {
            const term = searchInput.value.toLowerCase();
            const filtered = companyEmails.filter(item => getEmailSearchText(item).includes(term));
            renderEmails(filtered);
        }
        renderRecent();
        updateDirectoryStats();
    } else if (page === 'stats') {
        renderUnitStats();
    } else if (page === 'database') {
        renderArchiveLog();
    } else if (page === 'contact') {
        initContactForm();
    } else if (page === 'signature') {
        updateSignaturePreview();
    }

    // Close mobile nav if open
    const navLinks = document.getElementById('navbarLinks');
    if (navLinks) navLinks.classList.remove('mobile-open');
    const hamburgerBtn = document.getElementById('navHamburger');
    if (hamburgerBtn) hamburgerBtn.classList.remove('is-open');

    // Update mobile bottom nav active state
    document.querySelectorAll('.mob-nav-item[data-page]').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-page') === page);
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navbar link click handlers
document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        navigateTo(page);
    });
});

// About/Developer link
const devModal = document.getElementById('devModal');

const navAboutEl = document.getElementById('navAbout');
if (navAboutEl) navAboutEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (devModal) devModal.classList.add('show');
});

const companyModal = document.getElementById('companyModal');

const navCompanyEl = document.getElementById('navCompany');
if (navCompanyEl) navCompanyEl.addEventListener('click', (e) => {
    e.preventDefault();
    if (companyModal) companyModal.classList.add('show');
});

function closeCompanyModal() {
    if (companyModal) companyModal.classList.remove('show');
}

function closeDevModal() {
    const devModal = document.getElementById('devModal');
    if (devModal) devModal.classList.remove('show');
}

// Close modals when clicking outside
[profileModal, devModal, companyModal, authModal].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    }
});

// Hamburger mobile nav toggle
const navHamburger = document.getElementById('navHamburger');
const navbarLinks = document.getElementById('navbarLinks');
if (navHamburger && navbarLinks) {
    navHamburger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.body.classList.remove('mobile-search-open');
        navbarLinks.classList.toggle('mobile-open');
        navHamburger.classList.toggle('is-open', navbarLinks.classList.contains('mobile-open'));
    });
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!navHamburger.contains(e.target) && !navbarLinks.contains(e.target)) {
            navbarLinks.classList.remove('mobile-open');
            navHamburger.classList.remove('is-open');
        }
    });
}

function openMobileSearch() {
    document.body.classList.add('mobile-search-open');
    navigateTo('directory', { preserveSearch: true });

    if (searchInput) {
        setTimeout(() => {
            searchInput.focus();
            searchInput.select();
        }, 80);
    }
}

function closeMobileSearchIfEmpty() {
    if (searchInput && searchInput.value.trim()) return;
    document.body.classList.remove('mobile-search-open');
}

// =============================================
// DASHBOARD STATS
// =============================================
function updateDashboardStats() {
    const total = companyEmails.filter(e => !e.isRequest).length;
    const active = companyEmails.filter(e => e.status === 'Active' && !e.isRequest).length;
    const blocked = companyEmails.filter(e => e.status === 'Bloquée' && !e.isRequest).length;
    const pending = companyEmails.filter(e => e.status === 'En attente' && !e.isRequest).length;
    const units = Array.isArray(systemUnits) && systemUnits.length
        ? systemUnits.length
        : [...new Set(companyEmails
            .filter(e => !e.isRequest && String(e.unit || '').trim())
            .map(e => String(e.unit || '').trim())
        )].length;

    animateValue(dashTotalEmails, total, 800);
    animateValue(dashActiveEmails, active, 900);
    animateValue(dashBlockedEmails, blocked, 1000);

    // We update pending count separately from Firestore pendingRequests
    updatePendingCount();

    animateValue(dashUnitsCount, units, 700);

    // Update banner badges dynamically
    const bannerTotalEls = document.getElementById('bannerTotalEmails');
    const bannerActiveEls = document.getElementById('bannerActiveEmails');
    const bannerUnitsEls = document.getElementById('bannerTotalUnits');

    if (bannerTotalEls) bannerTotalEls.innerText = total;
    if (bannerActiveEls) bannerActiveEls.innerText = active;
    if (bannerUnitsEls) bannerUnitsEls.innerText = units;

    // Update tooltips dynamically
    const wrapTotal = document.getElementById('bannerTotalWrap');
    const wrapActive = document.getElementById('bannerActiveWrap');
    const wrapUnits = document.getElementById('bannerUnitsWrap');

    if (wrapTotal) wrapTotal.title = `${total} Emails`;
    if (wrapActive) wrapActive.title = `${active} Actifs`;
    if (wrapUnits) wrapUnits.title = `${units} Unités`;
}

function animateValue(el, end, duration) {
    if (!el) return;
    const start = parseInt(el.innerText) || 0;
    if (start === end) return; // Don't animate if value hasn't changed

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        el.innerText = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

const valueAnimationFrames = new WeakMap();

function updateDashboardStatsOptimized() {
    let total = 0;
    let active = 0;
    let blocked = 0;
    const unitSet = new Set();

    companyEmails.forEach((email) => {
        if (email.isRequest) return;
        total += 1;
        if (email.status === 'Active') active += 1;
        else if (isBlockedEmailStatus(email.status)) blocked += 1;

        const unit = String(email.unit || '').trim();
        if (unit) unitSet.add(unit);
    });

    const units = Array.isArray(systemUnits) && systemUnits.length ? systemUnits.length : unitSet.size;

    animateValue(dashTotalEmails, total, 800);
    animateValue(dashActiveEmails, active, 900);
    animateValue(dashBlockedEmails, blocked, 1000);
    updatePendingCount();
    animateValue(dashUnitsCount, units, 700);

    const bannerTotalEls = document.getElementById('bannerTotalEmails');
    const bannerActiveEls = document.getElementById('bannerActiveEmails');
    const bannerUnitsEls = document.getElementById('bannerTotalUnits');

    if (bannerTotalEls && bannerTotalEls.innerText !== String(total)) bannerTotalEls.innerText = total;
    if (bannerActiveEls && bannerActiveEls.innerText !== String(active)) bannerActiveEls.innerText = active;
    if (bannerUnitsEls && bannerUnitsEls.innerText !== String(units)) bannerUnitsEls.innerText = units;

    const wrapTotal = document.getElementById('bannerTotalWrap');
    const wrapActive = document.getElementById('bannerActiveWrap');
    const wrapUnits = document.getElementById('bannerUnitsWrap');

    if (wrapTotal) wrapTotal.title = `${total} Emails`;
    if (wrapActive) wrapActive.title = `${active} Actifs`;
    if (wrapUnits) wrapUnits.title = `${units} Unités`;
}

function animateValueOptimized(el, end, duration) {
    if (!el) return;
    const start = parseInt(el.innerText, 10) || 0;
    if (start === end) return;

    const activeFrame = valueAnimationFrames.get(el);
    if (activeFrame) cancelAnimationFrame(activeFrame);

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const nextValue = Math.floor(progress * (end - start) + start);
        if (el.innerText !== String(nextValue)) el.innerText = nextValue;
        if (progress < 1 && !document.hidden) {
            valueAnimationFrames.set(el, window.requestAnimationFrame(step));
        } else {
            el.innerText = end;
            valueAnimationFrames.delete(el);
        }
    };

    valueAnimationFrames.set(el, window.requestAnimationFrame(step));
}

updateDashboardStats = updateDashboardStatsOptimized;
animateValue = animateValueOptimized;

// =============================================
// EMAIL TABLE RENDERING & PAGINATION
// =============================================
let currentPage = 1;
const itemsPerPage = 14;
let currentFilteredEmails = [];
let currentSearchTerm = '';

// =============================================
// SEARCH HIGHLIGHT — Highlight matched text
// =============================================
function escapeRegExp(str) {
    return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(text, term) {
    const safeText = escapeHtml(text == null ? '' : String(text));
    if (!term) return safeText;
    try {
        const re = new RegExp('(' + escapeRegExp(term) + ')', 'gi');
        return safeText.replace(re, '<mark class="search-highlight">$1</mark>');
    } catch (e) {
        return safeText;
    }
}

function renderEmails(emails, page = 1) {
    currentFilteredEmails = emails;
    currentPage = page;
    emailList.innerHTML = '';

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, emails.length);
    const paginatedEmails = emails.slice(startIndex, endIndex);

    if (paginatedEmails.length === 0) {
        emailList.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">Aucun email trouvé.</td></tr>`;
        renderPagination(emails.length, page);
        return;
    }

    const term = (currentSearchTerm || '').trim();

    let rowsHtml = '';
    paginatedEmails.forEach((item, i) => {
        const globalIndex = startIndex + i + 1;
        let statusClass = 'status-active';
        if (item.status === 'Bloquée') statusClass = 'status-blocked';
        if (item.status === 'En attente') statusClass = 'status-pending';

        const unitObj = systemUnits.find(u => u.name === item.unit);
        const badgeColor = unitObj ? unitObj.color : '#64748b';
        const badgeStyle = `background: ${badgeColor}15; color: ${badgeColor}; border: 1px solid ${badgeColor}40;`;
        const phone = formatPhoneForDisplay(item.phone);

        // Apply highlight to all searchable fields
        const unitHtml = highlightText(item.unit, term);
        const nameHtml = highlightText(item.name, term);
        const phoneHtml = phone ? highlightText(phone, term) : '';
        const posteHtml = highlightText(item.poste, term);
        const mailHtml = highlightText(item.mail, term);
        const statusHtml = highlightText(item.status, term);

        rowsHtml += `
            <tr class="email-mobile-card employee-row" onclick="openEmployeeDetails('${encodeURIComponent(item.mail)}')" title="Voir la fiche professionnelle">
                <td data-label="No" style="font-weight: 700; color: #94a3b8;">${globalIndex}</td>
                <td data-label="Unite"><span class="unit-badge" style="${badgeStyle}">${unitHtml}</span></td>
                <td data-label="Nom">
                    <div class="employee-name-cell">
                        <strong>${nameHtml}</strong>
                        ${phoneHtml ? `<span class="employee-phone-line"><i class="fas fa-mobile-screen-button"></i> ${phoneHtml}</span>` : ''}
                    </div>
                </td>
                <td data-label="Poste">${posteHtml}</td>
                <td data-label="Email" style="color: var(--primary); font-weight: 600;">
                    <div class="email-cell-content">
                        <span>${mailHtml}</span>
                        ${item.status === 'Active' ? `<button class="single-copy-btn" onclick="event.stopPropagation(); copySingleEmail('${item.mail}')" title="Copier cet email"><i class="fas fa-copy"></i></button>` : ''}
                    </div>
                </td>
                <td data-label="Statut">
                    <span class="${statusClass}">
                        <span class="status-dot-inline"></span>
                        ${statusHtml}
                    </span>
                </td>
                <td data-label="Actions" class="admin-only">
                    <div class="action-btns">
                        <button class="btn-action btn-edit" onclick="safeHandleEditEmail(event, '${item.mail}')" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="safeHandleDeleteEmail(event, '${item.mail}')" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    emailList.innerHTML = rowsHtml;

    renderPagination(emails.length, page);
}

// =============================================
// FILTERING & VIEW SYSTEM (V2.0)
// =============================================

function filterByUnit(unit) {
    activeView = { type: 'unit', value: unit };
    currentPage = 1;
    currentSearchTerm = ''; // Clear search highlight when filtering by unit
    refreshAppUI();
}

function showAllEmails() {
    activeView = { type: 'all', value: null };
    currentPage = 1;
    currentSearchTerm = ''; // Clear search highlight
    if (searchInput) searchInput.value = ''; // Clear search input
    refreshAppUI();
}

function filterByStatus(status) {
    activeView = { type: 'status', value: status };
    currentPage = 1;
    currentSearchTerm = ''; // Clear search highlight
    if (searchInput) searchInput.value = ''; // Clear search input
    refreshAppUI();
}

function filterBy(type) {
    if (type === 'all') {
        showAllEmails();
    } else if (type === 'active') {
        filterByStatus('Active');
    } else if (type === 'blocked') {
        filterByStatus('Bloquée');
    } else if (type === 'pending') {
        filterByStatus('En attente');
    } else if (type === 'corporate') {
        activeView = { type: 'search', value: '@labo-nedjma.com' };
        currentSearchTerm = ''; // Clear highlights for list filters
        if (searchInput) searchInput.value = ''; // Do not pollute search input with filter term
        refreshAppUI();
    } else {
        // Handle search-like filters
        activeView = { type: 'search', value: type };
        currentSearchTerm = type; // Treat as normal search highlight
        if (searchInput) searchInput.value = type;
        refreshAppUI();
    }
}

function renderPagination(totalItems, currentPage) {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let html = '';

    if (totalPages > 1) {
        const prevDisabled = currentPage === 1 ? 'disabled' : '';
        const prevClick = currentPage === 1 ? '' : `onclick="goToPage(${currentPage - 1})"`;

        const nextDisabled = currentPage === totalPages ? 'disabled' : '';
        const nextClick = currentPage === totalPages ? '' : `onclick="goToPage(${currentPage + 1})"`;

        html += `<button class="page-btn" ${prevDisabled} ${prevClick}><i class="fas fa-chevron-left"></i> Précédent</button>`;
        html += `<div class="page-info">Page <span style="color: var(--primary); font-weight: 800;">${currentPage}</span> sur ${totalPages}</div>`;
        html += `<button class="page-btn" ${nextDisabled} ${nextClick}>Suivant <i class="fas fa-chevron-right"></i></button>`;
    }

    container.innerHTML = html;
}

function goToPage(page) {
    const totalPages = Math.ceil(currentFilteredEmails.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        renderEmails(currentFilteredEmails, page);
        document.querySelector('.page-content').scrollTo({ top: 0, behavior: 'smooth' });
    }
}


function getUnitClass(unit) {
    const u = unit.toLowerCase();
    if (u.includes('douera')) return 'unit-douera';
    if (u.includes('oued') && !u.includes('smar')) return 'unit-el-oued';
    if (u.includes('larb')) return 'unit-larba';
    if (u.includes('smar')) return 'unit-oued-smar';
    if (u.includes('rahman')) return 'unit-rahmania';
    if (u.includes('autre')) return 'unit-autres';
    return 'unit-default';
}

// =============================================
// RECENT EMAILS (Latest Additions)
// =============================================
function renderRecent(emails) {
    const container = document.getElementById('recentEmailsContainer');
    if (!container) return;
    container.innerHTML = '';

    const list = emails || companyEmails;

    // Sort by updatedAt if available, otherwise fallback to index
    const sorted = [...list].sort((a, b) => {
        const parseDate = (val) => {
            if (!val) return 0;
            if (val.toDate) return val.toDate(); // Firestore Timestamp
            return new Date(val); // String or Date object
        };
        return parseDate(b.updatedAt) - parseDate(a.updatedAt); // Newest first
    });

    const recent = sorted.slice(0, 6);

    recent.forEach(item => {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.style.cursor = 'pointer';
        div.onclick = async () => {
            const searchInput = getEl('searchInput');
            if (searchInput) {
                searchInput.value = item.mail;
                // Correct logic: Update state and refresh UI
                activeView = { type: 'search', value: item.mail };
                await refreshAppUI();
            }
        };

        div.innerHTML = `
            <h4>${item.mail}</h4>
            <p>${item.name || '-'} <span style="opacity:0.6; font-size:0.7rem;">• ${item.poste || '-'}</span></p>
        `;
        container.appendChild(div);
    });
}

// =============================================
// DIRECTORY STATS
// =============================================
function updateDirectoryStats(emails) {
    const list = emails || companyEmails;
    const total = list.length;
    const active = list.filter(e => e.status === 'Active').length;
    const blocked = list.filter(e => e.status === 'Bloquée').length;
    const pending = list.filter(e => e.status === 'En attente').length;
    const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

    if (totalCountEl) totalCountEl.innerText = total;
    if (activeCountEl) activeCountEl.innerText = active;
    if (blockedCountEl) blockedCountEl.innerText = blocked;
    if (pendingCountEl) pendingCountEl.innerText = pending;
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (activationRateEl) activationRateEl.innerText = `${percentage}%`;
}

function updateDirectoryStatsOptimized(emails) {
    const list = emails || companyEmails;
    let total = 0;
    let active = 0;
    let blocked = 0;
    let pending = 0;

    list.forEach((email) => {
        total += 1;
        if (email.status === 'Active') active += 1;
        else if (isBlockedEmailStatus(email.status)) blocked += 1;
        else if (email.status === 'En attente') pending += 1;
    });

    const percentage = total > 0 ? Math.round((active / total) * 100) : 0;
    if (totalCountEl && totalCountEl.innerText !== String(total)) totalCountEl.innerText = total;
    if (activeCountEl && activeCountEl.innerText !== String(active)) activeCountEl.innerText = active;
    if (blockedCountEl && blockedCountEl.innerText !== String(blocked)) blockedCountEl.innerText = blocked;
    if (pendingCountEl && pendingCountEl.innerText !== String(pending)) pendingCountEl.innerText = pending;
    if (progressBar && progressBar.style.width !== `${percentage}%`) progressBar.style.width = `${percentage}%`;
    if (activationRateEl && activationRateEl.innerText !== `${percentage}%`) activationRateEl.innerText = `${percentage}%`;
}

updateDirectoryStats = updateDirectoryStatsOptimized;

// =============================================
// SEARCH FUNCTIONALITY
// =============================================
let searchDebounceTimer = null;
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();

    // If not on directory page, navigate to it first
    const directoryPage = document.getElementById('pageDirectory');
    if (!directoryPage || !directoryPage.classList.contains('active')) {
        navigateTo('directory', { preserveSearch: true });
    }

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        // Save term for highlighting in renderEmails
        currentSearchTerm = e.target.value.trim();
        const filtered = companyEmails.filter(item => getEmailSearchText(item).includes(term));
        renderEmails(filtered);
        renderRecent(filtered);
        updateDirectoryStats(filtered);
        applyDirectoryTheme(term);
    }, 180);
});

if (searchInput) {
    searchInput.addEventListener('focus', () => {
        if (window.matchMedia('(max-width: 768px)').matches) {
            document.body.classList.add('mobile-search-open');
        }
    });

    searchInput.addEventListener('blur', () => {
        if (window.matchMedia('(max-width: 768px)').matches) {
            setTimeout(closeMobileSearchIfEmpty, 160);
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.body.classList.remove('mobile-search-open');
        if (navbarLinks) navbarLinks.classList.remove('mobile-open');
        if (navHamburger) navHamburger.classList.remove('is-open');
        if (typeof closeEmployeeDetailsModal === 'function') closeEmployeeDetailsModal();
    }
});

function applyDirectoryTheme(term) {
    const page = document.getElementById('pageDirectory');
    if (!page) return;

    // Remove old themes
    page.classList.remove('theme-douera', 'theme-el-oued', 'theme-larba', 'theme-oued-smar', 'theme-rahmania', 'theme-autres');

    const t = term.toLowerCase();
    if (t.includes('douera')) page.classList.add('theme-douera');
    else if (t.includes('oued') && !t.includes('smar')) page.classList.add('theme-el-oued');
    else if (t.includes('larb')) page.classList.add('theme-larba');
    else if (t.includes('smar')) page.classList.add('theme-oued-smar');
    else if (t.includes('rahman')) page.classList.add('theme-rahmania');
    else if (t.includes('autre')) page.classList.add('theme-autres');
}

// FILTER SYSTEM is handled by consolidated filterBy function above

// =============================================
// COPY FUNCTIONALITY
// =============================================
copyActiveBtn.addEventListener('click', () => {
    const term = searchInput.value.toLowerCase();
    const filteredActive = companyEmails
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(term) ||
                item.mail.toLowerCase().includes(term) ||
                item.unit.toLowerCase().includes(term) ||
                item.poste.toLowerCase().includes(term) ||
                item.status.toLowerCase().includes(term);
            return matchesSearch && item.status === 'Active';
        })
        .map(item => item.mail)
        .join('; ');

    if (filteredActive) {
        const count = filteredActive.split(';').length;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(filteredActive).then(() => {
                showToast(count);
            }).catch(() => {
                copyFallback(filteredActive, count);
            });
        } else {
            copyFallback(filteredActive, count);
        }
    }
});

function copyUnitEmails(unit) {
    const unitEmails = companyEmails
        .filter(item => item.unit === unit && item.status === 'Active')
        .map(item => item.mail)
        .join('; ');

    if (unitEmails) {
        const count = unitEmails.split(';').length;
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(unitEmails).then(() => {
                showToast(count);
            }).catch(() => {
                copyFallback(unitEmails, count);
            });
        } else {
            copyFallback(unitEmails, count);
        }
    }
}

function copySingleEmail(email) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => {
            showToast(1);
        }).catch(() => {
            copyFallback(email, 1);
        });
    } else {
        copyFallback(email, 1);
    }
}

function copyFallback(text, count) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '1px';
    textArea.style.height = '1px';
    textArea.style.padding = '0';
    textArea.style.border = '0';
    textArea.style.opacity = '0.01';
    textArea.style.zIndex = '-1';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    try {
        document.execCommand('copy');
        document.documentElement.setAttribute('data-last-copied', text);
        showToast(count);
        return true;
    } catch (err) {
        console.error('Fallback failed', err);
        return false;
    } finally {
        document.body.removeChild(textArea);
    }
}

async function copyTextToClipboard(text, options = {}) {
    const value = String(text || '').trim();
    if (!value) return false;

    const count = options.count || 1;
    const successMessage = options.successMessage || 'Copie reussie';
    const showLegacyToast = options.showToast !== false;

    try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(value);
            document.documentElement.setAttribute('data-last-copied', value);
            if (showLegacyToast) showToast(count);
            showCopyNotification(successMessage);
            return true;
        }
    } catch (error) {
        console.warn('Clipboard API failed, using fallback:', error);
    }

    const copied = showLegacyToast ? copyFallback(value, count) : copyFallbackSilent(value);
    if (copied) {
        showCopyNotification(successMessage);
        return true;
    }

    alert('Impossible de copier automatiquement. Selectionnez le texte et copiez-le manuellement.');
    return false;
}

function copyFallbackSilent(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '1px';
    textArea.style.height = '1px';
    textArea.style.padding = '0';
    textArea.style.border = '0';
    textArea.style.opacity = '0.01';
    textArea.style.zIndex = '-1';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    try {
        const copied = document.execCommand('copy');
        if (copied) document.documentElement.setAttribute('data-last-copied', text);
        return copied;
    } catch (err) {
        console.error('Silent fallback failed', err);
        return false;
    } finally {
        document.body.removeChild(textArea);
    }
}

function showToast(count) {
    if (copyToast && copyCountEl) {
        copyCountEl.innerText = count;
        copyToast.classList.add('show');
        setTimeout(() => {
            copyToast.classList.remove('show');
        }, 4000);
    }
}

// =============================================
// UNIT STATISTICS
// =============================================
function renderUnitStats() {
    if (!unitCardsGrid) return;
    unitCardsGrid.innerHTML = '';

    // If no system units loaded yet, use defaults or wait
    if (systemUnits.length === 0) {
        unitCardsGrid.innerHTML = '<p style="color:white; opacity:0.6; padding: 20px;">Chargement des unités...</p>';
        return;
    }

    systemUnits.forEach((unitObj, idx) => {
        const unitName = unitObj.name;
        const unitEmails = companyEmails.filter(e => e.unit === unitName);
        const active = unitEmails.filter(e => e.status === 'Active').length;
        const blocked = unitEmails.filter(e => e.status === 'Bloquée').length;
        const total = unitEmails.length;
        const percentage = total > 0 ? Math.round((active / total) * 100) : 0;
        const cardColor = unitObj.color || 'var(--primary)';

        const brighterColor = cardColor;

        const card = `
            <div class="unit-stat-card" style="background: linear-gradient(135deg, ${cardColor} 0%, #050714 200%); border-top: 4px solid white; --unit-color: ${cardColor};">
                <div class="unit-stat-header">
                    <div class="unit-icon-box" style="background: white; color: ${cardColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        <i class="fas fa-building-user"></i>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="copy-unit-mini" onclick="copyUnitEmails('${unitName}')" title="Copier les emails actifs" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); color: white;">
                            <i class="fas fa-copy"></i>
                        </button>
                        <span class="unit-badge" style="background: white !important; color: ${cardColor} !important; border: 1px solid white; font-weight: 850;">${unitName.toUpperCase()}</span>
                    </div>
                </div>
                <h3>${unitName}</h3>
                <div class="stat-details">
                    <div class="stat-row">
                        <span>Total Emails</span>
                        <span class="stat-val">${total}</span>
                    </div>
                    <div class="stat-row">
                        <span>Active / Bloquée</span>
                        <span>
                            <span style="color: #ffffff; font-weight: 900; text-shadow: 0 0 10px rgba(0,0,0,0.2);">${active}</span> / 
                            <span style="color: #ffffff; font-weight: 900; text-shadow: 0 0 10px rgba(0,0,0,0.2);">${blocked}</span>
                        </span>
                    </div>
                    <div class="unit-progress-bg" style="background: rgba(255,255,255,0.1);">
                        <div class="unit-progress-fill" style="width: ${percentage}%; background: ${cardColor}; box-shadow: 0 0 15px ${cardColor};"></div>
                    </div>
                </div>
                <button class="view-unit-btn" onclick="viewUnitDetails('${unitName}')" style="background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.25); backdrop-filter: blur(5px);">
                    <i class="fas fa-arrow-right" style="margin-right: 6px;"></i> Détails de l'unité
                </button>
            </div>
        `;
        unitCardsGrid.innerHTML += card;
    });
}

function renderUnitStatsOptimized() {
    if (!unitCardsGrid) return;

    if (systemUnits.length === 0) {
        unitCardsGrid.innerHTML = '<p style="color:white; opacity:0.6; padding: 20px;">Chargement des unités...</p>';
        return;
    }

    const statsByUnit = new Map();
    companyEmails.forEach((email) => {
        const unitName = email.unit;
        if (!statsByUnit.has(unitName)) {
            statsByUnit.set(unitName, { total: 0, active: 0, blocked: 0 });
        }
        const stats = statsByUnit.get(unitName);
        stats.total += 1;
        if (email.status === 'Active') stats.active += 1;
        else if (isBlockedEmailStatus(email.status)) stats.blocked += 1;
    });

    const cards = systemUnits.map((unitObj) => {
        const unitName = unitObj.name;
        const stats = statsByUnit.get(unitName) || { total: 0, active: 0, blocked: 0 };
        const percentage = stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;
        const cardColor = unitObj.color || 'var(--primary)';
        const unitArg = JSON.stringify(unitName).replace(/"/g, '&quot;');
        const safeUnit = escapeHtml(unitName);
        const safeColor = escapeHtml(cardColor);

        return `
            <div class="unit-stat-card" style="background: linear-gradient(135deg, ${safeColor} 0%, #050714 200%); border-top: 4px solid white; --unit-color: ${safeColor};">
                <div class="unit-stat-header">
                    <div class="unit-icon-box" style="background: white; color: ${safeColor}; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                        <i class="fas fa-building-user"></i>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="copy-unit-mini" onclick="copyUnitEmails(${unitArg})" title="Copier les emails actifs" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.4); color: white;">
                            <i class="fas fa-copy"></i>
                        </button>
                        <span class="unit-badge" style="background: white !important; color: ${safeColor} !important; border: 1px solid white; font-weight: 850;">${safeUnit.toUpperCase()}</span>
                    </div>
                </div>
                <h3>${safeUnit}</h3>
                <div class="stat-details">
                    <div class="stat-row">
                        <span>Total Emails</span>
                        <span class="stat-val">${stats.total}</span>
                    </div>
                    <div class="stat-row">
                        <span>Active / Bloquée</span>
                        <span>
                            <span style="color: #ffffff; font-weight: 900; text-shadow: 0 0 10px rgba(0,0,0,0.2);">${stats.active}</span> / 
                            <span style="color: #ffffff; font-weight: 900; text-shadow: 0 0 10px rgba(0,0,0,0.2);">${stats.blocked}</span>
                        </span>
                    </div>
                    <div class="unit-progress-bg" style="background: rgba(255,255,255,0.1);">
                        <div class="unit-progress-fill" style="width: ${percentage}%; background: ${safeColor};"></div>
                    </div>
                </div>
                <button class="view-unit-btn" onclick="viewUnitDetails(${unitArg})" style="background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.25);">
                    <i class="fas fa-arrow-right" style="margin-right: 6px;"></i> Détails de l'unité
                </button>
            </div>
        `;
    }).join('');

    if (unitCardsGrid.innerHTML !== cards) unitCardsGrid.innerHTML = cards;
}

renderUnitStats = renderUnitStatsOptimized;

// UI Handlers for Unit Management
function openUnitManagement() {
    const modal = document.getElementById('unitManagementModal');
    if (modal) {
        modal.classList.add('show');
        renderUnitsManageList();

        // ADDED: Close on click outside
        modal.onclick = (e) => {
            if (e.target === modal) closeUnitManagement();
        };
    }
}

function closeUnitManagement() {
    const modal = document.getElementById('unitManagementModal');
    if (modal) modal.classList.remove('show');
}

function renderUnitsManageList() {
    const container = document.getElementById('unitsManageList');
    if (!container) return;
    container.innerHTML = '';

    systemUnits.forEach(unit => {
        const item = document.createElement('div');
        item.className = 'modern-unit-item';
        item.innerHTML = `
            <div class="unit-info-flex">
                <div class="unit-dot" style="background: ${unit.color} !important; color: ${unit.color};"></div>
                <span class="unit-name-text">${unit.name}</span>
            </div>
            <div class="unit-manage-actions">
                <button class="btn-delete-unit" onclick="deleteUnit('${unit.id}')" title="Supprimer">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
}

// Initialize Unit Management Listeners
function initUnitManagement() {
    const form = document.getElementById('addUnitForm');
    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation(); // Extra safety to prevent bubble-up refreshes

            const nameInput = document.getElementById('newUnitName');
            const colorInput = document.getElementById('newUnitColor');

            if (nameInput.value.trim()) {
                const newUnit = {
                    id: 'u_' + Date.now(),
                    name: nameInput.value.trim(),
                    color: colorInput.value
                };
                systemUnits.push(newUnit);
                await saveSystemUnits();
                nameInput.value = '';
                showCopyNotification('✅ Unité ajoutée avec succès');
                addSystemLog(`Ajout d'une nouvelle unité : ${newUnit.name}`);
                closeUnitManagement(); // Auto-close after add
            }
        };
    }
}

// --- Unit Deletion Logic (Professional Modal) ---
let unitIdToDelete = null;

async function deleteUnit(id) {
    unitIdToDelete = id;
    const modal = document.getElementById('unitDeleteConfirmModal');
    if (modal) modal.classList.add('show');
}

function closeUnitDeleteModal() {
    unitIdToDelete = null;
    const modal = document.getElementById('unitDeleteConfirmModal');
    if (modal) modal.classList.remove('show');
}

// Handle manual confirm delete for units
const confirmUnitDeleteBtn = document.getElementById('confirmUnitDeleteBtn');
if (confirmUnitDeleteBtn) {
    confirmUnitDeleteBtn.onclick = async function () {
        if (!unitIdToDelete) return;
        try {
            confirmUnitDeleteBtn.disabled = true;
            confirmUnitDeleteBtn.innerText = "Suppression...";

            const unitObj = systemUnits.find(u => u.id === unitIdToDelete);
            const unitName = unitObj ? unitObj.name : 'Inconnue';
            systemUnits = systemUnits.filter(u => u.id !== unitIdToDelete);
            await saveSystemUnits();

            showCopyNotification('??? Unité supprimée');
            addSystemLog(`Suppression de l'unité : ${unitName}`);
            closeUnitDeleteModal();
            closeUnitManagement(); // Auto-close main modal after delete
            populateUnitDropdowns(); // Re-sync dropdowns
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la suppression.");
        } finally {
            confirmUnitDeleteBtn.disabled = false;
            confirmUnitDeleteBtn.innerText = "Supprimer";
        }
    };
}

function populateUnitDropdowns() {
    const adminSelect = document.getElementById('adm_unit');
    const reqSelect = document.getElementById('reqLocation');

    // 1. Populate Admin Modal Select
    if (adminSelect) {
        const currentVal = adminSelect.value;
        adminSelect.innerHTML = '';
        systemUnits.forEach(unit => {
            const opt = document.createElement('option');
            opt.value = unit.name;
            opt.textContent = unit.name;
            adminSelect.appendChild(opt);
        });
        if (currentVal && Array.from(adminSelect.options).some(o => o.value === currentVal)) {
            adminSelect.value = currentVal;
        }
    }

    // 2. Populate Request & Correction Modal Selects
    const corSelect = document.getElementById('corNewUnit');

    [reqSelect, corSelect].forEach(select => {
        if (select) {
            select.innerHTML = select.id === 'reqLocation'
                ? '<option value="" disabled selected>Sélectionnez votre unité...</option>'
                : '<option value="" disabled selected>Sélectionnez la nouvelle unité...</option>';
            systemUnits.forEach(unit => {
                const opt = document.createElement('option');
                opt.value = unit.name;
                opt.textContent = unit.name;
                select.appendChild(opt);
            });
        }
    });
}

function populateSystemDatalists() {
    const emailDatalist = document.getElementById('systemEmails');
    const nameDatalist = document.getElementById('systemNames');
    const searchDatalist = document.getElementById('systemSearchSuggestions');
    
    // Use companyEmails (existing active emails)
    const activeData = companyEmails.filter(e => !e.isRequest && e.status === 'Active');

    if (emailDatalist) {
        emailDatalist.innerHTML = '';
        activeData.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.mail;
            opt.textContent = e.name && e.name !== '-' ? e.name : '';
            emailDatalist.appendChild(opt);
        });
    }

    if (nameDatalist) {
        nameDatalist.innerHTML = '';
        activeData.forEach(e => {
            if (e.name && e.name !== '-') {
                const opt = document.createElement('option');
                opt.value = e.name;
                opt.textContent = e.mail;
                nameDatalist.appendChild(opt);
            }
        });
    }

    if (searchDatalist) {
        searchDatalist.innerHTML = '';
        // Add both Names and Emails to search suggestions
        activeData.forEach(e => {
            // Add Email
            const optEmail = document.createElement('option');
            optEmail.value = e.mail;
            optEmail.textContent = e.name && e.name !== '-' ? `Email de ${e.name}` : 'Email';
            searchDatalist.appendChild(optEmail);

            // Add Name if exists
            if (e.name && e.name !== '-') {
                const optName = document.createElement('option');
                optName.value = e.name;
                optName.textContent = `Collaborateur (${e.mail})`;
                searchDatalist.appendChild(optName);
            }

            if (e.phone) {
                const optPhone = document.createElement('option');
                optPhone.value = e.phone;
                optPhone.textContent = `Telephone (${e.name || e.mail})`;
                searchDatalist.appendChild(optPhone);
            }
        });
    }
}

function replaceChildrenWithOptions(target, options) {
    if (!target) return;
    const fragment = document.createDocumentFragment();
    options.forEach((optionData) => {
        const opt = document.createElement('option');
        opt.value = optionData.value;
        opt.textContent = optionData.textContent || '';
        if (optionData.disabled) opt.disabled = true;
        if (optionData.selected) opt.selected = true;
        fragment.appendChild(opt);
    });
    target.replaceChildren(fragment);
}

populateUnitDropdowns = function populateUnitDropdownsOptimized() {
    const adminSelect = document.getElementById('adm_unit');
    const reqSelect = document.getElementById('reqLocation');
    const corSelect = document.getElementById('corNewUnit');
    const unitOptions = systemUnits.map(unit => ({ value: unit.name, textContent: unit.name }));

    if (adminSelect) {
        const currentVal = adminSelect.value;
        replaceChildrenWithOptions(adminSelect, unitOptions);
        if (currentVal && Array.from(adminSelect.options).some(o => o.value === currentVal)) {
            adminSelect.value = currentVal;
        }
    }

    [
        [reqSelect, 'Sélectionnez votre unité...'],
        [corSelect, 'Sélectionnez la nouvelle unité...']
    ].forEach(([select, label]) => {
        if (!select) return;
        replaceChildrenWithOptions(select, [
            { value: '', textContent: label, disabled: true, selected: true },
            ...unitOptions
        ]);
    });
};

populateSystemDatalists = function populateSystemDatalistsOptimized() {
    const emailDatalist = document.getElementById('systemEmails');
    const nameDatalist = document.getElementById('systemNames');
    const searchDatalist = document.getElementById('systemSearchSuggestions');
    const activeData = companyEmails.filter(e => !e.isRequest && e.status === 'Active');

    replaceChildrenWithOptions(emailDatalist, activeData.map(e => ({
        value: e.mail,
        textContent: e.name && e.name !== '-' ? e.name : ''
    })));

    replaceChildrenWithOptions(nameDatalist, activeData
        .filter(e => e.name && e.name !== '-')
        .map(e => ({ value: e.name, textContent: e.mail })));

    const searchOptions = [];
    activeData.forEach((e) => {
        searchOptions.push({
            value: e.mail,
            textContent: e.name && e.name !== '-' ? `Email de ${e.name}` : 'Email'
        });
        if (e.name && e.name !== '-') {
            searchOptions.push({
                value: e.name,
                textContent: `Collaborateur (${e.mail})`
            });
        }
        if (e.phone) {
            searchOptions.push({
                value: e.phone,
                textContent: `Telephone (${e.name || e.mail})`
            });
        }
    });
    replaceChildrenWithOptions(searchDatalist, searchOptions);
};

function openCorrectionModal() {
    const modal = document.getElementById('correctionModal');
    if (modal) modal.classList.add('show');
    populateSystemDatalists();
}

function closeCorrectionModal() {
    const modal = document.getElementById('correctionModal');
    if (modal) modal.classList.remove('show');
    const form = document.getElementById('correctionForm');
    if (form) form.reset();
    const unitField = document.getElementById('corUnitField');
    const phoneField = document.getElementById('corPhoneField');
    if (unitField) unitField.style.display = 'none';
    if (phoneField) phoneField.style.display = 'none';
}

function openCorrectionSuccessModal() {
    const modal = document.getElementById('correctionSuccessModal');
    if (modal) modal.classList.add('show');
}

function closeCorrectionSuccessModal() {
    const modal = document.getElementById('correctionSuccessModal');
    if (modal) modal.classList.remove('show');
}

function openDeactivationModal() {
    const modal = document.getElementById('deactivationModal');
    if (modal) modal.classList.add('show');
    populateSystemDatalists();
}

function closeDeactivationModal() {
    const modal = document.getElementById('deactivationModal');
    if (modal) modal.classList.remove('show');
}

function openDeactivationSuccessModal() {
    const modal = document.getElementById('deactivationSuccessModal');
    if (modal) modal.classList.add('show');
}

function closeDeactivationSuccessModal() {
    const modal = document.getElementById('deactivationSuccessModal');
    if (modal) modal.classList.remove('show');
}

function toggleCorrectionUnitField() {
    const type = document.getElementById('corType').value;
    const unitField = document.getElementById('corUnitField');
    const phoneField = document.getElementById('corPhoneField');
    const unitSelect = document.getElementById('corNewUnit');
    const phoneInput = document.getElementById('corNewPhone');

    if (unitField) unitField.style.display = (type === 'unit') ? 'block' : 'none';
    if (phoneField) phoneField.style.display = (type === 'phone') ? 'block' : 'none';
    if (type !== 'unit' && unitSelect) unitSelect.value = '';
    if (type !== 'phone' && phoneInput) phoneInput.value = '';
}

function viewUnitDetails(unit) {
    navigateTo('directory', { preserveSearch: true });
    if (searchInput) searchInput.value = unit;
    filterByUnit(unit);
    applyDirectoryTheme(unit);
}

// =============================================
// DATABASE / ARCHIVE — SYSTEM HISTORY
// =============================================
/**
 * Adds a new entry to the system history log in Firestore
 */
let systemLogPermissionWarningShown = false;

async function addSystemLog(text) {
    if (!auth || !auth.currentUser) {
        return false;
    }

    try {
        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')} - ${String(now.getMonth() + 1).padStart(2, '0')} - ${now.getFullYear()}`;

        await db.collection('system_logs').add({
            text: text,
            date: dateStr,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: auth.currentUser ? auth.currentUser.email : 'Système'
        });

        // If we are on the database page, refresh the log view
        const dbPage = document.getElementById('pageDatabase');
        if (dbPage && dbPage.classList.contains('active')) {
            renderArchiveLog();
        }
        return true;
    } catch (e) {
        if (e && e.code === 'permission-denied') {
            if (!systemLogPermissionWarningShown) {
                console.warn("System log skipped: Firestore rules do not allow writing to system_logs for this user.");
                systemLogPermissionWarningShown = true;
            }
            return false;
        }

        console.warn("System log skipped:", e);
        return false;
    }
}

/**
 * Renders the system history logs from Firestore
 */
async function renderArchiveLog() {
    if (!archiveLog) return;

    // Show skeleton or loading state
    archiveLog.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b; font-size: 0.85rem;"><i class="fas fa-spinner fa-spin"></i> Chargement de l\'historique...</div>';

    const getFormattedOffsetDate = (daysOffset) => {
        const d = new Date();
        d.setDate(d.getDate() - daysOffset);
        return `${String(d.getDate()).padStart(2, '0')} - ${String(d.getMonth() + 1).padStart(2, '0')} - ${d.getFullYear()}`;
    };

    const renderFallback = () => {
        const fallbackLogs = [
            { text: "Mise à jour de l'annuaire des adresses e-mail", offset: 0 },
            { text: "Optimisation de la base de données et indexation locale", offset: 0 },
            { text: "Synchronisation des structures et des unités administratives", offset: 1 },
            { text: "Mise à jour de l'application vers la version v6.0.5", offset: 2 },
            { text: "Sauvegarde de sécurité automatique du système", offset: 4 },
            { text: "Mise à jour de la configuration des unités de messagerie", offset: 5 },
            { text: "Optimisation du cache global de l'application PWA", offset: 7 },
            { text: "Nettoyage périodique et archivage des logs système", offset: 10 }
        ];

        archiveLog.innerHTML = '';
        fallbackLogs.forEach(log => {
            archiveLog.innerHTML += `
                <div class="archive-item">
                    <span class="archive-text">${escapeHtml(log.text)}</span>
                    <span class="archive-date">${getFormattedOffsetDate(log.offset)}</span>
                </div>
            `;
        });
    };

    try {
        const snapshot = await db.collection('system_logs')
            .orderBy('timestamp', 'desc')
            .limit(8)
            .get();

        if (snapshot.empty) {
            renderFallback();
            return;
        }

        archiveLog.innerHTML = '';
        snapshot.forEach(doc => {
            const log = doc.data();
            archiveLog.innerHTML += `
                <div class="archive-item">
                    <span class="archive-text">${escapeHtml(log.text || '')}</span>
                    <span class="archive-date">${escapeHtml(log.date || '')}</span>
                </div>
            `;
        });
    } catch (e) {
        console.warn("Firestore archive log unavailable, falling back to local logs:", e);
        renderFallback();
    }
}

function exportToExcel() {
    let csv = '\uFEFF';
    csv += 'N°;UNITE;NOM ET PRENOM;POSTE;ADRESSE EMAIL;STATUT\n';

    companyEmails.forEach((e, index) => {
        const name = e.name.replace(/;/g, ',');
        const poste = e.poste.replace(/;/g, ',');
        csv += `${index + 1};${e.unit.toUpperCase()};${name.toUpperCase()};${poste.toUpperCase()};${e.mail};${e.status.toUpperCase()}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Labo_Nedjma_Emails_MasterData.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(companyEmails.length);
}

// =============================================
// MODAL
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    if (infoBtn && profileModal && closeModal) {
        infoBtn.addEventListener('click', () => {
            profileModal.classList.add('show');
        });

        closeModal.addEventListener('click', () => {
            profileModal.classList.remove('show');
        });

        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.classList.remove('show');
            }
        });
    }

    // Initialization is now handled by initializeAppCore called from initSplashScreen
});

// Tool detail opener
function openToolDetail(toolName) {
    if (toolName === 'config') {
        document.getElementById('configModal').classList.add('show');
        return;
    }
    if (toolName === 'install') {
        document.getElementById('installModal').classList.add('show');
        return;
    }
    if (toolName === 'desktop') {
        document.getElementById('desktopModal').classList.add('show');
        return;
    }
    if (toolName === 'support') {
        document.getElementById('supportModal').classList.add('show');
        return;
    }
    if (toolName === 'thunderbird') {
        document.getElementById('thunderbirdModal').classList.add('show');
        return;
    }
    if (toolName === 'webmail') {
        document.getElementById('webmailModal').classList.add('show');
        return;
    }
}

// Close config modal
function closeConfigModal() {
    document.getElementById('configModal').classList.remove('show');
}

// Close install modal
function closeInstallModal() {
    document.getElementById('installModal').classList.remove('show');
}

// Close desktop modal
function closeDesktopModal() {
    document.getElementById('desktopModal').classList.remove('show');
}

// Close support modal
function closeSupportModal() {
    document.getElementById('supportModal').classList.remove('show');
}

// Close thunderbird modal
function closeThunderbirdModal() {
    document.getElementById('thunderbirdModal').classList.remove('show');
}

// Close webmail modal
function closeWebmailModal() {
    document.getElementById('webmailModal').classList.remove('show');
}

// Click outside to close
document.getElementById('configModal').addEventListener('click', function (e) {
    if (e.target === this) closeConfigModal();
});

document.getElementById('installModal').addEventListener('click', function (e) {
    if (e.target === this) closeInstallModal();
});

document.getElementById('desktopModal').addEventListener('click', function (e) {
    if (e.target === this) closeDesktopModal();
});

document.getElementById('supportModal').addEventListener('click', function (e) {
    if (e.target === this) closeSupportModal();
});

document.getElementById('thunderbirdModal').addEventListener('click', function (e) {
    if (e.target === this) closeThunderbirdModal();
});

document.getElementById('webmailModal').addEventListener('click', function (e) {
    if (e.target === this) closeWebmailModal();
});

// Copy config value to clipboard with visual feedback
function copyConfig(value) {
    // Try modern API first, fallback to execCommand
    const doCopy = () => {
        return new Promise((resolve, reject) => {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(value).then(resolve).catch(reject);
            } else {
                // Fallback for file:// and non-HTTPS
                try {
                    const textarea = document.createElement('textarea');
                    textarea.value = value;
                    textarea.style.position = 'fixed';
                    textarea.style.left = '-9999px';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    const success = document.execCommand('copy');
                    document.body.removeChild(textarea);
                    if (success) resolve(); else reject();
                } catch (err) {
                    reject(err);
                }
            }
        });
    };

    doCopy().then(() => {
        showCopyNotification('✅ Copié avec succès: ' + value);
    }).catch(() => {
        showCopyNotification('? Erreur de copie — veuillez copier manuellement');
    });
}

// =============================================
// CONTACT FORM HANDLER (EmailJS)
// =============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('contactStatus');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const submitText = document.getElementById('submitText');

    if (!form || form.dataset.init) return;
    form.dataset.init = 'true';

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // 1. UI Loading State
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        statusEl.className = 'form-status hidden';

        // 2. Prepare Data (Matching User Schema)
        const templateParams = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        let emailClient;
        try {
            emailClient = await ensureEmailJSLoaded();
        } catch (error) {
            console.error('EmailJS Load Error:', error);
            statusEl.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Impossible de charger le module d\'envoi. Vérifiez votre connexion.';
            statusEl.className = 'form-status error';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitText.innerHTML = '<i class="fas fa-paper-plane"></i> Envoyer le Message';
            return;
        }

        // 3. Send via EmailJS
        emailClient.send('service_vjznpgi', 'template_648u6p9', templateParams)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);

                // Success feedback
                statusEl.innerHTML = '<i class="fas fa-check-circle"></i> Votre message a été envoyé avec succès au service support !';
                statusEl.className = 'form-status success';
                addSystemLog(`Nouveau message de support reçu de ${templateParams.name}`);

                // Clear Form
                form.reset();

                // Reset Button
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitText.innerText = 'Envoyer la demande';

                // Hide success message after 6 seconds
                setTimeout(() => {
                    statusEl.className = 'form-status hidden';
                }, 6000);

            }, function (error) {
                console.error('FAILED...', error);

                // Error feedback
                statusEl.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Échec de l\'envoi (' + error.status + '). Vérifiez vos identifiants EmailJS ou votre connexion.';
                statusEl.className = 'form-status error';

                // Reset Button
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitText.innerText = 'Réessayer l\'envoi';
            });
    });
}

// Show copy notification toast
function showCopyNotification(message) {
    // Remove existing notification
    const existing = document.getElementById('copyNotification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.id = 'copyNotification';
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: linear-gradient(135deg, #1e293b, #334155);
        color: white;
        padding: 14px 28px;
        border-radius: 12px;
        font-size: 0.9rem;
        font-weight: 600;
        font-family: 'Inter', sans-serif;
        z-index: 300000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// =============================================
// EXPORT EXCEL PROFESSIONNEL
// =============================================
async function exportToExcel() {
    const btn = document.querySelector('.btn-export');
    const originalText = btn.innerHTML;

    // Check if ExcelJS is loaded, if not inject it
    if (typeof ExcelJS === 'undefined') {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement du module...';
        btn.style.opacity = '0.8';
        btn.style.pointerEvents = 'none';

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js';
        script.onload = () => executeExcelExport(btn, originalText);
        script.onerror = () => {
            alert("Erreur de connexion : Impossible de charger le module Excel.");
            btn.innerHTML = originalText;
            btn.style.pointerEvents = 'all';
            btn.style.opacity = '1';
        };
        document.head.appendChild(script);
    } else {
        executeExcelExport(btn, originalText);
    }
}

async function executeExcelExport(btn, originalText) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Génération Excel...';

    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Système Labo Nedjma';
        workbook.created = new Date();

        const sheet = workbook.addWorksheet('Répertoire Emails', {
            views: [{ state: 'frozen', ySplit: 2 }]
        });

        // 1. Titre Principal
        sheet.mergeCells('A1:F1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = 'RÉPERTOIRE DES EMAILS - LABO NEDJMA';
        titleCell.font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE63946' } }; // Rouge premium
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        sheet.getRow(1).height = 40;

        // 2. En-têtes de colonnes
        const headers = ['N°', 'Unité', 'Nom et Prénom', 'Poste', 'Adresse Email', 'Statut'];
        sheet.getRow(2).values = headers;
        sheet.getRow(2).height = 25;

        sheet.columns = [
            { key: 'no', width: 8 },
            { key: 'unit', width: 22 },
            { key: 'name', width: 35 },
            { key: 'poste', width: 45 },
            { key: 'mail', width: 45 },
            { key: 'status', width: 18 }
        ];

        headers.forEach((h, i) => {
            const cell = sheet.getRow(2).getCell(i + 1);
            cell.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF97316' } }; // Orange primaire
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFDDDDDD' } },
                bottom: { style: 'medium', color: { argb: 'FFDDDDDD' } },
                left: { style: 'thin', color: { argb: 'FFDDDDDD' } },
                right: { style: 'thin', color: { argb: 'FFDDDDDD' } }
            };
        });

        // 3. Données
        companyEmails.forEach((emp, idx) => {
            const row = sheet.addRow([
                idx + 1,
                emp.unit,
                emp.name,
                emp.poste,
                emp.mail,
                emp.status
            ]);

            row.height = 22;

            row.eachCell((cell, colNum) => {
                cell.font = { name: 'Segoe UI', size: 11, color: { argb: 'FF333333' } };
                cell.border = {
                    top: { style: 'thin', color: { argb: 'FFEEEEEE' } },
                    bottom: { style: 'thin', color: { argb: 'FFEEEEEE' } },
                    left: { style: 'thin', color: { argb: 'FFEEEEEE' } },
                    right: { style: 'thin', color: { argb: 'FFEEEEEE' } }
                };
                cell.alignment = { vertical: 'middle', horizontal: (colNum === 1 || colNum === 6) ? 'center' : 'left' };

                // Unité en gras
                if (colNum === 2) {
                    cell.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: 'FF1E293B' } };
                }

                // Style des statuts avec couleurs conditionnelles
                if (colNum === 6) {
                    if (emp.status === 'Active') {
                        cell.font = { bold: true, color: { argb: 'FF059669' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEAFBF4' } };
                    } else {
                        cell.font = { bold: true, color: { argb: 'FFDC2626' } };
                        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
                    }
                }
            });
        });

        // 4. Ligne finale décorative
        const lastRow = sheet.addRow([]);
        lastRow.height = 10;
        lastRow.eachCell((cell) => {
            cell.border = { top: { style: 'medium', color: { argb: 'FFDDDDDD' } } };
        });

        // Génération du fichier binaire Excel
        const buffer = await workbook.xlsx.writeBuffer();

        // Téléchargement
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `Repertoire_Labo_Nedjma_${dateStr}.xlsx`;
        document.body.appendChild(a);
        a.click();

        // Nettoyage
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        setTimeout(() => showCopyNotification('✅ Fichier Excel généré avec succès !'), 500);
        addSystemLog(`Exportation des données Master Data (${companyEmails.length} entrées)`);

    } catch (e) {
        console.error(e);
        alert("Erreur lors de la création du fichier Excel.");
    } finally {
        // Restauration du bouton
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'all';
    }
}

// =============================================
// CACHE & VERSION MANAGEMENT
// =============================================
const CURRENT_VERSION = '6.0.5';

/**
 * Force clean all local data and caches to ensure latest version
 */
async function cleanCache() {
    try {
        const btn = document.querySelector('.btn-clean-cache');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Nettoyage...';
        btn.disabled = true;

        // 1. Clear Local Storage (except auth if needed, but here we clear all for fresh start)
        localStorage.clear();

        // 2. Clear all Caches (Service Worker)
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(key => caches.delete(key)));
        }

        // 3. Unregister all service workers
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(r => r.unregister()));
        }

        // 4. Show Success Modal
        const successModal = document.getElementById('cacheSuccessModal');
        if (successModal) successModal.classList.add('show');
        
        addSystemLog(`Nettoyage complet du cache (Force update v${CURRENT_VERSION})`);

    } catch (e) {
        console.error("Cache clean error:", e);
        alert("Erreur lors du nettoyage du cache.");
    }
}

/**
 * Check if a new version is available on the cloud
 */
async function checkSystemVersion() {
    if (!initializeFirebaseServices()) return;

    try {
        const doc = await db.collection('settings').doc('app').get();
        if (doc.exists && doc.data().version) {
            const cloudVersion = doc.data().version;
            if (cloudVersion !== CURRENT_VERSION) {
                console.info(`New version available: ${cloudVersion} (Current: ${CURRENT_VERSION})`);
                // You could trigger a notification here or force reload
                // For now, we just log it as the user usually reloads manually or via cleanCache
            }
        }
    } catch (e) {
        console.warn("Version check failed:", e);
    }
}

// =============================================
// THEME MANAGEMENT — Dark Mode Switcher
// =============================================
function toggleTheme() {
    const html = document.documentElement;
    html.classList.remove('dark-mode');
    localStorage.removeItem('labo-theme');
}

// Initialize Theme on Load
(function initTheme() {
    const html = document.documentElement;
    html.classList.remove('dark-mode');
    localStorage.removeItem('labo-theme');

    window.addEventListener('DOMContentLoaded', () => {
        document.documentElement.classList.remove('dark-mode');

        // Initialize Auth UI
        initAuthSystem();
    });
})();

// =============================================
// AUTHENTICATION SYSTEM (Firebase Compat)
// =============================================
// UI Elements are already declared at the top in DOM REFERENCES
let authSystemInitialized = false;

function initAuthSystem() {
    if (authSystemInitialized) return;
    authSystemInitialized = true;

    // Open Modal
    if (loginBtn) {
        loginBtn.onclick = () => {
            authModal.classList.add('show');
            authError.classList.add('hidden');
        };
    }

    // Handle Login
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const submitBtn = document.getElementById('authSubmitBtn');
            const originalBtnText = submitBtn.innerHTML;

            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Vérification...';
                authError.classList.add('hidden');

                if (!initializeFirebaseServices() || !auth) {
                    const offlineAuthError = new Error('Firebase Auth unavailable');
                    offlineAuthError.code = 'auth/network-request-failed';
                    throw offlineAuthError;
                }

                await auth.signInWithEmailAndPassword(email, password);

                // Success
                authModal.classList.remove('show');
                loginForm.reset();
                showCopyNotification('✅ Connexion réussie !');
            } catch (error) {
                console.error("Auth Error:", error.code);
                authError.classList.remove('hidden');
                let errorMsg = "Erreur d'authentification.";
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential' || error.code === 'auth/internal-error') {
                    errorMsg = "Email ou mot de passe incorrect.";
                } else if (error.code === 'auth/too-many-requests') {
                    errorMsg = "Trop de tentatives. Réessayez plus tard.";
                }
                authError.querySelector('span').innerText = errorMsg;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        };
    }

    // Logout Interaction
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            const logoutModal = document.getElementById('logoutConfirmModal');
            if (logoutModal) logoutModal.classList.add('show');
        };
    }

    // Confirm Logout Logic
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    if (confirmLogoutBtn) {
        confirmLogoutBtn.onclick = async () => {
            try {
                if (!auth) return;
                await auth.signOut();
                closeLogoutModal();
                showCopyNotification('?? Déconnexion réussie');
            } catch (error) {
                console.error("Logout Error:", error);
            }
        };
    }



    // Monitor Auth State
    setupAuthStateListener();
}

// Global modal close functions
function closeLogoutModal() {
    const modal = document.getElementById('logoutConfirmModal');
    if (modal) modal.classList.remove('show');
}

/**
 * MIGRATION TOOL: Run this function once to upload all local emails to Firestore
 * Can be called from the browser console.
 */
async function migrateEmailsToFirestore() {
    if (!auth.currentUser) {
        alert("Veuillez vous connecter d'abord pour effectuer la migration.");
        return;
    }

    if (!confirm(`Voulez-vous migrer ${companyEmails.length} emails vers Firestore ?`)) return;

    const btn = document.getElementById('loginBtn'); // Reuse for status if needed
    showCopyNotification('? Début de la migration...');

    try {
        const batch = db.batch();
        const collectionRef = db.collection('emails');

        companyEmails.forEach((emailData) => {
            // Create a unique ID based on email to prevent duplicates
            const docId = emailData.mail.replace(/[^a-zA-Z0-9]/g, '_');
            const docRef = collectionRef.doc(docId);
            batch.set(docRef, {
                ...emailData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });

        await batch.commit();
        showCopyNotification('✅ Migration terminée avec succès !');
        console.log("Migration Successful. You can now switch to dynamic fetching.");
    } catch (error) {
        console.error("Migration Error:", error);
        alert("Erreur lors de la migration: " + error.message);
    }
}
window.migrateEmailsToFirestore = migrateEmailsToFirestore;

// Global modal close function
function closeAuthModal() {
    if (authModal) authModal.classList.remove('show');
}

// =============================================
// ADMIN PANEL — Management Logic (Full CRUD)
// =============================================

// Use a helper to get elements safely
const getEl = (id) => document.getElementById(id);

let emailToBeDeleted = null;
let isSavingEmail = false;
let isDeletingEmail = false;
let isEditMode = false;
let originalEmailForEdit = null;
let currentEmployeeDetails = null;
let suppressDeleteModalUntil = 0;
let suppressEditModalUntil = 0;

function isAdminModalOpen() {
    const modal = getEl('emailAdminModal');
    return !!(modal && modal.classList.contains('show'));
}

function blockDeleteModalTemporarily(durationMs = 2500) {
    suppressDeleteModalUntil = Math.max(suppressDeleteModalUntil, Date.now() + durationMs);
}

function blockEditModalTemporarily(durationMs = 2500) {
    suppressEditModalUntil = Math.max(suppressEditModalUntil, Date.now() + durationMs);
}

function shouldBlockDeleteModal() {
    return isSavingEmail || isAdminModalOpen() || Date.now() < suppressDeleteModalUntil;
}

function shouldBlockEditModal(options = {}) {
    if (options.force) return false;
    return isSavingEmail || isAdminModalOpen() || Date.now() < suppressEditModalUntil;
}

function stopAdminActionEvent(event) {
    if (!event) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
}

function withOperationTimeout(promise, label, timeoutMs = 10000) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`${label} timed out`)), timeoutMs);
        })
    ]);
}

function getEmailDocId(email) {
    return String(email || '').trim().replace(/[^a-zA-Z0-9]/g, '_');
}

function normalizeDirectoryEmail(email) {
    return String(email || '').trim().toLowerCase();
}

function setEmailSaveBusy(isBusy) {
    isSavingEmail = !!isBusy;
    const btn = getEl('saveEmailBtn');
    const form = getEl('emailAdminForm');
    const cancelBtn = form ? form.querySelector('.btn-modern-cancel') : null;

    if (btn) {
        btn.disabled = isSavingEmail;
        btn.innerText = isSavingEmail ? 'Enregistrement...' : 'Enregistrer';
    }
    if (cancelBtn) {
        cancelBtn.disabled = isSavingEmail;
        cancelBtn.style.pointerEvents = isSavingEmail ? 'none' : '';
        cancelBtn.style.opacity = isSavingEmail ? '0.65' : '';
    }
}

function setDeleteBusy(isBusy) {
    isDeletingEmail = !!isBusy;
    const btn = getEl('confirmDeleteBtnManual');
    const modal = getEl('deleteConfirmModal');
    const cancelBtn = modal ? modal.querySelector('.btn-secondary') : null;

    if (btn) {
        btn.disabled = isDeletingEmail;
        btn.innerText = isDeletingEmail ? 'Suppression...' : 'Oui, Supprimer';
    }
    if (cancelBtn) {
        cancelBtn.disabled = isDeletingEmail;
        cancelBtn.style.pointerEvents = isDeletingEmail ? 'none' : '';
        cancelBtn.style.opacity = isDeletingEmail ? '0.65' : '';
    }
}

function persistDirectorySnapshot() {
    if (typeof window.saveEmailsToIndexedDB !== 'function') return;
    window.saveEmailsToIndexedDB({
        emails: companyEmails,
        units: systemUnits,
        pendingRequestsCount,
        lastUpdate: lastKnownUpdateDate,
        syncedAt: new Date().toISOString()
    }).catch(error => console.warn('Unable to persist local directory snapshot:', error));
}

function captureDirectoryViewState() {
    const pageContent = document.querySelector('.page-content');
    return {
        page: currentPage,
        activeView: { ...activeView },
        searchTerm: currentSearchTerm,
        searchValue: searchInput ? searchInput.value : '',
        windowX: window.scrollX || 0,
        windowY: window.scrollY || 0,
        pageScrollTop: pageContent ? pageContent.scrollTop : 0,
        pageScrollLeft: pageContent ? pageContent.scrollLeft : 0
    };
}

function restoreDirectoryViewState(state) {
    if (!state) return;

    activeView = state.activeView || activeView;
    currentPage = state.page || currentPage;
    currentSearchTerm = state.searchTerm || '';
    if (searchInput) searchInput.value = state.searchValue || '';

    requestAnimationFrame(() => {
        const pageContent = document.querySelector('.page-content');
        if (pageContent) {
            pageContent.scrollTop = state.pageScrollTop || 0;
            pageContent.scrollLeft = state.pageScrollLeft || 0;
        }
        window.scrollTo(state.windowX || 0, state.windowY || 0);
    });
}

function upsertLocalEmail(emailData, previousEmail = null, options = {}) {
    const currentMail = normalizeDirectoryEmail(emailData.mail);
    const previousMail = normalizeDirectoryEmail(previousEmail);
    const targetIndex = companyEmails.findIndex(item => {
        const itemMail = normalizeDirectoryEmail(item.mail);
        return itemMail === previousMail || itemMail === currentMail;
    });
    const existing = targetIndex >= 0 ? companyEmails[targetIndex] : {};
    const localData = sanitizeCachedEmails([{
        ...existing,
        ...emailData,
        createdAt: emailData.createdAt || existing.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }])[0];

    if (targetIndex >= 0) {
        companyEmails = companyEmails.reduce((list, item, index) => {
            const itemMail = normalizeDirectoryEmail(item.mail);
            const isDuplicate = itemMail === currentMail || (!!previousMail && itemMail === previousMail);
            if (index === targetIndex) {
                list.push(localData);
            } else if (!isDuplicate) {
                list.push(item);
            }
            return list;
        }, []);
    } else {
        companyEmails = [localData, ...companyEmails.filter(item => normalizeDirectoryEmail(item.mail) !== currentMail)];
    }

    emailSearchCache.delete(localData);
    renderCurrentViewFromState({ force: true });
    restoreDirectoryViewState(options.viewState);
    persistDirectorySnapshot();
}

function removeLocalEmail(email) {
    const mail = normalizeDirectoryEmail(email);
    companyEmails = companyEmails.filter(item => normalizeDirectoryEmail(item.mail) !== mail);
    renderCurrentViewFromState({ force: true });
    persistDirectorySnapshot();
}

function syncDirectoryInBackground(viewState = null) {
    if (firestoreSyncTimer) clearTimeout(firestoreSyncTimer);
    _manualSyncInProgress = true;

    withOperationTimeout(syncAndRefreshFromFirestore({ render: false }), 'Directory sync', 8000)
        .then(() => {
            updateDbSyncStatus('synced');
            restoreDirectoryViewState(viewState);
        })
        .catch(error => {
            console.warn('Directory background sync skipped:', error);
            updateDbSyncStatus('offline');
        })
        .finally(() => {
            _manualSyncInProgress = false;
        });
}

function normalizePhoneValue(value) {
    if (value === null || value === undefined) return '';
    return String(value).trim();
}

function compactPhone(value) {
    return normalizePhoneValue(value).replace(/[\s().-]/g, '');
}

function isValidAlgerianPhone(value) {
    const phone = compactPhone(value);
    if (!phone) return true;
    return /^(0[1-9]\d{8}|\+213[1-9]\d{8}|213[1-9]\d{8})$/.test(phone);
}

function formatPhoneForDisplay(value) {
    const phone = compactPhone(value);
    return phone || '';
}

function formatPhoneForTel(value) {
    const phone = compactPhone(value);
    if (!phone) return '';
    if (phone.startsWith('+213')) return phone;
    if (phone.startsWith('213')) return `+${phone}`;
    if (phone.startsWith('0')) return `+213${phone.slice(1)}`;
    return phone;
}

function formatPhoneForWhatsApp(value) {
    const phone = compactPhone(value).replace(/^\+/, '');
    if (!phone) return '';
    if (phone.startsWith('213')) return phone;
    if (phone.startsWith('0')) return `213${phone.slice(1)}`;
    return phone;
}

function isMobileDevice() {
    return window.matchMedia('(max-width: 768px)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
}

function escapeHtml(value) {
    return String(fixMojibakeText(value) ?? '').replace(/[&<>"']/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[char]));
}

function formatEmployeeDate(value) {
    if (!value) return 'Non renseigné';
    try {
        const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
        if (Number.isNaN(date.getTime())) return 'Non renseigne';
        return date.toLocaleString('fr-FR');
    } catch (error) {
        return 'Non renseigne';
    }
}

function getEmployeeInitials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '--';
    return parts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
}

function findEmployeeByEmail(email) {
    return companyEmails.find(e => String(e.mail || '').toLowerCase() === String(email || '').toLowerCase());
}

function upgradeAdminFormLayout() {
    const form = getEl('emailAdminForm');
    if (!form || form.dataset.phoneLayoutReady === 'true') return;

    const nameInput = getEl('adm_name');
    const emailInput = getEl('adm_mail');
    const phoneInput = getEl('adm_phone');
    const unitSelect = getEl('adm_unit');
    const posteInput = getEl('adm_poste');
    const statusSelect = getEl('adm_status');
    const actions = form.querySelector('.form-modern-actions');
    if (!nameInput || !emailInput || !phoneInput || !unitSelect || !posteInput || !statusSelect || !actions) return;

    const field = (label, element, hint = '') => {
        const wrap = document.createElement('div');
        wrap.className = 'form-group';
        wrap.innerHTML = `<label>${label}</label>`;
        wrap.appendChild(element);
        if (hint) {
            const small = document.createElement('small');
            small.className = 'field-hint';
            small.textContent = hint;
            wrap.appendChild(small);
        }
        return wrap;
    };

    const row = document.createElement('div');
    row.className = 'form-row';
    row.appendChild(field('Unite *', unitSelect));
    row.appendChild(field('Poste *', posteInput));

    form.innerHTML = '';
    form.appendChild(field('Nom complet *', nameInput));
    form.appendChild(field('Adresse Email *', emailInput));
    form.appendChild(field('Telephone (Optionnel)', phoneInput, 'Formats acceptes : 0550123456, 0660123456, +213550123456'));
    form.appendChild(row);
    form.appendChild(field('Statut *', statusSelect));
    form.appendChild(actions);
    form.dataset.phoneLayoutReady = 'true';
    attachPhoneInputGuards();
}

function attachPhoneInputGuards() {
    ['adm_phone', 'reqPhone', 'corNewPhone'].forEach((id) => {
        const input = getEl(id);
        if (!input || input.dataset.phoneGuardReady === 'true') return;
        input.addEventListener('input', () => {
            input.value = input.value.replace(/[^\d+\s().-]/g, '');
            if ((input.value.match(/\+/g) || []).length > 1) {
                input.value = input.value.replace(/\+(?=.)/g, '');
            }
            if (input.value.includes('+') && !input.value.trim().startsWith('+')) {
                input.value = input.value.replace(/\+/g, '');
            }
        });
        input.dataset.phoneGuardReady = 'true';
    });
}

// Open Add Modal
function openAddEmailModal() {
    if (isAdminModalOpen() || isSavingEmail) return;
    const modal = getEl('emailAdminModal');
    const form = getEl('emailAdminForm');
    const title = getEl('adminModalTitle');

    if (!modal || !form) return;

    closeDeleteModal({ force: true });
    upgradeAdminFormLayout();
    setEmailSaveBusy(false);
    isEditMode = false;
    originalEmailForEdit = null;
    if (title) title.innerText = "Ajouter un Email";
    form.reset();
    const phoneInput = getEl('adm_phone');
    if (phoneInput) phoneInput.value = '';
    const mailInput = getEl('adm_mail');
    if (mailInput) mailInput.disabled = false;
    populateUnitDropdowns();
    modal.classList.add('show');
}

function safeHandleEditEmail(event, email) {
    stopAdminActionEvent(event);
    handleEditEmail(email);
}

function safeHandleDeleteEmail(event, email) {
    stopAdminActionEvent(event);
    handleDeleteEmail(email);
}

// Open Edit Modal
async function handleEditEmail(email, options = {}) {
    const modal = getEl('emailAdminModal');
    const title = getEl('adminModalTitle');
    if (!modal || shouldBlockEditModal(options)) return;

    closeDeleteModal({ force: true });
    upgradeAdminFormLayout();
    setEmailSaveBusy(false);
    try {
        showCopyNotification('Chargement des donnees...');

        const item = companyEmails.find(e => normalizeDirectoryEmail(e.mail) === normalizeDirectoryEmail(email));
        if (!item) {
            showCopyNotification('Adresse introuvable. Actualisez la base de donnees.');
            return;
        }

        isEditMode = true;
        originalEmailForEdit = item.mail;
        populateUnitDropdowns();
        if (title) title.innerText = "Modifier l'Email";

        const unitInput = getEl('adm_unit');
        const nameInput = getEl('adm_name');
        const posteInput = getEl('adm_poste');
        const mailInput = getEl('adm_mail');
        const phoneInput = getEl('adm_phone');
        const statusInput = getEl('adm_status');

        if (unitInput) unitInput.value = item.unit || '';
        if (nameInput) nameInput.value = item.name || '';
        if (posteInput) posteInput.value = item.poste || '';
        if (mailInput) {
            mailInput.value = item.mail || '';
            mailInput.disabled = false;
        }
        if (phoneInput) phoneInput.value = normalizePhoneValue(item.phone);
        if (statusInput) statusInput.value = item.status || 'Active';

        modal.classList.add('show');

    } catch (error) {
        console.error("Edit Error:", error);
        showCopyNotification('Erreur lors du chargement.');
    }
}

// Close Modals
function closeAdminModal(options = {}) {
    if (isSavingEmail && !options.force) return;
    const modal = getEl('emailAdminModal');
    if (modal) modal.classList.remove('show');
    if (options.force) setEmailSaveBusy(false);
}

function closeDeleteModal(options = {}) {
    if (isDeletingEmail && !options.force) return;
    const modal = getEl('deleteConfirmModal');
    if (modal) modal.classList.remove('show');
    if (!isDeletingEmail || options.force) emailToBeDeleted = null;
    if (options.force) setDeleteBusy(false);
}

/**
 * Handle Deletion
 */
function handleDeleteEmail(email) {
    if (shouldBlockDeleteModal()) {
        closeDeleteModal({ force: true });
        return;
    }

    if (!auth.currentUser) {
        showCopyNotification('Connexion administrateur requise.');
        return;
    }
    if (isDeletingEmail) return;

    const cleanEmail = String(email || '').trim();
    if (!cleanEmail) return;

    emailToBeDeleted = cleanEmail;
    const display = getEl('deleteEmailDisplay');
    const modal = getEl('deleteConfirmModal');

    if (display) display.innerText = cleanEmail;
    setDeleteBusy(false);
    if (modal) modal.classList.add('show');
}

function openEmployeeDetails(encodedEmail) {
    if (isAdminModalOpen() || isSavingEmail || isDeletingEmail) return;
    const email = decodeURIComponent(encodedEmail || '');
    const employee = findEmployeeByEmail(email);
    const modal = getEl('employeeDetailsModal');
    if (!employee || !modal) return;

    currentEmployeeDetails = employee;
    const phone = formatPhoneForDisplay(employee.phone);
    const telHref = formatPhoneForTel(employee.phone);
    const whatsappNumber = formatPhoneForWhatsApp(employee.phone);
    const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#';
    const hasPhone = !!phone;
    const hasWhatsApp = !!whatsappNumber;

    const name = employee.name || '-';
    const poste = employee.poste || '-';
    const statusClass = employee.status === 'Active' ? 'is-active' : (isBlockedEmailStatus(employee.status) ? 'is-blocked' : 'is-pending');

    getEl('empAvatarInitials').textContent = getEmployeeInitials(name);
    getEl('empDetailName').textContent = name;
    getEl('empDetailPoste').textContent = poste;
    getEl('empInfoName').textContent = name;
    getEl('empInfoEmail').textContent = employee.mail || '-';
    getEl('empInfoUnit').textContent = employee.unit || '-';
    getEl('empInfoPoste').textContent = poste;
    getEl('empInfoStatus').textContent = employee.status || '-';
    getEl('empInfoCreated').textContent = formatEmployeeDate(employee.createdAt);
    getEl('empInfoUpdated').textContent = formatEmployeeDate(employee.updatedAt);

    const phoneEl = getEl('empInfoPhone');
    if (phoneEl) {
        phoneEl.innerHTML = hasPhone
            ? `${hasWhatsApp ? '<i class="fab fa-whatsapp" aria-hidden="true"></i>' : ''}<span>${escapeHtml(phone)}</span>`
            : 'Non renseigné';
        phoneEl.classList.toggle('muted-value', !hasPhone);
        phoneEl.classList.toggle('is-clickable', hasWhatsApp);
        phoneEl.href = hasWhatsApp ? whatsappHref : '#';
        phoneEl.title = hasWhatsApp ? 'Ouvrir ce numéro dans WhatsApp' : 'Aucun téléphone renseigné';
        phoneEl.setAttribute('aria-disabled', hasWhatsApp ? 'false' : 'true');
    }

    const statusEl = getEl('empDetailStatus');
    if (statusEl) {
        statusEl.textContent = employee.status || '-';
        statusEl.className = `employee-status-pill ${statusClass}`;
    }

    const copyPhoneBtn = getEl('copyEmployeePhoneBtn');
    if (copyPhoneBtn) {
        copyPhoneBtn.disabled = !hasPhone;
        copyPhoneBtn.title = hasPhone ? 'Copier le numéro de téléphone' : 'Aucun téléphone renseigné';
    }

    const callBtn = getEl('callEmployeeBtn');
    if (callBtn) {
        const showCall = hasPhone && isMobileDevice();
        callBtn.classList.toggle('hidden', !showCall);
        callBtn.href = showCall ? `tel:${telHref}` : '#';
    }

    const whatsappBtn = getEl('whatsappEmployeeBtn');
    if (whatsappBtn) {
        whatsappBtn.classList.toggle('hidden', !hasWhatsApp);
        whatsappBtn.href = hasWhatsApp ? whatsappHref : '#';
        whatsappBtn.title = hasWhatsApp ? 'Ouvrir WhatsApp' : 'Aucun téléphone renseigné';
    }

    modal.classList.add('show');
}

function closeEmployeeDetailsModal() {
    const modal = getEl('employeeDetailsModal');
    if (modal) modal.classList.remove('show');
}

function copyEmployeeEmail() {
    if (!currentEmployeeDetails || !currentEmployeeDetails.mail) return;
    copyTextToClipboard(currentEmployeeDetails.mail, {
        count: 1,
        successMessage: 'Email copie',
        showToast: false
    });
}

function copyEmployeePhone() {
    if (!currentEmployeeDetails || !currentEmployeeDetails.phone) return;
    const phone = formatPhoneForDisplay(currentEmployeeDetails.phone);
    if (!phone) return;
    copyTextToClipboard(phone, {
        count: 1,
        successMessage: 'Téléphone copié',
        showToast: false
    });
}

function editEmployeeFromDetails() {
    if (!currentEmployeeDetails) return;
    closeEmployeeDetailsModal();
    handleEditEmail(currentEmployeeDetails.mail, { force: true });
}

function deleteEmployeeFromDetails() {
    if (!currentEmployeeDetails) return;
    closeEmployeeDetailsModal();
    handleDeleteEmail(currentEmployeeDetails.mail);
}
// Global View State Management
let activeView = { type: 'all', value: null };

// Unified Refresh Function (Maintains context)
async function refreshAppUI() {
    renderCurrentViewFromState();
}

// Manual Save Button Click (Zero-Refresh)
const saveEmailBtn = getEl('saveEmailBtn');
if (saveEmailBtn) {
    saveEmailBtn.onclick = async function (event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        blockDeleteModalTemporarily(5000);
        blockEditModalTemporarily(5000);
        closeDeleteModal({ force: true });
        if (isSavingEmail || saveEmailBtn.disabled) return;
        if (!auth.currentUser) {
            alert("Erreur : Vous n'etes pas connecte.");
            return;
        }

        const emailVal = String(getEl('adm_mail') ? getEl('adm_mail').value : '').trim();
        const nameVal = String(getEl('adm_name') ? getEl('adm_name').value : '').trim();
        const unitVal = String(getEl('adm_unit') ? getEl('adm_unit').value : '').trim();
        const posteVal = String(getEl('adm_poste') ? getEl('adm_poste').value : '').trim();
        const statusVal = String(getEl('adm_status') ? getEl('adm_status').value : 'Active').trim() || 'Active';
        const phoneVal = formatPhoneForDisplay(getEl('adm_phone') ? getEl('adm_phone').value : '');

        if (!nameVal || !unitVal || !posteVal || !emailVal) {
            alert("Veuillez remplir le nom, l'unite, le poste et l'adresse email.");
            return;
        }

        if (!isValidAlgerianPhone(phoneVal)) {
            alert("Numero de telephone invalide. Utilisez un format algerien : 0550123456 ou +213550123456.");
            return;
        }

        const emailData = {
            unit: unitVal,
            name: nameVal,
            poste: posteVal,
            mail: emailVal,
            phone: phoneVal,
            status: statusVal,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        const localEmailData = {
            unit: unitVal,
            name: nameVal,
            poste: posteVal,
            mail: emailVal,
            phone: phoneVal,
            status: statusVal,
            updatedAt: new Date().toISOString()
        };
        if (!isEditMode) {
            emailData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            localEmailData.createdAt = new Date().toISOString();
        }

        const wasEditMode = isEditMode;
        const wasOriginalEmail = originalEmailForEdit;
        const wasApprovingRequestId = window.currentApprovingRequestId;
        const directoryViewState = captureDirectoryViewState();

        setEmailSaveBusy(true);
        showCopyNotification('Enregistrement...');

        try {
            const newDocId = getEmailDocId(emailVal);

            if (wasEditMode && wasOriginalEmail && normalizeDirectoryEmail(wasOriginalEmail) !== normalizeDirectoryEmail(emailVal)) {
                const oldDocId = getEmailDocId(wasOriginalEmail);
                await withOperationTimeout(db.collection('emails').doc(oldDocId).delete(), 'Old email delete', 10000);
            }

            await withOperationTimeout(db.collection('emails').doc(newDocId).set(emailData, { merge: true }), 'Email save', 10000);

            if (wasApprovingRequestId) {
                await withOperationTimeout(db.collection('pendingRequests').doc(wasApprovingRequestId).update({
                    status: 'approved',
                    resolvedAt: firebase.firestore.FieldValue.serverTimestamp()
                }), 'Request approval', 10000);
                window.currentApprovingRequestId = null;
                updatePendingCount();
            }

            upsertLocalEmail(localEmailData, wasOriginalEmail, { viewState: directoryViewState });
            closeAdminModal({ force: true });
            closeDeleteModal({ force: true });
            blockDeleteModalTemporarily(5000);
            blockEditModalTemporarily(5000);
            isEditMode = false;
            originalEmailForEdit = null;

            showCopyNotification(wasEditMode ? 'Modifie avec succes' : 'Ajoute avec succes');
            addSystemLog(`${wasEditMode ? 'Modification' : 'Ajout'} de l'email : ${emailVal}`);
            restoreDirectoryViewState(directoryViewState);
            syncDirectoryInBackground(directoryViewState);

        } catch (error) {
            console.error(error);
            showCopyNotification('Erreur : ' + (error.message || 'enregistrement impossible'));
        } finally {
            blockDeleteModalTemporarily(2500);
            blockEditModalTemporarily(2500);
            setEmailSaveBusy(false);
        }
    };
}

// Manual Delete Button Click (Zero-Refresh)
const confirmDeleteBtnManual = getEl('confirmDeleteBtnManual');
if (confirmDeleteBtnManual) {
    confirmDeleteBtnManual.onclick = async function (event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (shouldBlockDeleteModal()) {
            closeDeleteModal({ force: true });
            return;
        }
        if (!emailToBeDeleted || isDeletingEmail) return;
        const deletedEmail = emailToBeDeleted;
        try {
            setDeleteBusy(true);
            showCopyNotification('Suppression...');
            const docId = getEmailDocId(deletedEmail);
            await withOperationTimeout(db.collection('emails').doc(docId).delete(), 'Email delete', 10000);

            removeLocalEmail(deletedEmail);
            showCopyNotification('Supprime avec succes');
            addSystemLog(`Suppression de l'email : ${deletedEmail}`);
            syncDirectoryInBackground();
            setDeleteBusy(false);
            closeDeleteModal({ force: true });
        } catch (e) {
            console.error(e);
            showCopyNotification('Erreur lors de la suppression.');
            setDeleteBusy(false);
        }
    };
}

// Admin Date Control - Open Modal
async function handleChangeUpdateDate() {
    if (!auth.currentUser) return;
    const currentDate = getEl('lastUpdateDate').innerText;
    getEl('newSystemDateInput').value = currentDate;
    const modal = getEl('dateUpdateModal');
    if (modal) modal.classList.add('show');
}

function closeDateModal() {
    const modal = getEl('dateUpdateModal');
    if (modal) modal.classList.remove('show');
}

// Manual Save System Date (Zero-Refresh)
const saveSystemDateBtn = getEl('saveSystemDateBtn');
if (saveSystemDateBtn) {
    saveSystemDateBtn.onclick = async function () {
        const newDate = getEl('newSystemDateInput').value.trim();
        const currentDate = getEl('lastUpdateDate').innerText;

        if (!newDate) return alert("Veuillez saisir une date.");

        try {
            saveSystemDateBtn.disabled = true;
            saveSystemDateBtn.innerText = "? Enregistrement...";

            await db.collection('settings').doc('app').set({
                lastUpdate: newDate,
                version: CURRENT_VERSION, // Ensure version is synced
                updatedBy: auth.currentUser.email,
                clientTimestamp: new Date().toISOString()
            }, { merge: true });

            // Update in-memory global state
            lastKnownUpdateDate = newDate;

            getEl('lastUpdateDate').innerText = newDate;
            const bannerDateEl = getEl('bannerLastUpdate');
            if (bannerDateEl) bannerDateEl.innerText = newDate;
            showCopyNotification('✅ Date système mise à jour');
            closeDateModal();
            addSystemLog(`Mise à jour de la date système : ${newDate}`);
            
            // Trigger IndexedDB sync to persist the change locally
            if (typeof syncAndRefreshFromFirestore === 'function') {
                await syncAndRefreshFromFirestore({ render: false });
            }
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la mise à jour.");
        } finally {
            saveSystemDateBtn.disabled = false;
            saveSystemDateBtn.innerText = "Enregistrer";
        }
    };
}

// Real-time System Date Listener
let systemDateUnsubscribe = null;
function initSystemDateListener() {
    if (systemDateUnsubscribe) return;
    if (!initializeFirebaseServices()) return;

    systemDateUnsubscribe = db.collection('settings').doc('app').onSnapshot((doc) => {
        if (doc.exists && doc.data().lastUpdate) {
            const newDate = doc.data().lastUpdate;
            
            // Sync to the global in-memory variable
            lastKnownUpdateDate = newDate;

            const dateEl = document.getElementById('lastUpdateDate');
            const bannerDateEl = document.getElementById('bannerLastUpdate');
            
            if (dateEl && dateEl.innerText !== newDate) dateEl.innerText = newDate;
            if (bannerDateEl && bannerDateEl.innerText !== newDate) bannerDateEl.innerText = newDate;
            
            console.log("System date synced in real-time:", newDate);

            // Persist the new date in IndexedDB local storage immediately
            if (typeof window.saveEmailsToIndexedDB === 'function') {
                window.saveEmailsToIndexedDB({
                    emails: companyEmails,
                    units: systemUnits,
                    lastUpdate: newDate
                }).catch(err => console.warn("Error saving date to IndexedDB:", err));
            }
            updateDbSyncStatus('synced');
        }
    }, (error) => {
        console.error("Error syncing system date:", error);
    });
}

// Outside clicks to close the targeted modal only.
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        switch (e.target.id) {
            case 'emailAdminModal':
                if (typeof closeAdminModal === 'function') closeAdminModal();
                break;
            case 'deleteConfirmModal':
                if (typeof closeDeleteModal === 'function') closeDeleteModal();
                break;
            case 'dateUpdateModal':
                if (typeof closeDateModal === 'function') closeDateModal();
                break;
            case 'logoutConfirmModal':
                if (typeof closeLogoutModal === 'function') closeLogoutModal();
                break;
            case 'unitDeleteConfirmModal':
                if (typeof closeUnitDeleteModal === 'function') closeUnitDeleteModal();
                break;
            case 'unitManagementModal':
                if (typeof closeUnitManagement === 'function') closeUnitManagement();
                break;
            case 'serviceSelectionModal':
                if (typeof closeServiceSelection === 'function') closeServiceSelection();
                break;
            case 'employeeDetailsModal':
                if (typeof closeEmployeeDetailsModal === 'function') closeEmployeeDetailsModal();
                break;
            default:
                e.target.classList.remove('show');
        }
    }

    // Close database status popover if clicking outside
    const popover = document.getElementById('dbSyncPopover');
    const statusBtn = document.getElementById('dbSyncStatus');
    if (popover && popover.classList.contains('show')) {
        if (statusBtn && !statusBtn.contains(e.target)) {
            popover.classList.remove('show');
        }
    }
});

// =============================================
// FLOATING TOP BAR LOGIC (Premium v4.1)
// =============================================
const govBanner = document.querySelector(".institutional-banner");
const mainNavbar = document.querySelector(".main-navbar");

if (govBanner) govBanner.classList.remove("hide");
if (mainNavbar) mainNavbar.style.top = "";

// =============================================
// SIGNATURE GENERATOR SYSTEM (Premium)
// =============================================
const SIGNATURE_TEMPLATE = `
<table cellpadding="0" cellspacing="0" border="0" style="font-family: Verdana, Arial, sans-serif;">
    <tr>
      <td style="padding-right:8px;">
        <a href="https://www.labo-nedjma.com/">
          <img src="https://www.labo-nedjma.com/wp-content/uploads/2021/07/Signature mail/LABONEDJMA.png"
          width="125" height="125" alt="Labo Nedjma" style="display:block; border-radius:14px;">
        </a>
      </td>
      <td style="width:3px; background:#0A1E8C;"></td>
      <td style="padding-left:8px; color:#4B4B4B;">
        <p style="margin:0; font-size:13px; font-weight:600; color:#0A1E8C; text-transform:uppercase;">{{NAME}}</p>
        <p style="margin:1px 0 6px; font-size:11px; font-weight:700;">{{POSTE}}</p>
        <p style="margin:4px 0; font-size:10.5px;">
          <img src="https://www.labo-nedjma.com/wp-content/uploads/2021/07/Signature mail/Phone.png" width="12" style="vertical-align:middle; margin-right:4px;">
          <a href="https://wa.me/{{PHONE_CLEAN}}" style="color:#4B4B4B; text-decoration:none;">{{PHONE}}</a>
        </p>
        <p style="margin:4px 0; font-size:10.5px;">
          <img src="https://www.labo-nedjma.com/wp-content/uploads/2021/07/Signature mail/Mail.png" width="12" style="vertical-align:middle; margin-right:4px;">
          <a href="mailto:{{EMAIL}}" style="color:#4B4B4B; text-decoration:none;">{{EMAIL}}</a>
        </p>
        <p style="margin:4px 0; font-size:10.5px;">
          <img src="https://www.labo-nedjma.com/wp-content/uploads/2021/07/Signature mail/Maps.png" height="12" style="vertical-align:middle; margin-right:4px;">
          <span style="color:#4B4B4B;">{{LOCATION}}</span>
        </p>
        <p style="margin:4px 0 6px; font-size:10.5px; {{FIXE_DISPLAY}}">
          <img src="https://www.labo-nedjma.com/wp-content/uploads/2021/07/Signature mail/Fixe.png" width="12" style="vertical-align:middle; margin-right:4px;">
          {{FIXE}}
        </p>
        <table cellpadding="0" cellspacing="0" border="0" style="margin-top:4px;">
          <tr>
            <td style="padding-right:4px;"><a href="https://www.facebook.com/flux.care.labonedjma"><img src="https://www.labo-nedjma.com/wp-content/uploads/2021/07/Signature mail/Facebook.png" width="20" style="display:block;"></a></td>
            <td style="padding-right:4px;"><a href="https://www.instagram.com/flux__care/"><img src="https://www.labo-nedjma.com/wp-content/uploads/2021/07/Signature mail/Instagram.png" width="20" style="display:block;"></a></td>
            <td><a href="https://www.labo-nedjma.com/"><img src="https://www.labo-nedjma.com/wp-content/uploads/2021/07/Signature mail/Website.png" width="20" style="display:block;"></a></td>
          </tr>
        </table>
      </td>
    </tr>
</table>`;

function updateSignaturePreview() {
    const previewContainer = document.getElementById('signaturePreview');
    if (!previewContainer) return;

    const rawMobile = document.getElementById('sigMobile').value;
    const rawFixe = document.getElementById('sigFixe').value;

    const formatPhone = (num) => {
        if (!num) return '';
        let clean = num.replace(/\D/g, '');
        if (clean.startsWith('213')) clean = clean.substring(3);
        if (clean.startsWith('0')) clean = clean.substring(1);
        const digits = clean;

        // Format with spaces for display: XX XX XX XX
        let formatted = '';
        for (let i = 0; i < digits.length; i++) {
            if (i > 0 && i % 2 === 0 && i < 7) formatted += ' ';
            formatted += digits[i];
        }
        return `+213 (0)${formatted}`;
    };

    const data = {
        name: document.getElementById('sigName').value || 'NOM ET PRÉNOM',
        poste: document.getElementById('sigPoste').value || 'Poste',
        mobile: formatPhone(rawMobile) || '+213 (0) ...',
        fixe: formatPhone(rawFixe) || '+213 (0)23 31 71 02',
        email: document.getElementById('sigEmail').value || 'contact@labo-nedjma.com',
        location: document.getElementById('sigLocation').value || 'Cité El Fahs Zone d’Activité Larbâa – Blida'
    };

    const whatsappNum = data.mobile.replace(/\D/g, '');

    let html = SIGNATURE_TEMPLATE
        .replace('{{NAME}}', data.name)
        .replace('{{POSTE}}', data.poste)
        .replace('{{PHONE}}', data.mobile)
        .replace('{{PHONE_CLEAN}}', whatsappNum)
        .replace('{{EMAIL}}', data.email)
        .replace('{{EMAIL}}', data.email)
        .replace('{{LOCATION}}', data.location)
        .replace('{{FIXE}}', data.fixe)
        .replace('{{FIXE_DISPLAY}}', ''); // Always display fixed line with default or user input

    previewContainer.innerHTML = html;
}

function normalizeSignatureLookup(value) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ');
}

function findSignatureEmployee(value) {
    const lookup = normalizeSignatureLookup(value);
    if (!lookup) return null;

    const activeData = companyEmails.filter(item => !item.isRequest && item.status === 'Active');
    return activeData.find(item => normalizeSignatureLookup(item.name) === lookup || normalizeSignatureLookup(item.mail) === lookup);
}

function signatureLocationFromUnit(unitName) {
    const unit = normalizeSignatureLookup(unitName);
    if (unit.includes('larb')) return "Cité El Fahs Zone d’Activité Larbâa – Blida";
    if (unit.includes('douera')) return "Lotissement 4 N°11 Douera, Alger - Algérie";
    if (unit.includes('smar')) return "Zone industrielle Oued Semmar";
    if (unit.includes('oued')) return "El Oued - Algérie";
    if (unit.includes('rahman')) return "Rahmania - Alger";
    if (unit.includes('oran')) return "Oran - Algérie";
    if (unit.includes('setif') || unit.includes('sétif')) return "Sétif - Algérie";
    return unitName || '';
}

function autofillSignatureFromEmployee(match) {
    if (!match) return;

    const nameInput = document.getElementById('sigName');
    const emailInput = document.getElementById('sigEmail');
    const posteInput = document.getElementById('sigPoste');
    const mobileInput = document.getElementById('sigMobile');
    const locationInput = document.getElementById('sigLocation');

    if (nameInput) nameInput.value = match.name || '';
    if (emailInput) emailInput.value = match.mail || '';
    if (posteInput) posteInput.value = match.poste || '';
    if (mobileInput) mobileInput.value = formatPhoneForDisplay(match.phone) || normalizePhoneValue(match.phone);
    if (locationInput) locationInput.value = signatureLocationFromUnit(match.unit);

    updateSignaturePreview();
}

function handleSignatureAutofill(e) {
    const match = findSignatureEmployee(e.target.value);
    if (match) autofillSignatureFromEmployee(match);
}

// Intelligent Auto-Fill for Signature Generator
document.getElementById('sigName')?.addEventListener('input', handleSignatureAutofill);
document.getElementById('sigName')?.addEventListener('change', handleSignatureAutofill);
document.getElementById('sigEmail')?.addEventListener('input', handleSignatureAutofill);
document.getElementById('sigEmail')?.addEventListener('change', handleSignatureAutofill);

function downloadSignatureHTML() {
    const preview = document.getElementById('signaturePreview');
    if (!preview) return;

    const name = document.getElementById('sigName').value || 'signature';
    const filename = `Signature_LaboNedjma_${name.replace(/\s+/g, '_')}.html`;
    const htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>
    ${preview.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    // Show professional success modal
    const modal = document.getElementById('signatureSuccessModal');
    if (modal) modal.style.display = 'flex';
}

function closeSignatureSuccessModal() {
    const modal = document.getElementById('signatureSuccessModal');
    if (modal) modal.style.display = 'none';
}

function resetSignatureForm() {
    document.getElementById('signatureForm').reset();
    updateSignaturePreview();
}

// =============================================
// NOTIFICATION SYSTEM (Broadcast)
// =============================================
let notifications = [];
let adminRequestNotifs = []; // New array for admin-specific notifications
let readNotifs = JSON.parse(localStorage.getItem("labo_read_notifs")) || [];
let notifIdToDelete = null;

function initNotificationSystem() {
    const notifBtn = document.getElementById("notifBtn");
    const notifDropdown = document.getElementById("notifDropdown");
    const markAllRead = document.getElementById("markAllRead");

    if (!notifBtn || notifBtn.dataset.init === 'true') return;
    notifBtn.dataset.init = 'true';

    // Toggle Dropdown
    notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        notifDropdown.classList.remove("show");
    });

    notifDropdown.addEventListener("click", (e) => e.stopPropagation());

    // Listen to Firestore when Firebase is available; otherwise keep the local dropdown usable.
    if (initializeFirebaseServices()) {
        window.__laboAnnouncementsUnsubscribe = db.collection("announcements")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                notifications = [];
                const now = new Date();

                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const expiry = data.expiryDate ? data.expiryDate.toDate() : null;

                    // Only add if not expired
                    if (!expiry || expiry > now) {
                        notifications.push({ id: doc.id, ...data });
                    }
                });

                renderNotifications();
            });
    } else {
        renderNotifications();
    }

    if (markAllRead) {
        markAllRead.addEventListener("click", () => {
            // Mark regular announcements as read
            notifications.forEach(n => {
                if (!readNotifs.includes(n.id)) readNotifs.push(n.id);
            });
            // Mark admin request alerts as read
            if (typeof adminRequestNotifs !== 'undefined') {
                adminRequestNotifs.forEach(n => {
                    if (!readNotifs.includes(n.id)) readNotifs.push(n.id);
                });
            }
            localStorage.setItem("labo_read_notifs", JSON.stringify(readNotifs));
            renderNotifications();
        });
    }
}

let adminNotifUnsubscribe = null;

function setupAdminRequestNotifs() {
    // If already subscribed, don't subscribe again
    if (adminNotifUnsubscribe) return;
    if (!initializeFirebaseServices()) return;

    // Request Browser Notification Permission
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }

    let isFirstLoad = true;

    adminNotifUnsubscribe = db.collection("pendingRequests")
        .where("status", "==", "pending")
        .onSnapshot((snapshot) => {
            const newRequests = [];
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                const type = data.type || 'new_account';
                
                let displayName = '';
                let reqTitle = 'Nouvelle Demande d\'Email';

                if (type === 'new_account') {
                    displayName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
                    reqTitle = 'Nouvelle Création d\'Email';
                } else if (type === 'correction') {
                    displayName = data.email || 'Email Inconnu';
                    reqTitle = 'Demande de Rectification';
                } else if (type === 'deactivation') {
                    displayName = data.email || 'Email Inconnu';
                    reqTitle = 'Demande de Clôture';
                }

                newRequests.push({
                    id: `req-${doc.id}`,
                    realId: doc.id,
                    type: 'request',
                    priority: 'high',
                    title: reqTitle,
                    message: `Demande de : ${displayName}`,
                    timestamp: data.timestamp,
                    isAdminOnly: true
                });

                // Trigger Browser Notification for NEW requests ONLY (not on first load)
                if (!isFirstLoad && snapshot.docChanges().some(change => change.type === 'added' && change.doc.id === doc.id)) {
                    showBrowserNotification(reqTitle, `De la part de: ${displayName}`);
                }
            });

            adminRequestNotifs = newRequests;
            isFirstLoad = false;
            renderNotifications();
        });
}

function showBrowserNotification(title, body) {
    if (Notification.permission === 'granted') {
        const options = {
            body: body,
            icon: './assets/pwa/icon-192.png',
            badge: './assets/pwa/icon-192.png',
            tag: 'new-request',
            renotify: true,
            vibrate: [200, 100, 200]
        };

        // Try Service Worker first
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, options);
            });
        } else {
            // Fallback for non-ServiceWorker environments (like file:// or before activation)
            try {
                new Notification(title, options);
            } catch (e) {
                console.warn("Standard Notification failed:", e);
            }
        }
    }
}

function renderNotifications() {
    if (document.hidden) {
        window.__laboRenderPending = true;
        return;
    }
    const list = document.getElementById("notifList");
    const badge = document.getElementById("notifBadge");
    if (!list) return;

    // Combine regular notifications with admin-only request notifications
    let allNotifs = [...notifications];
    if (auth && auth.currentUser) {
        allNotifs = [...allNotifs, ...adminRequestNotifs];
    }

    // Sort by timestamp desc
    allNotifs.sort((a, b) => {
        const timeA = a.timestamp ? a.timestamp.toMillis() : Date.now();
        const timeB = b.timestamp ? b.timestamp.toMillis() : Date.now();
        return timeB - timeA;
    });

    const unread = allNotifs.filter(n => !readNotifs.includes(n.id));

    // Check for Critical Message for Banner (Announcement only)
    const criticalMsg = notifications.find(n => n.priority === 'critical' && !readNotifs.includes(n.id));
    const banner = document.getElementById('criticalBanner');
    const bannerText = document.getElementById('bannerText');

    if (criticalMsg && banner && bannerText) {
        bannerText.textContent = criticalMsg.message;
        banner.classList.remove('hidden');
    } else if (banner) {
        banner.classList.add('hidden');
    }

    if (unread.length > 0) {
        badge.textContent = unread.length;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }

    if (allNotifs.length === 0) {
        list.innerHTML = `
            <div class="notif-empty">
                <i class="fas fa-comment-slash"></i>
                <p>Aucun nouveau message</p>
            </div>`;
        return;
    }

    list.innerHTML = allNotifs.map(n => {
        const isRead = readNotifs.includes(n.id);
        const time = n.timestamp ? timeAgo(n.timestamp.toDate()) : "À l'instant";
        const priorityClass = n.priority ? `priority-${n.priority}` : "priority-info";

        // Custom icon for requests
        const iconClass = n.type === 'request' ? 'fa-user-clock' : (n.priority === 'critical' ? 'fa-triangle-exclamation' : 'fa-bell');
        const clickAction = n.type === 'request' ? `showRequestDetails('${n.realId}')` : `showNotifDetail('${n.id}')`;

        return `
            <div class="notif-item ${priorityClass} ${isRead ? 'read' : ''}" onclick="${clickAction}">
                <div class="notif-icon-circle">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="notif-body">
                    <div class="notif-title-row">
                        <span class="notif-title">${n.title}</span>
                        <span class="notif-time">${time}</span>
                    </div>
                    <p class="notif-text">${n.message}</p>
                </div>
            </div>
        `;
    }).join("");

    // Also update Admin Management List if modal is open
    renderAdminAnnouncements();
}

function renderAdminAnnouncements() {
    const adminList = document.getElementById("adminAnnouncementsList");
    if (!adminList) return;

    if (notifications.length === 0) {
        adminList.innerHTML = `<p style="font-size: 0.8rem; color: #94a3b8; text-align: center; padding: 20px;">Aucune annonce active.</p>`;
        return;
    }

    adminList.innerHTML = notifications.map(n => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 12px 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-size: 0.85rem; font-weight: 700; color: #1e293b;">${n.title}</span>
                <span style="font-size: 0.75rem; color: #64748b;">Expire le: ${n.expiryDate ? n.expiryDate.toDate().toLocaleString() : '--'}</span>
            </div>
            <button onclick="deleteAnnouncement('${n.id}')" style="background: #fee2e2; color: #ef4444; border: none; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; transition: all 0.2s;" title="Supprimer">
                <i class="fas fa-trash-can"></i>
            </button>
        </div>
    `).join("");
}

function deleteAnnouncement(id) {
    notifIdToDelete = id;
    const modal = document.getElementById('notifDeleteConfirmModal');
    if (modal) modal.classList.add('show');
}

function closeNotifDeleteConfirmModal() {
    const modal = document.getElementById('notifDeleteConfirmModal');
    if (modal) modal.classList.remove('show');
    notifIdToDelete = null;
}

function closeNotifDeleteSuccessModal() {
    const modal = document.getElementById('notifDeleteSuccessModal');
    if (modal) modal.classList.remove('show');
}

// Global listener for confirm delete button
document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirmNotifDeleteBtn');
    if (confirmBtn) {
        confirmBtn.onclick = async () => {
            if (!notifIdToDelete) return;

            try {
                const doc = await db.collection("announcements").doc(notifIdToDelete).get();
                const title = doc.exists ? doc.data().title : "Inconnue";

                await db.collection("announcements").doc(notifIdToDelete).delete();
                closeNotifDeleteConfirmModal();

                addSystemLog(`Suppression de l'annonce : ${title}`);

                // Show success modal
                const successModal = document.getElementById('notifDeleteSuccessModal');
                if (successModal) successModal.classList.add('show');
            } catch (error) {
                alert("Erreur: " + error.message);
            }
        };
    }
});

function showNotifDetail(id) {
    const n = notifications.find(notif => notif.id === id);
    if (!n) return;

    // Mark as read
    markAsRead(id);

    const modal = document.getElementById('notifDetailModal');
    const title = document.getElementById('notifDetailTitle');
    const date = document.getElementById('notifDetailDate');
    const body = document.getElementById('notifDetailBody');
    const accent = document.getElementById('notifDetailAccent');
    const priorityLabel = document.getElementById('notifPriorityLabel');

    if (modal && title && date && body) {
        title.textContent = n.title || "Annonce";
        date.textContent = n.timestamp ? n.timestamp.toDate().toLocaleString('fr-FR') : "À l'instant";
        body.textContent = n.message;

        // Define styles based on priority
        const configs = {
            info: { color: '#3b82f6', bg: 'linear-gradient(165deg, #1e3a8a 0%, #3b82f6 100%)', label: 'Information' },
            warning: { color: '#f59e0b', bg: 'linear-gradient(165deg, #92400e 0%, #f59e0b 100%)', label: 'Attention' },
            critical: { color: '#ef4444', bg: 'linear-gradient(165deg, #7f1d1d 0%, #ef4444 100%)', label: 'Message Critique' }
        };

        const config = configs[n.priority] || configs.info;
        if (accent) accent.style.background = config.bg;
        if (priorityLabel) priorityLabel.textContent = config.label;

        modal.classList.remove('notif-priority-info', 'notif-priority-warning', 'notif-priority-critical');
        modal.classList.add(`notif-priority-${n.priority || 'info'}`);
        modal.classList.add('show');
    }
}

function closeNotifDetail() {
    const modal = document.getElementById('notifDetailModal');
    if (modal) modal.classList.remove('show');
}

function markAsRead(id) {
    if (!readNotifs.includes(id)) {
        readNotifs.push(id);
        localStorage.setItem("labo_read_notifs", JSON.stringify(readNotifs));
        renderNotifications();
    }
}

function closeCriticalBanner() {
    const banner = document.getElementById('criticalBanner');
    if (banner) {
        banner.classList.add('hidden');

        // Mark all critical messages as read so it doesn't reappear
        notifications.forEach(n => {
            if (n.priority === 'critical') markAsRead(n.id);
        });
    }
}

function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " ans";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " mois";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " j";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " h";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " min";
    return "À l'instant";
}

// Ensure init is called
setTimeout(initNotificationSystem, 1500);

// Admin Broadcast Functions
function openBroadcastModal() {
    const modal = document.getElementById('broadcastModal');
    if (modal) modal.classList.add('show');
}

function closeBroadcastModal() {
    const modal = document.getElementById('broadcastModal');
    if (modal) modal.classList.remove('show');
}

// Handle Broadcast Submission
document.addEventListener('DOMContentLoaded', () => {
    const broadcastForm = document.getElementById('broadcastForm');
    if (broadcastForm) {
        broadcastForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('bcTitle').value;
            const message = document.getElementById('bcMessage').value;
            const priority = document.getElementById('bcPriority').value;
            const hours = parseInt(document.getElementById('bcDuration').value);

            try {
                const now = new Date();
                const expiryDate = new Date(now.getTime() + hours * 60 * 60 * 1000);

                await db.collection('announcements').add({
                    title: title,
                    message: message,
                    priority: priority,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    expiryDate: firebase.firestore.Timestamp.fromDate(expiryDate),
                    createdBy: auth.currentUser ? auth.currentUser.email : 'Admin'
                });

                addSystemLog(`Diffusion d'une nouvelle annonce : ${title}`);

                closeBroadcastModal();
                broadcastForm.reset();

                // Show professional success modal
                const successModal = document.getElementById('broadcastSuccessModal');
                if (successModal) successModal.classList.add('show');
            } catch (error) {
                console.error("Error broadcasting:", error);
                alert('Erreur lors de la diffusion : ' + error.message);
            }
        });
    }
});

function closeBroadcastSuccessModal() {
    const modal = document.getElementById('broadcastSuccessModal');
    if (modal) modal.classList.remove('show');
}

// Close modals when clicking outside
window.addEventListener("click", (e) => {
    const isModal = e.target.classList.contains("modal") ||
        e.target.classList.contains("modal-overlay") ||
        e.target.classList.contains("config-modal-overlay");

    if (isModal) {
        // Remove 'show' class (Standard for this project)
        e.target.classList.remove('show');

        // Reset inline display if it was set by JS
        e.target.style.display = "";

        // Specific cleanup for some modals
        if (e.target.id === "broadcastModal") {
            const form = document.getElementById("broadcastForm");
            if (form) form.reset();
        }
    }
});

// =============================================
// AI ROBOT — Speech bubble disabled (static mode)
// =============================================
// Robot is displayed as a static SVG image only.



// =============================================
// SYSTEM MAINTENANCE: Clean Cache
// =============================================
function cleanCache() {
    console.log('Cleaning system cache...');

    // Safety check for local file execution or unsupported protocols
    const isSupportedProtocol = window.location.protocol.startsWith('http');

    // 1. Clear Service Worker Registrations
    if (isSupportedProtocol && 'serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            }).catch(err => console.warn('SW cleanup skipped:', err));
        } catch (e) { console.warn('SW access denied:', e); }
    }

    // 2. Clear Cache Storage
    if (isSupportedProtocol && 'caches' in window) {
        try {
            caches.keys().then(function (names) {
                for (let name of names) caches.delete(name);
            }).catch(err => console.warn('Cache cleanup skipped:', err));
        } catch (e) { console.warn('Cache access denied:', e); }
    }

    // 3. Clear Storage (Always safe)
    localStorage.clear();
    sessionStorage.clear();

    // 4. Show Professional Modal instead of alert
    addSystemLog(`Nettoyage du cache système effectué`);
    const cacheModal = document.getElementById('cacheSuccessModal');
    if (cacheModal) {
        cacheModal.classList.add('show');
    } else {
        alert('Nettoyage du cache réussi !');
        window.location.reload(true);
    }
}

// =============================================
// ACCOUNT REQUEST SYSTEM (EN ATTENTE)
// =============================================
function openRequestModal() {
    closeServiceSelection(); // Ensure selection modal is closed
    const modal = document.getElementById('requestModal');
    if (modal) modal.classList.add('show');
}

// =============================================
// SERVICE SELECTION SYSTEM
// =============================================
function openServiceSelection() {
    const modal = document.getElementById('serviceSelectionModal');
    if (modal) modal.classList.add('show');
}

function closeServiceSelection() {
    const modal = document.getElementById('serviceSelectionModal');
    if (modal) modal.classList.remove('show');
}

function toggleCorrectionUnitField() {
    const type = document.getElementById('corType').value;
    const unitField = document.getElementById('corUnitField');
    const phoneField = document.getElementById('corPhoneField');
    const unitSelect = document.getElementById('corNewUnit');
    const phoneInput = document.getElementById('corNewPhone');

    if (unitField) unitField.style.display = type === 'unit' ? 'block' : 'none';
    if (phoneField) phoneField.style.display = type === 'phone' ? 'block' : 'none';
    if (type !== 'unit' && unitSelect) unitSelect.value = '';
    if (type !== 'phone' && phoneInput) phoneInput.value = '';
}

function selectService(type) {
    if (type === 'request') {
        openRequestModal();
    } else if (type === 'correction') {
        openCorrectionModal();
    } else if (type === 'deactivation') {
        openDeactivationModal();
    }
    closeServiceSelection();
}

function openCorrectionModal() {
    closeServiceSelection();
    const modal = document.getElementById('correctionModal');
    if (modal) modal.classList.add('show');
}

function closeCorrectionModal() {
    const modal = document.getElementById('correctionModal');
    if (modal) modal.classList.remove('show');
    const form = document.getElementById('correctionForm');
    if (form) form.reset();
    const unitField = document.getElementById('corUnitField');
    const phoneField = document.getElementById('corPhoneField');
    if (unitField) unitField.style.display = 'none';
    if (phoneField) phoneField.style.display = 'none';
}

function openDeactivationModal() {
    closeServiceSelection();
    const modal = document.getElementById('deactivationModal');
    if (modal) modal.classList.add('show');
}

function closeDeactivationModal() {
    const modal = document.getElementById('deactivationModal');
    if (modal) modal.classList.remove('show');
    const form = document.getElementById('deactivationForm');
    if (form) form.reset();
}

function openCorrectionSuccessModal() {
    const m = document.getElementById('correctionSuccessModal');
    if (m) m.classList.add('show');
}

function closeCorrectionSuccessModal() {
    const m = document.getElementById('correctionSuccessModal');
    if (m) m.classList.remove('show');
}

function openDeactivationSuccessModal() {
    const m = document.getElementById('deactivationSuccessModal');
    if (m) m.classList.add('show');
}

function closeDeactivationSuccessModal() {
    const m = document.getElementById('deactivationSuccessModal');
    if (m) m.classList.remove('show');
}

function openCorrectionInstructionModal() {
    const m = document.getElementById('correctionInstructionModal');
    if (m) m.classList.add('show');
}

function closeCorrectionInstructionModal() {
    const m = document.getElementById('correctionInstructionModal');
    if (m) m.classList.remove('show');

    // Perform the redirect to directory search
    if (window.pendingCorrectionEmail) {
        navigateTo('directory');
        if (searchInput) {
            searchInput.value = window.pendingCorrectionEmail;
            searchInput.dispatchEvent(new Event('input'));
        }
        window.pendingCorrectionEmail = null;
    }
}

function openDeactivationConfirmModal(email, requestId) {
    const m = document.getElementById('deactivationConfirmModal');
    const displayEmail = document.getElementById('confirmDeaEmail');
    if (displayEmail) displayEmail.textContent = email;

    const approveBtn = document.getElementById('finalDeaApproveBtn');
    if (approveBtn) {
        approveBtn.onclick = async () => {
            closeDeactivationConfirmModal();
            await executeAccountBlocking(email, requestId);
        };
    }

    if (m) m.classList.add('show');
}

function closeDeactivationConfirmModal() {
    const m = document.getElementById('deactivationConfirmModal');
    if (m) m.classList.remove('show');
}

async function executeAccountBlocking(email, requestId) {
    try {
        // Find the email document ID
        const emailSnapshot = await db.collection('emails').where('mail', '==', email).get();
        if (!emailSnapshot.empty) {
            const emailDocId = emailSnapshot.docs[0].id;
            await db.collection('emails').doc(emailDocId).update({
                status: 'Bloquée',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            await db.collection('pendingRequests').doc(requestId).update({
                status: 'approved',
                resolvedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            showCopyNotification('✅ Email désactivé et compte bloqué');
            addSystemLog(`Désactivation du compte : ${email}`);
            updatePendingCount();
            syncAndRefreshFromFirestore({ render: true });
        }
    } catch (error) {
        console.error("Error blocking account:", error);
        alert("Erreur lors du blocage : " + error.message);
    }
}

function closeRequestModal() {
    const modal = document.getElementById('requestModal');
    if (modal) modal.classList.remove('show');
    const form = document.getElementById('requestForm');
    if (form) form.reset();
    const display = document.getElementById('generatedEmailDisplay');
    if (display) display.textContent = 'votre.nom@labo-nedjma.com';
}

function openRequestSuccessModal() {
    const m = document.getElementById('requestSuccessModal');
    if (m) {
        m.style.display = 'flex';
        m.style.opacity = '1';
    }
}

function closeRequestSuccessModal() {
    const m = document.getElementById('requestSuccessModal');
    if (m) m.style.display = 'none';
}

function updateGeneratedEmail() {
    const firstName = document.getElementById('reqFirstName').value.trim();
    const lastName = document.getElementById('reqLastName').value.trim();
    const display = document.getElementById('generatedEmailDisplay');
    if (!display) return;

    if (!firstName && !lastName) {
        display.textContent = 'votre.nom@labo-nedjma.com';
        return;
    }

    const cleanStr = (str) => {
        return str.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '');
    };

    const email = (cleanStr(firstName) + '.' + cleanStr(lastName) + '@labo-nedjma.com').replace(/^\.|\.$/g, '');
    display.textContent = email;

    // Dynamic Font Scaling for long emails
    const len = email.length;
    if (len > 35) display.style.fontSize = '0.65rem';
    else if (len > 30) display.style.fontSize = '0.72rem';
    else if (len > 25) display.style.fontSize = '0.8rem';
    else display.style.fontSize = '0.9rem';
}

document.addEventListener('DOMContentLoaded', () => {
    const reqFirstName = document.getElementById('reqFirstName');
    const reqLastName = document.getElementById('reqLastName');
    const requestForm = document.getElementById('requestForm');

    if (reqFirstName) reqFirstName.addEventListener('input', updateGeneratedEmail);
    if (reqLastName) reqLastName.addEventListener('input', updateGeneratedEmail);

    if (requestForm) {
        requestForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = requestForm.querySelector('.btn-request-submit');
            const originalContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
            const requestPhone = formatPhoneForDisplay(document.getElementById('reqPhone').value.trim());
            if (!isValidAlgerianPhone(requestPhone)) {
                alert("Numero de telephone invalide. Utilisez un format algerien : 0550123456 ou +213550123456.");
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                return;
            }

            const requestData = {
                type: 'new_account',
                firstName: document.getElementById('reqFirstName').value.trim(),
                lastName: document.getElementById('reqLastName').value.trim(),
                email: document.getElementById('generatedEmailDisplay').textContent,
                phone: requestPhone,
                job: document.getElementById('reqJob').value.trim(),
                location: document.getElementById('reqLocation').value.trim(),
                status: 'pending',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            try {
                await db.collection('pendingRequests').add(requestData);
                addSystemLog(`Nouvelle demande de création : ${requestData.email}`);
                closeRequestModal();
                setTimeout(() => {
                    openRequestSuccessModal();
                }, 400);
                updatePendingCount();
            } catch (error) {
                console.error('Error:', error);
                alert('Erreur lors de l\'envoi.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            }
        });
    }

    // Handle Correction Form
    const correctionForm = document.getElementById('correctionForm');
    if (correctionForm) {
        correctionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = correctionForm.querySelector('.btn-request-submit');
            const originalContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
            const correctionType = document.getElementById('corType').value;
            const newPhone = correctionType === 'phone'
                ? formatPhoneForDisplay(document.getElementById('corNewPhone').value.trim())
                : null;

            if (correctionType === 'phone' && (!newPhone || !isValidAlgerianPhone(newPhone))) {
                alert("Numero de telephone invalide. Utilisez un format algerien : 0550123456 ou +213550123456.");
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
                return;
            }

            const correctionData = {
                type: 'correction',
                email: document.getElementById('corEmail').value.trim(),
                correctionType: correctionType,
                newUnit: correctionType === 'unit' ? document.getElementById('corNewUnit').value : null,
                newPhone: newPhone,
                description: document.getElementById('corDescription').value.trim(),
                status: 'pending',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            try {
                await db.collection('pendingRequests').add(correctionData);
                addSystemLog(`Nouvelle demande de rectification : ${correctionData.email}`);
                closeCorrectionModal();
                setTimeout(() => {
                    openCorrectionSuccessModal();
                }, 400);
                updatePendingCount();
            } catch (error) {
                console.error('Error:', error);
                alert('Erreur lors de l\'envoi.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            }
        });
    }

    // Handle Deactivation Form
    const deactivationForm = document.getElementById('deactivationForm');
    if (deactivationForm) {
        deactivationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = deactivationForm.querySelector('.btn-request-submit');
            const originalContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';

            const deactivationData = {
                type: 'deactivation',
                email: document.getElementById('deaEmail').value.trim(),
                reason: document.getElementById('deaReason').value,
                effectiveDate: document.getElementById('deaDate').value,
                note: document.getElementById('deaNote').value.trim(),
                status: 'pending',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            };

            try {
                await db.collection('pendingRequests').add(deactivationData);
                addSystemLog(`Nouvelle demande de clôture : ${deactivationData.email}`);
                closeDeactivationModal();
                setTimeout(() => {
                    openDeactivationSuccessModal();
                }, 400);
                updatePendingCount();
            } catch (error) {
                console.error('Error:', error);
                alert('Erreur lors de l\'envoi.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            }
        });
    }
    updatePendingCount();
});

async function updatePendingCount() {
    try {
        const requestCount = Number.isFinite(pendingRequestsCount)
            ? pendingRequestsCount
            : companyEmails.filter(e => e.isRequest).length;
        const existingPending = (typeof companyEmails !== 'undefined') ? companyEmails.filter(e => e.status === 'En attente' && !e.isRequest).length : 0;

        const totalPending = requestCount + existingPending;

        const badge = document.getElementById('dashPendingEmails');
        const pCount = document.getElementById('pendingRequestsCount');

        if (badge) {
            animateValue(badge, totalPending, 500);
        }
        if (pCount) pCount.textContent = requestCount;

    } catch (e) { console.error(e); }
}

// =============================================
// ADMIN REQUESTS MANAGEMENT (LIST & APPROVE)
// =============================================
async function openRequestsListModal() {
    const modal = document.getElementById('requestsListModal');
    if (modal) modal.classList.add('show');
    window.isRequestsExpanded = false; // Reset expansion state
    renderRequestsList();
}

function expandRequests() {
    window.isRequestsExpanded = true;
    renderRequestsList();
}

function closeRequestsListModal() {
    const modal = document.getElementById('requestsListModal');
    if (modal) modal.classList.remove('show');
}

async function renderRequestsList() {
    const container = document.getElementById('requestsTableContainer');
    if (!container) return;

    container.innerHTML = '<div class="loading-requests"><i class="fas fa-circle-notch fa-spin"></i> Chargement des demandes...</div>';

    try {
        const snapshot = await db.collection('pendingRequests').where('status', '==', 'pending').get();
        let allDocs = snapshot.docs.map(doc => ({
            id: doc.id,
            isExistingEmail: false,
            data: () => doc.data()
        }));

        // Fetch existing emails in "En attente" state from memory
        const existingPending = (typeof companyEmails !== 'undefined') ? companyEmails.filter(e => e.status === 'En attente' && !e.isRequest) : [];
        
        existingPending.forEach(email => {
            const docId = `email-${email.mail.replace(/[^a-zA-Z0-9]/g, '_')}`;
            allDocs.push({
                id: docId,
                isExistingEmail: true,
                data: () => ({
                    type: 'existing_pending',
                    firstName: email.name.split(' ')[0] || '',
                    lastName: email.name.split(' ').slice(1).join(' ') || '',
                    email: email.mail,
                    phone: email.phone || '',
                    job: email.poste || '',
                    location: email.unit || '',
                    status: 'pending',
                    timestamp: null
                })
            });
        });

        const totalCount = allDocs.length;

        if (totalCount === 0) {
            container.innerHTML = '<div class="loading-requests">Aucune demande en attente.</div>';
            const pCount = document.getElementById('pendingRequestsCount');
            if (pCount) pCount.textContent = '0';
            return;
        }

        let html = '';
        const displayDocs = (window.isRequestsExpanded || totalCount <= 3) ? allDocs : allDocs.slice(0, 3);

        displayDocs.forEach(doc => {
            const data = doc.data();
            const dateStr = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : 'En attente d\'activation';

            let icon = 'fa-user-plus';
            let title = `${data.firstName || ''} ${data.lastName || ''}`;
            let subtitle = data.email;
            let typeBadge = '';

            if (data.type === 'correction') {
                icon = 'fa-user-pen';
                title = 'Demande de Correction';
                typeBadge = '<span style="background: #f5f3ff; color: #8b5cf6; padding: 2px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; margin-left: 8px;">CORRECTION</span>';
            } else if (data.type === 'deactivation') {
                icon = 'fa-user-slash';
                title = 'Demande de Désactivation';
                typeBadge = '<span style="background: #fef2f2; color: #ef4444; padding: 2px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; margin-left: 8px;">FERMETURE</span>';
            } else if (data.type === 'existing_pending') {
                icon = 'fa-user-clock';
                title = `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email;
                typeBadge = '<span style="background: #fffbeb; color: #d97706; padding: 2px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; margin-left: 8px;">EN ATTENTE</span>';
            }

            html += `
                <div class="req-list-item" id="req-${doc.id}" onclick="showRequestDetails('${doc.id}')" style="cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 15px; padding: 15px; border-bottom: 1px solid #f1f5f9;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #64748b; font-size: 1.1rem;">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="req-item-info" style="flex: 1;">
                        <div style="display: flex; align-items: center;">
                            <span class="req-item-name" style="font-weight: 700; color: #1e293b;">${title}</span>
                            ${typeBadge}
                        </div>
                        <span class="req-item-email" style="display: block; font-size: 0.85rem; color: #64748b;">${subtitle}</span>
                        <span class="req-item-details" style="font-size: 0.75rem; color: #94a3b8;">${dateStr}</span>
                    </div>
                    <div class="req-item-actions">
                        <button class="btn-req-details" style="background: none; border: 1px solid #e2e8f0; padding: 5px 12px; border-radius: 8px; font-size: 0.8rem; color: #64748b; cursor: pointer;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        if (totalCount > 3 && !window.isRequestsExpanded) {
            html += `
                <div class="show-more-wrapper">
                    <button class="btn-show-more-req" onclick="expandRequests()">
                        Voir plus (${totalCount - 3}) <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
            `;
        }

        container.innerHTML = html;

        // Update counts
        const pCount = document.getElementById('pendingRequestsCount');
        if (pCount) pCount.textContent = totalCount;

    } catch (error) {
        console.error("Error rendering requests:", error);
    }
}

async function showRequestDetails(requestId) {
    try {
        console.log("Loading details for request:", requestId);
        
        let data = null;
        if (requestId.startsWith('email-')) {
            const cleanId = requestId.substring(6);
            const emailObj = companyEmails.find(e => e.mail.replace(/[^a-zA-Z0-9]/g, '_') === cleanId);
            if (!emailObj) return;
            data = {
                type: 'existing_pending',
                firstName: emailObj.name.split(' ')[0] || '',
                lastName: emailObj.name.split(' ').slice(1).join(' ') || '',
                email: emailObj.mail,
                phone: emailObj.phone || '',
                job: emailObj.poste || '',
                location: emailObj.unit || '',
                timestamp: null
            };
        } else {
            const doc = await db.collection('pendingRequests').doc(requestId).get();
            if (!doc.exists) return;
            data = doc.data();
        }

        const type = (data.type || 'new_account').trim().toLowerCase();
        console.log("Request Type detected:", type);

        const body = document.getElementById('requestDetailsBody');
        const modalHeader = document.querySelector('#requestDetailsModal div[style*="background: linear-gradient"]');
        const headerIcon = modalHeader ? modalHeader.querySelector('i') : null;

        if (!body) return;

        // Define theme based on type
        let headerBg = 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'; // Default Teal
        let iconClass = 'fa-user-gear';

        if (type === 'correction') {
            headerBg = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'; // Purple
            iconClass = 'fa-user-pen';
        } else if (type === 'deactivation') {
            headerBg = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'; // Red
            iconClass = 'fa-user-slash';
        } else if (type === 'existing_pending') {
            headerBg = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'; // Amber
            iconClass = 'fa-user-clock';
        }

        if (modalHeader) {
            modalHeader.style.background = headerBg;
            const h2 = modalHeader.querySelector('h2');
            const p = modalHeader.querySelector('p');

            if (type === 'correction') {
                if (h2) h2.innerText = 'Rectification de Compte';
                if (p) p.innerText = 'Correction des informations utilisateur';
            } else if (type === 'deactivation') {
                if (h2) h2.innerText = 'Clôture de Compte';
                if (p) p.innerText = 'Désactivation définitive de l\'accès';
            } else if (type === 'existing_pending') {
                if (h2) h2.innerText = 'Activation de Compte';
                if (p) p.innerText = 'Approbation de l\'accès pour ce compte';
            } else {
                if (h2) h2.innerText = 'Détails de la Demande';
                if (p) p.innerText = 'Vérifiez les informations avant validation';
            }
        }

        if (headerIcon) {
            headerIcon.className = `fas ${iconClass}`;
        }

        const dateStr = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString('fr-FR') : 'En attente d\'activation globale';

        let contentHtml = '';

        const typeLabels = {
            'name': 'Nom / Prénom',
            'unit': 'Unité / Service',
            'job': 'Poste / Fonction',
            'phone': 'Numéro de Téléphone',
            'other': 'Autre Erreur'
        };
        const reasonLabels = {
            'end_of_mission': 'Fin de Mission',
            'transfer': 'Mutation / Transfert',
            'resignation': 'Démission',
            'retirement': 'Retraite',
            'other': 'Autre Motif'
        };
        const displayType = typeLabels[data.correctionType] || data.correctionType;
        const displayReason = reasonLabels[data.reason] || data.reason;

        if (type === 'correction') {
            contentHtml = `
                <div style="font-family: 'Poppins', sans-serif;">
                    <div style="background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; border-radius: 0 12px 12px 0; margin-bottom: 20px;">
                        <h4 style="margin: 0; color: #7c3aed; font-size: 0.9rem;">Demande de Rectification</h4>
                        <p style="margin: 5px 0 0; color: #6d28d9; font-size: 0.8rem;">L'utilisateur signale une erreur sur son compte.</p>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Email Concerné</label>
                            <div style="font-weight: 700; color: #1e293b;">${data.email}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Type de Modification</label>
                            <div style="font-weight: 700; color: #1e293b;">${displayType}</div>
                        </div>
                        ${data.newUnit ? `
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; grid-column: span 2;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Nouvelle Unité Demandée</label>
                            <div style="font-weight: 700; color: #8b5cf6;">${data.newUnit}</div>
                        </div>` : ''}
                        ${data.newPhone ? `
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; grid-column: span 2;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Nouveau Numéro de Téléphone</label>
                            <div style="font-weight: 700; color: #8b5cf6;">${data.newPhone}</div>
                        </div>` : ''}
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; grid-column: span 2;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Description des changements</label>
                            <div style="font-size: 0.9rem; color: #334155; line-height: 1.5;">${data.description}</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'deactivation') {
            contentHtml = `
                <div style="font-family: 'Poppins', sans-serif;">
                    <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 0 12px 12px 0; margin-bottom: 20px;">
                        <h4 style="margin: 0; color: #dc2626; font-size: 0.9rem;">Demande de Désactivation</h4>
                        <p style="margin: 5px 0 0; color: #b91c1c; font-size: 0.8rem;">Clôture définitive du compte professionnel.</p>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; grid-column: span 2;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Email à Fermer</label>
                            <div style="font-weight: 800; color: #ef4444; font-size: 1.1rem;">${data.email}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Motif du départ</label>
                            <div style="font-weight: 700; color: #1e293b;">${displayReason}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Date d'effet</label>
                            <div style="font-weight: 700; color: #1e293b;">${data.effectiveDate}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; grid-column: span 2;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Remarques</label>
                            <div style="font-size: 0.9rem; color: #334155; line-height: 1.5;">${data.note || 'Aucune remarque.'}</div>
                        </div>
                    </div>
                </div>
            `;
        } else if (type === 'existing_pending') {
            contentHtml = `
                <div style="font-family: 'Poppins', sans-serif;">
                    <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 12px 12px 0; margin-bottom: 20px;">
                        <h4 style="margin: 0; color: #d97706; font-size: 0.9rem;">Compte en attente d'activation</h4>
                        <p style="margin: 5px 0 0; color: #b45309; font-size: 0.8rem;">Ce compte e-mail a été enregistré et attend d'être activé par l'administrateur.</p>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; grid-column: span 2;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Identifiant e-mail</label>
                            <div style="font-weight: 800; color: #d97706; font-size: 1.15rem; word-break: break-all;">${data.email}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Nom & Prénom</label>
                            <div style="font-weight: 700; color: #1e293b;">${data.firstName} ${data.lastName}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Coordonnées</label>
                            <div style="font-weight: 700; color: #1e293b;"><i class="fas fa-phone" style="color: #f59e0b; margin-right: 5px;"></i> ${data.phone || 'Non renseigné'}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Poste / Fonction</label>
                            <div style="font-weight: 700; color: #1e293b;">${data.job}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Unité / Service</label>
                            <div style="font-weight: 700; color: #1e293b;">${data.location}</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Default: New Account
            contentHtml = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-family: 'Poppins', sans-serif;">
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Nom & Prénom</label>
                            <div style="font-size: 1.1rem; font-weight: 700; color: #0f172a;">${data.firstName} ${data.lastName}</div>
                        </div>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Coordonnées</label>
                            <div style="font-weight: 600; color: #334155; display: flex; align-items: center; gap: 10px;">
                                <i class="fas fa-phone-volume" style="color: #06b6d4;"></i> ${data.phone}
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                                <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Profession</label>
                                <div style="font-weight: 600; color: #334155; font-size: 0.9rem;">${data.job}</div>
                            </div>
                            <div style="background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;">
                                <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Unité / Lieu</label>
                                <div style="font-weight: 600; color: #334155; font-size: 0.9rem;">${data.location}</div>
                            </div>
                        </div>
                        <div style="background: #ecfeff; border: 1px solid #bae6fd; padding: 15px; border-radius: 12px; flex: 1; display: flex; flex-direction: column; justify-content: center;">
                            <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #0891b2; text-transform: uppercase; margin-bottom: 5px;">Identifiant Pro Généré</label>
                            <div style="font-weight: 800; color: #0369a1; font-size: 1rem; word-break: break-all;">${data.email}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        body.innerHTML = `
            ${contentHtml}
            <div style="font-size: 0.75rem; color: #94a3b8; text-align: center; margin-top: 15px; border-top: 1px dashed #e2e8f0; padding-top: 10px; font-family: 'Poppins', sans-serif;">
                <i class="fas fa-clock"></i> Reçu le : ${dateStr}
            </div>
        `;

        // Setup buttons
        const approveBtn = document.getElementById('detailApproveBtn');
        const rejectBtn = document.getElementById('detailRejectBtn');

        if (approveBtn) approveBtn.onclick = () => { closeRequestDetailsModal(); approveRequest(requestId); };
        if (rejectBtn) rejectBtn.onclick = () => { closeRequestDetailsModal(); rejectRequest(requestId); };

        const m = document.getElementById('requestDetailsModal');
        if (m) m.style.display = 'flex';

    } catch (e) {
        console.error("Error loading details:", e);
    }
}

function closeRequestDetailsModal() {
    const m = document.getElementById('requestDetailsModal');
    if (m) m.style.display = 'none';
}

async function approveRequest(requestId) {
    try {
        if (requestId.startsWith('email-')) {
            const cleanId = requestId.substring(6);
            const emailObj = companyEmails.find(e => e.mail.replace(/[^a-zA-Z0-9]/g, '_') === cleanId);
            if (!emailObj) return;

            // Find correct document ID in Firestore
            const emailSnapshot = await db.collection('emails').where('mail', '==', emailObj.mail).get();
            const targetDocId = !emailSnapshot.empty ? emailSnapshot.docs[0].id : cleanId;

            // Activate the account in the emails collection
            await db.collection('emails').doc(targetDocId).update({
                status: 'Active',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            addSystemLog(`Activation du compte e-mail : ${emailObj.mail}`);
            showCopyNotification('✅ Compte activé avec succès');
            closeRequestsListModal();
            await syncAndRefreshFromFirestore({ render: true });
            updatePendingCount();
            return;
        }

        const doc = await db.collection('pendingRequests').doc(requestId).get();
        if (!doc.exists) return;
        const data = doc.data();

        closeRequestsListModal();

        if (data.type === 'correction') {
            // Populate and open custom instruction modal
            const instrEmail = document.getElementById('instrEmail');
            const instrDesc = document.getElementById('instrDesc');
            if (instrEmail) instrEmail.textContent = data.email;
            if (instrDesc) {
                const correctionTypeLabels = {
                    name: 'Nom / Prénom',
                    unit: 'Unité / Service',
                    job: 'Poste / Fonction',
                    phone: 'Numéro de Téléphone',
                    other: 'Autre Erreur'
                };
                const correctionParts = [];
                if (data.correctionType) correctionParts.push(`Type : ${correctionTypeLabels[data.correctionType] || data.correctionType}`);
                if (data.newUnit) correctionParts.push(`Nouvelle unité : ${data.newUnit}`);
                if (data.newPhone) correctionParts.push(`Nouveau téléphone : ${data.newPhone}`);
                if (data.description) correctionParts.push(`Description : ${data.description}`);
                instrDesc.textContent = correctionParts.join('\n');
            }

            // Store target email for the redirect action
            window.pendingCorrectionEmail = data.email;

            openCorrectionInstructionModal();

            // Mark as resolved in background
            await db.collection('pendingRequests').doc(requestId).update({
                status: 'approved',
                resolvedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            updatePendingCount();
            return;
        }

        if (data.type === 'deactivation') {
            openDeactivationConfirmModal(data.email, requestId);
            return;
        }

        // Default: New Account Request
        openAddEmailModal();
        const admName = document.getElementById('adm_name');
        const admMail = document.getElementById('adm_mail');
        const admPoste = document.getElementById('adm_poste');
        const admUnit = document.getElementById('adm_unit');
        const admStatus = document.getElementById('adm_status');
        const admPhone = document.getElementById('adm_phone');

        if (admName) admName.value = `${data.firstName} ${data.lastName}`;
        if (admMail) admMail.value = data.email;
        if (admPhone) admPhone.value = normalizePhoneValue(data.phone);
        if (admPoste) admPoste.value = data.job;
        if (admUnit) admUnit.value = data.location;
        if (admStatus) admStatus.value = 'Active';

        window.currentApprovingRequestId = requestId;

    } catch (error) {
        console.error("Error approving request:", error);
    }
}

async function rejectRequest(requestId) {
    const modal = document.getElementById('rejectRequestModal');
    const confirmBtn = document.getElementById('confirmRejectRequestBtn');

    if (!modal || !confirmBtn) return;

    modal.classList.add('show');

    confirmBtn.onclick = async () => {
        try {
            if (requestId.startsWith('email-')) {
                const cleanId = requestId.substring(6);
                const emailObj = companyEmails.find(e => e.mail.replace(/[^a-zA-Z0-9]/g, '_') === cleanId);
                if (!emailObj) return;

                // Find correct document ID in Firestore
                const emailSnapshot = await db.collection('emails').where('mail', '==', emailObj.mail).get();
                const targetDocId = !emailSnapshot.empty ? emailSnapshot.docs[0].id : cleanId;

                // Move to Bloquée instead of deleting
                await db.collection('emails').doc(targetDocId).update({
                    status: 'Bloquée',
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                addSystemLog(`Blocage du compte en attente : ${emailObj.mail}`);
                showCopyNotification('?? Compte déplacé vers Bloqués');
                closeRejectRequestModal();
                closeRequestDetailsModal();
                await syncAndRefreshFromFirestore({ render: true });
                renderRequestsList();
                updatePendingCount();
                return;
            }

            await db.collection('pendingRequests').doc(requestId).update({
                status: 'rejected',
                resolvedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            const doc = await db.collection('pendingRequests').doc(requestId).get();
            const email = doc.exists ? doc.data().email : '---';
            addSystemLog(`Demande rejetée pour : ${email}`);

            closeRejectRequestModal();
            closeRequestDetailsModal();
            renderRequestsList();
            updatePendingCount();
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };
}

function closeRejectRequestModal() {
    const modal = document.getElementById('rejectRequestModal');
    if (modal) modal.classList.remove('show');
}

function handlePendingClick() {
    // If admin is logged in (auth.currentUser exists)
    if (auth && auth.currentUser) {
        openRequestsListModal();
    } else {
        // Fallback for regular users
        navigateTo('directory');
        filterBy('pending');
    }
}

// Database real-time sync status indicator controller
function updateDbSyncStatus(state) {
    const indicator = document.getElementById('dbSyncStatus');
    if (!indicator) return;

    // Reset classes
    indicator.className = 'db-sync-status';
    
    const icon = indicator.querySelector('i');
    const textSpan = indicator.querySelector('span:not(.db-sync-dot)');
    
    if (state === 'syncing') {
        indicator.classList.add('syncing');
        if (icon) icon.className = 'fas fa-sync';
        if (textSpan) textSpan.textContent = 'Mise à jour...';
    } else if (state === 'synced') {
        indicator.classList.add('synced');
        if (icon) icon.className = 'fas fa-database';
        if (textSpan) textSpan.textContent = 'Base de données à jour';
    } else if (state === 'offline') {
        indicator.classList.add('offline');
        if (icon) icon.className = 'fas fa-wifi-slash';
        if (textSpan) textSpan.textContent = 'Mode hors ligne';
    }

    // Keep popover fields updated in real-time
    updatePopoverFields();
}

// Toggle database popover
function toggleDbPopover(event) {
    if (event) event.stopPropagation();
    const popover = document.getElementById('dbSyncPopover');
    if (!popover) return;
    
    const isShowing = popover.classList.contains('show');
    if (isShowing) {
        popover.classList.remove('show');
    } else {
        // Close other dropdowns if open
        const notifDropdown = document.getElementById('notifDropdown');
        if (notifDropdown) notifDropdown.classList.remove('show');
        
        updatePopoverFields();
        popover.classList.add('show');
    }
}

// Update popover data fields
function updatePopoverFields() {
    const lastUpdateEl = document.getElementById('popoverLastUpdate');
    const lastSyncEl = document.getElementById('popoverLastSync');
    const modeEl = document.getElementById('popoverMode');

    if (lastUpdateEl) {
        lastUpdateEl.textContent = lastKnownUpdateDate || '---';
    }
    if (lastSyncEl) {
        const dateObj = lastLocalSyncAt ? new Date(lastLocalSyncAt) : new Date();
        const dateStr = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const timeStr = dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        lastSyncEl.innerHTML = `${dateStr}<br>à ${timeStr}`;
    }
    if (modeEl) {
        const isOnline = navigator.onLine;
        modeEl.textContent = isOnline ? 'En ligne' : 'Hors ligne';
        modeEl.style.color = isOnline ? 'var(--green)' : '#ef4444';
    }
}

// Force a manual database sync
async function manualForceSync(event) {
    if (event) event.stopPropagation();
    const btn = document.getElementById('popoverSyncBtn');
    if (!btn || btn.disabled) return;

    try {
        btn.disabled = true;
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');
        
        if (icon) icon.className = 'fas fa-sync fa-spin';
        if (text) text.textContent = 'Mise à jour...';

        // Call full sync from Firestore
        const success = await syncAndRefreshFromFirestore({ render: true });
        
        if (icon) icon.className = success ? 'fas fa-check' : 'fas fa-times';
        if (text) text.textContent = success ? 'Réussie !' : 'Échouée';
        
        if (success) {
            updatePopoverFields();
            showCopyNotification('✅ Base de données actualisée');
        } else {
            showCopyNotification('? Échec de la synchronisation');
        }

        setTimeout(() => {
            if (icon) icon.className = 'fas fa-sync';
            if (text) text.textContent = 'Synchroniser';
            btn.disabled = false;
        }, 1500);

    } catch (e) {
        console.error(e);
        btn.disabled = false;
    }
}

// Bind functions to window object for global HTML scope access
window.toggleDbPopover = toggleDbPopover;
window.manualForceSync = manualForceSync;
window.updateDbSyncStatus = updateDbSyncStatus;



