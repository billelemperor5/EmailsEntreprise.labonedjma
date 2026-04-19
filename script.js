// ================================================
// LABO NEDJMA — EMAIL TRACKING SYSTEM v3.0
// Professional Dashboard Script with Firebase Auth
// ================================================

// Firebase configuration
// Enable a lighter rendering mode automatically on low-end devices.
// Can be forced with localStorage.setItem('labo-performance-mode', 'lite')
// or disabled with localStorage.setItem('labo-performance-mode', 'full').
(function initPerformanceMode() {
    let savedMode = null;
    try {
        savedMode = localStorage.getItem('labo-performance-mode');
    } catch (e) {
        savedMode = null;
    }

    const nav = typeof navigator !== 'undefined' ? navigator : {};
    const lowMemory = nav.deviceMemory && nav.deviceMemory <= 4;
    const lowCpu = nav.hardwareConcurrency && nav.hardwareConcurrency <= 4;
    const smallScreen = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const liteMode = savedMode === 'lite' || (!savedMode && (lowMemory || lowCpu || (smallScreen && lowCpu) || reducedMotion));

    document.documentElement.classList.toggle('performance-lite', !!liteMode);
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

// Initialize Firebase (Compat version)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
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
    const progressFill = splash.querySelector('.splash-progress-fill');

    let pct = 0;
    const messages = ['Initialisation...', 'Chargement des modules...', 'Synchronisation Cloud...', 'Finalisation...'];
    
    // Smooth progress animation up to 90%
    const progressInterval = setInterval(() => {
        if (pct < (perfLite ? 80 : 90)) {
            pct += perfLite ? 8 : 1;
            if (pct > (perfLite ? 80 : 90)) pct = perfLite ? 80 : 90;
            if (pctEl) pctEl.textContent = pct + '%';
            if (progressFill) progressFill.style.width = pct + '%';
            
            if (pct === 30 && statusText) statusText.textContent = messages[1];
            if (pct === 60 && statusText) statusText.textContent = messages[2];
        }
    }, perfLite ? 70 : 30);

    // FETCH CLOUD DATA
    const dataLoaded = await fetchEmailsFromFirestore();
    
    // Complete progress to 100% once data is loaded
    clearInterval(progressInterval);
    pct = perfLite ? 80 : 90;
    const finalInterval = setInterval(() => {
        pct += perfLite ? 10 : 2;
        if (pct > 100) pct = 100;
        if (pctEl) pctEl.textContent = pct + '%';
        if (progressFill) progressFill.style.width = pct + '%';
        
        if (pct >= 100) {
            clearInterval(finalInterval);
            if (statusText) statusText.textContent = 'Système prêt !';
            
            // Proceed to App Initialization
            initializeAppCore();

            setTimeout(() => {
                splash.classList.add('fade-out');
                if (sidebar) sidebar.style.opacity = '1';
                if (mainWrapper) mainWrapper.style.opacity = '1';
                setTimeout(() => splash.remove(), perfLite ? 250 : 1000);
            }, perfLite ? 120 : 600);
        }
    }, perfLite ? 25 : 20);
}

// Global Core Initialization
function initializeAppCore() {
    initAuthSystem();
    initUnitManagement(); // Initialize unit CRUD listeners
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

/**
 * Fetches all emails from Firebase Firestore in real-time
 */
async function fetchEmailsFromFirestore() {
    try {
        // Fetch Emails
        const snapshot = await db.collection('emails').get();
        companyEmails = snapshot.docs.map(doc => doc.data());
        
        // Fetch System Date
        const settingsDoc = await db.collection('settings').doc('app').get();
        if (settingsDoc.exists && settingsDoc.data().lastUpdate) {
            const updateDate = settingsDoc.data().lastUpdate;
            const dateEl = getEl('lastUpdateDate');
            if (dateEl) dateEl.innerText = updateDate;
            const bannerDateEl = getEl('bannerLastUpdate');
            if (bannerDateEl) bannerDateEl.innerText = updateDate;
        }

        // Sanitize: Remove names for blocked emails
        companyEmails = companyEmails.map(e => {
            if (e.status === 'Bloquée') return { ...e, name: "-" };
            return e;
        });

        console.log(`Successfully fetched ${companyEmails.length} emails and system settings from cloud.`);
        
        // Also fetch system units
        await fetchSystemUnits();
        populateUnitDropdowns(); // Populate add/edit dropdowns
        
        return true;
    } catch (error) {
        console.error("Error fetching data:", error);
        return false;
    }
}

async function fetchSystemUnits() {
    try {
        const doc = await db.collection('settings').doc('units_config').get();
        if (doc.exists) {
            systemUnits = doc.data().list || [];
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
    try {
        await db.collection('settings').doc('units_config').set({ list: systemUnits });
        if (typeof renderUnitStats === 'function') renderUnitStats();
        if (typeof renderUnitsManageList === 'function') renderUnitsManageList();
        populateUnitDropdowns(); // Ensure dropdowns are synced
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
const dashUnitsCount = document.getElementById('dashUnitsCount');

// Sidebar elements
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarLinks = document.querySelectorAll('.sidebar-link[data-page]');

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

function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(p => {
        p.classList.remove('active');
    });

    // Deactivate all sidebar links
    sidebarLinks.forEach(l => l.classList.remove('active'));

    // Activate target page
    const targetPage = document.getElementById('page' + page.charAt(0).toUpperCase() + page.slice(1));
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Activate sidebar link
    const targetLink = document.querySelector(`.sidebar-link[data-page="${page}"]`);
    if (targetLink) targetLink.classList.add('active');

    // Update topbar title
    if (pageTitles[page]) {
        pageTitle.innerHTML = pageTitles[page];
    }

    // AUTO-CLEAR SEARCH: Reset search on ANY navigation to ensure a fresh view
    if (typeof searchInput !== 'undefined' && searchInput) {
        searchInput.value = '';
        // Only trigger render if we were previously filtering to avoid redundant renders
        if (typeof renderEmailList === 'function') renderEmailList();
    }

    // Search bar is always visible

    // Execute page-specific rendering
    if (page === 'dashboard') {
        updateDashboardStats();
    } else if (page === 'directory') {
        // Only clear search if it's empty (don't clear if coming from global search)
        if (!searchInput.value.trim()) {
            searchInput.value = '';
            renderEmails(companyEmails);
        } else {
            // Re-filter with current search term
            const term = searchInput.value.toLowerCase();
            const filtered = companyEmails.filter(item =>
                item.name.toLowerCase().includes(term) ||
                item.mail.toLowerCase().includes(term) ||
                item.unit.toLowerCase().includes(term) ||
                item.poste.toLowerCase().includes(term) ||
                item.status.toLowerCase().includes(term)
            );
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
    }

    // Close mobile sidebar
    sidebar.classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('show');

    // Update mobile bottom nav active state
    document.querySelectorAll('.mob-nav-item[data-page]').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-page') === page);
    });

    // Scroll to top
    document.querySelector('.page-content').scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sidebar link click handlers
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        navigateTo(page);
    });
});

// About/Developer link
const devModal = document.getElementById('devModal');

document.getElementById('navAbout').addEventListener('click', (e) => {
    e.preventDefault();
    if (devModal) devModal.classList.add('show');
});

const companyModal = document.getElementById('companyModal');

document.getElementById('navCompany').addEventListener('click', (e) => {
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

// Mobile sidebar toggle (null check to prevent crash if not found)
if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            document.body.appendChild(overlay);
            overlay.addEventListener('click', () => {
                sidebar.classList.remove('open');
                overlay.classList.remove('show');
            });
        }
        overlay.classList.toggle('show');
    });
}

// =============================================
// DASHBOARD STATS
// =============================================
function updateDashboardStats() {
    const total = companyEmails.length;
    const active = companyEmails.filter(e => e.status === 'Active').length;
    const blocked = companyEmails.filter(e => e.status === 'Bloquée').length;
    const units = [...new Set(companyEmails.map(e => e.unit))].length;

    animateValue(dashTotalEmails, 0, total, 800);
    animateValue(dashActiveEmails, 0, active, 900);
    animateValue(dashBlockedEmails, 0, blocked, 1000);
    animateValue(dashUnitsCount, 0, units, 700);

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

function animateValue(el, start, end, duration) {
    if (!el) return;
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

// =============================================
// EMAIL TABLE RENDERING & PAGINATION
// =============================================
let currentPage = 1;
const itemsPerPage = 14;
let currentFilteredEmails = [];

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

    let rowsHtml = '';
    paginatedEmails.forEach((item, i) => {
        const globalIndex = startIndex + i + 1;
        const statusClass = item.status === 'Bloquée' ? 'status-blocked' : 'status-active';
        const unitObj = systemUnits.find(u => u.name === item.unit);
        const badgeColor = unitObj ? unitObj.color : '#64748b';
        const badgeStyle = `background: ${badgeColor}15; color: ${badgeColor}; border: 1px solid ${badgeColor}40;`;

        rowsHtml += `
            <tr>
                <td style="font-weight: 700; color: #94a3b8;">${globalIndex}</td>
                <td><span class="unit-badge" style="${badgeStyle}">${item.unit}</span></td>
                <td><strong>${item.name}</strong></td>
                <td>${item.poste}</td>
                <td style="color: var(--primary); font-weight: 600;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <span>${item.mail}</span>
                        ${item.status === 'Active' ? `<button class="single-copy-btn" onclick="copySingleEmail('${item.mail}')" title="Copier cet email"><i class="fas fa-copy"></i></button>` : ''}
                    </div>
                </td>
                <td>
                    <span class="${statusClass}">
                        <span class="status-dot-inline"></span>
                        ${item.status}
                    </span>
                </td>
                <td class="admin-only">
                    <div class="action-btns">
                        <button class="btn-action btn-edit" onclick="handleEditEmail('${item.mail}')" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="handleDeleteEmail('${item.mail}')" title="Supprimer">
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
    refreshAppUI();
}

function showAllEmails() {
    activeView = { type: 'all', value: null };
    currentPage = 1;
    refreshAppUI();
}

function filterByStatus(status) {
    activeView = { type: 'status', value: status };
    currentPage = 1;
    refreshAppUI();
}

function filterBy(type) {
    if (type === 'all') showAllEmails();
    else if (type === 'active') filterByStatus('Active');
    else if (type === 'blocked') filterByStatus('Bloquée');
    else {
        // Handle search-like filters
        activeView = { type: 'search', value: type === 'corporate' ? '@labo-nedjma.com' : type };
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
    const percentage = total > 0 ? Math.round((active / total) * 100) : 0;

    if (totalCountEl) totalCountEl.innerText = total;
    if (activeCountEl) activeCountEl.innerText = active;
    if (blockedCountEl) blockedCountEl.innerText = blocked;
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (activationRateEl) activationRateEl.innerText = `${percentage}%`;
}

// =============================================
// SEARCH FUNCTIONALITY
// =============================================
let searchDebounceTimer = null;
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();

    // If not on directory page, navigate to it first
    const directoryPage = document.getElementById('pageDirectory');
    if (!directoryPage || !directoryPage.classList.contains('active')) {
        navigateTo('directory');
    }

    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        const filtered = companyEmails.filter(item =>
            String(item.name || '').toLowerCase().includes(term) ||
            String(item.mail || '').toLowerCase().includes(term) ||
            String(item.unit || '').toLowerCase().includes(term) ||
            String(item.poste || '').toLowerCase().includes(term) ||
            String(item.status || '').toLowerCase().includes(term)
        );
        renderEmails(filtered);
        renderRecent(filtered);
        updateDirectoryStats(filtered);
        applyDirectoryTheme(term);
    }, 120);
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

// =============================================
// FILTER SYSTEM
// =============================================
function filterBy(type) {
    if (type === 'all') {
        searchInput.value = '';
    } else if (type === 'corporate') {
        searchInput.value = '@labo-nedjma.com';
    } else if (type === 'active') {
        searchInput.value = 'Active';
    } else if (type === 'blocked') {
        searchInput.value = 'Bloquée';
    }
    searchInput.dispatchEvent(new Event('input'));
}

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
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        showToast(count);
    } catch (err) {
        console.error('Fallback failed', err);
    }
    document.body.removeChild(textArea);
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
                            <span style="color: var(--green); font-weight: 800;">${active}</span> / 
                            <span style="color: var(--red); font-weight: 800;">${blocked}</span>
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
        item.className = 'unit-manage-item';
        item.innerHTML = `
            <div class="unit-manage-info">
                <div class="color-dot" style="background: ${unit.color} !important; color: ${unit.color};"></div>
                <span class="unit-manage-name">${unit.name}</span>
            </div>
            <div class="unit-manage-actions">
                <button class="btn-unit-del" onclick="deleteUnit('${unit.id}')" title="Supprimer">
                    <i class="fas fa-trash"></i>
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
    confirmUnitDeleteBtn.onclick = async function() {
        if (!unitIdToDelete) return;
        try {
            confirmUnitDeleteBtn.disabled = true;
            confirmUnitDeleteBtn.innerText = "Suppression...";
            
            systemUnits = systemUnits.filter(u => u.id !== unitIdToDelete);
            await saveSystemUnits();
            
            showCopyNotification('🗑️ Unité supprimée');
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
    const select = document.getElementById('adm_unit');
    if (!select) return;

    // Use current selection as preference
    const currentVal = select.value;
    select.innerHTML = '';

    systemUnits.forEach(unit => {
        const opt = document.createElement('option');
        opt.value = unit.name;
        opt.textContent = unit.name;
        select.appendChild(opt);
    });

    if (currentVal && Array.from(select.options).some(o => o.value === currentVal)) {
        select.value = currentVal;
    }
}

function viewUnitDetails(unit) {
    navigateTo('directory');
    searchInput.value = unit;
    searchInput.dispatchEvent(new Event('input'));
    applyDirectoryTheme(unit);
}

// =============================================
// DATABASE / ARCHIVE
// =============================================
function renderArchiveLog() {
    if (!archiveLog) return;
    archiveLog.innerHTML = '';

    const logs = [
        { text: 'Optimisation de la base de données Douera', date: '27 - 03 - 2026' },
        { text: 'Mise à jour des protocoles SMTP Outlook', date: '27 - 03 - 2026' },
        { text: 'Synchronisation Master Data (126 entrées)', date: '25 - 03 - 2026' },
        { text: 'Nettoyage des emails bloqués (Unit: Larbâa)', date: '24 - 03 - 2026' },
        { text: 'Sauvegarde automatique réussie', date: '23 - 03 - 2026' }
    ];

    logs.forEach(log => {
        archiveLog.innerHTML += `
            <div class="archive-item">
                <span class="archive-text">${log.text}</span>
                <span class="archive-date">${log.date}</span>
            </div>
        `;
    });
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
        showCopyNotification('❌ Erreur de copie — veuillez copier manuellement');
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
        z-index: 99999;
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
// THEME MANAGEMENT — Dark Mode Switcher
// =============================================
function toggleTheme() {
    const html = document.documentElement;
    const themeBtn = document.getElementById('themeToggle');
    const icon = themeBtn ? themeBtn.querySelector('i') : null;

    if (html.classList.contains('dark-mode')) {
        html.classList.remove('dark-mode');
        localStorage.setItem('labo-theme', 'light');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    } else {
        html.classList.add('dark-mode');
        localStorage.setItem('labo-theme', 'dark');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
}

// Initialize Theme on Load
(function initTheme() {
    const savedTheme = localStorage.getItem('labo-theme');
    const html = document.documentElement;

    if (savedTheme === 'dark') {
        html.classList.add('dark-mode');
        // We'll update binary icon state after DOM content loads to ensure the button exists
    }

    window.addEventListener('DOMContentLoaded', () => {
        const themeBtn = document.getElementById('themeToggle');
        const icon = themeBtn ? themeBtn.querySelector('i') : null;
        if (savedTheme === 'dark' && icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
        
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
                await auth.signOut();
                closeLogoutModal();
                showCopyNotification('🚪 Déconnexion réussie');
            } catch (error) {
                console.error("Logout Error:", error);
            }
        };
    }



    // Monitor Auth State
    auth.onAuthStateChanged((user) => {
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
            if (currentFilteredEmails.length > 0) renderEmails(currentFilteredEmails, currentPage);
            
            console.log("Admin Logged In. Cloud Control Enabled.");
        } else {
            // User is signed out
            if (loginBtn) loginBtn.classList.remove('hidden');
            if (userInfo) userInfo.classList.add('hidden');
            document.body.classList.remove('is-admin');
            
            // Re-render emails to hide action buttons
            if (currentFilteredEmails.length > 0) renderEmails(currentFilteredEmails, currentPage);
        }
    });
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
    showCopyNotification('⏳ Début de la migration...');

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
let isEditMode = false;
let originalEmailForEdit = null;

// Open Add Modal
function openAddEmailModal() {
    const modal = getEl('emailAdminModal');
    const form = getEl('emailAdminForm');
    const title = getEl('adminModalTitle');
    
    if (!modal || !form) return;

    isEditMode = false;
    originalEmailForEdit = null;
    title.innerText = "Ajouter un Email";
    form.reset();
    getEl('adm_mail').disabled = false; // Enable email editing for new entries
    populateUnitDropdowns(); // Ensure units are fresh
    modal.classList.add('show');
}

// Open Edit Modal
async function handleEditEmail(email) {
    const modal = getEl('emailAdminModal');
    const title = getEl('adminModalTitle');
    if (!modal) return;

    try {
        showCopyNotification('⏳ Chargement des données...');
        
        // Find email in current data
        const item = companyEmails.find(e => e.mail === email);
        if (!item) return;

        isEditMode = true;
        originalEmailForEdit = item.mail;
        populateUnitDropdowns(); // Ensure units are fresh
        originalEmailForEdit = email;
        title.innerText = "Modifier l'Email";

        // Fill Form
        getEl('adm_unit').value = item.unit;
        getEl('adm_name').value = item.name;
        getEl('adm_poste').value = item.poste;
        getEl('adm_mail').value = item.mail;
        getEl('adm_mail').disabled = false; // Enabled: Allow changing the email address
        getEl('adm_status').value = item.status;

        modal.classList.add('show');

    } catch (error) {
        console.error("Edit Error:", error);
    }
}

// Close Modals
function closeAdminModal() {
    const modal = getEl('emailAdminModal');
    if (modal) modal.classList.remove('show');
}

function closeDeleteModal() {
    const modal = getEl('deleteConfirmModal');
    if (modal) modal.classList.remove('show');
}

/**
 * Handle Deletion
 */
function handleDeleteEmail(email) {
    if (!auth.currentUser) return;
    emailToBeDeleted = email;
    const display = getEl('deleteEmailDisplay');
    const modal = getEl('deleteConfirmModal');
    
    if (display) display.innerText = email;
    if (modal) modal.classList.add('show');
}
// Global View State Management
let activeView = { type: 'all', value: null };

// Unified Refresh Function (Maintains context)
async function refreshAppUI() {
    await fetchEmailsFromFirestore();
    
    // Sync System Date from Cloud
    try {
        const settingsDoc = await db.collection('settings').doc('app').get();
        if (settingsDoc.exists && settingsDoc.data().lastUpdate) {
            const updateDate = settingsDoc.data().lastUpdate;
            const dateEl = getEl('lastUpdateDate');
            if (dateEl) dateEl.innerText = updateDate;
            const bannerDateEl = getEl('bannerLastUpdate');
            if (bannerDateEl) bannerDateEl.innerText = updateDate;
        }
    } catch (e) { console.warn("Date Sync Issue:", e); }

    let filtered = [...companyEmails];
    
    if (activeView.type === 'unit') {
        filtered = companyEmails.filter(e => e.unit === activeView.value);
    } else if (activeView.type === 'status') {
        filtered = companyEmails.filter(e => e.status === activeView.value);
    } else if (activeView.type === 'search') {
        const q = activeView.value.toLowerCase();
        filtered = companyEmails.filter(e => 
            e.name.toLowerCase().includes(q) || 
            e.mail.toLowerCase().includes(q) ||
            e.poste.toLowerCase().includes(q)
        );
    }
    
    renderEmails(filtered, currentPage);
    updateDashboardStats();
    renderRecent(); // Update recent additions list
}

// Manual Save Button Click (Zero-Refresh)
const saveEmailBtn = getEl('saveEmailBtn');
if (saveEmailBtn) {
    saveEmailBtn.onclick = async function() {
        if (!auth.currentUser) {
            alert("⚠️ Erreur : Vous n'êtes pas connecté.");
            return;
        }

        const emailVal = getEl('adm_mail').value;
        if (!emailVal) return alert("⚠️ Erreur : L'adresse email est obligatoire.");

        const emailData = {
            unit: getEl('adm_unit').value,
            name: getEl('adm_name').value,
            poste: getEl('adm_poste').value,
            mail: emailVal,
            status: getEl('adm_status').value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            saveEmailBtn.disabled = true;
            saveEmailBtn.innerText = "⏳ Enregistrement...";
            
            const newDocId = emailVal.replace(/[^a-zA-Z0-9]/g, '_');
            
            // If email changed during edit, move data (delete old, save new)
            if (isEditMode && originalEmailForEdit && originalEmailForEdit !== emailVal) {
                const oldDocId = originalEmailForEdit.replace(/[^a-zA-Z0-9]/g, '_');
                await db.collection('emails').doc(oldDocId).delete();
            }

            await db.collection('emails').doc(newDocId).set(emailData, { merge: true });
            
            showCopyNotification(isEditMode ? '✅ Modifié' : '✅ Ajouté');
            closeAdminModal();
            await refreshAppUI();

        } catch (error) {
            console.error(error);
            alert("❌ Erreur Firebase: " + error.message);
        } finally {
            saveEmailBtn.disabled = false;
            saveEmailBtn.innerText = "Enregistrer";
        }
    };
}

// Manual Delete Button Click (Zero-Refresh)
const confirmDeleteBtnManual = getEl('confirmDeleteBtnManual');
if (confirmDeleteBtnManual) {
    confirmDeleteBtnManual.onclick = async function() {
        if (!emailToBeDeleted) return;
        try {
            showCopyNotification('⏳ Suppression...');
            const docId = emailToBeDeleted.replace(/[^a-zA-Z0-9]/g, '_');
            await db.collection('emails').doc(docId).delete();
            
            showCopyNotification('✅ Supprimé');
            closeDeleteModal();
            
            // Smart Refresh - stays in current view
            await refreshAppUI();
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la suppression.");
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
    saveSystemDateBtn.onclick = async function() {
        const newDate = getEl('newSystemDateInput').value.trim();
        const currentDate = getEl('lastUpdateDate').innerText;
        
        if (!newDate) return alert("Veuillez saisir une date.");
        
        try {
            saveSystemDateBtn.disabled = true;
            saveSystemDateBtn.innerText = "⏳ Enregistrement...";
            
            await db.collection('settings').doc('app').set({
                lastUpdate: newDate,
                updatedBy: auth.currentUser.email,
                clientTimestamp: new Date().toISOString()
            }, { merge: true });
            
            getEl('lastUpdateDate').innerText = newDate;
            const bannerDateEl = getEl('bannerLastUpdate');
            if (bannerDateEl) bannerDateEl.innerText = newDate;
            showCopyNotification('✅ Date système mise à jour');
            closeDateModal();
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la mise à jour.");
        } finally {
            saveSystemDateBtn.disabled = false;
            saveSystemDateBtn.innerText = "Enregistrer";
        }
    };
}

// Outside clicks to close all modals
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        if (typeof closeAdminModal === 'function') closeAdminModal();
        if (typeof closeDeleteModal === 'function') closeDeleteModal();
        if (typeof closeDateModal === 'function') closeDateModal();
        if (typeof closeLogoutModal === 'function') closeLogoutModal();
        if (typeof closeUnitDeleteModal === 'function') closeUnitDeleteModal();
        if (typeof closeUnitManagement === 'function') closeUnitManagement();
    }
});
