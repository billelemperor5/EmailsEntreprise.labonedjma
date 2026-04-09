// ================================================
// LABO NEDJMA — EMAIL TRACKING SYSTEM v2.0
// Professional Dashboard Script
// ================================================

(function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("NZzp8VaAhdhkS_mlV");
    }
})();

// =============================================
// SPLASH SCREEN — Premium v3.0
// =============================================
(function initSplashScreen() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    // Hide main content during splash
    const sidebar = document.getElementById('sidebar');
    const mainWrapper = document.querySelector('.main-wrapper');
    if (sidebar) sidebar.style.opacity = '0';
    if (mainWrapper) mainWrapper.style.opacity = '0';

    // Status text updates
    const statusText = splash.querySelector('.splash-status-text');
    const pctEl = splash.querySelector('.splash-progress-pct');
    const messages = [
        'Initialisation du système...',
        'Chargement des modules...',
        'Synchronisation des emails...',
        'Préparation de l\'interface...',
        'Système prêt !'
    ];

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
        msgIndex++;
        if (msgIndex < messages.length && statusText) {
            statusText.textContent = messages[msgIndex];
        }
    }, 650);

    // Percentage counter animation
    if (pctEl) {
        let pct = 0;
        const pctInterval = setInterval(() => {
            pct += 1;
            if (pct > 100) pct = 100;
            pctEl.textContent = pct + '%';
            if (pct >= 100) clearInterval(pctInterval);
        }, 33);
    }

    // After loading completes, fade out splash
    setTimeout(() => {
        clearInterval(msgInterval);
        if (statusText) statusText.textContent = 'Système prêt !';
        if (pctEl) pctEl.textContent = '100%';

        setTimeout(() => {
            splash.classList.add('fade-out');

            // Show main content
            if (sidebar) {
                sidebar.style.transition = 'opacity 0.6s ease';
                sidebar.style.opacity = '1';
            }
            if (mainWrapper) {
                mainWrapper.style.transition = 'opacity 0.6s ease';
                mainWrapper.style.opacity = '1';
            }

            // Remove splash from DOM after animation
            setTimeout(() => {
                splash.remove();
            }, 900);
        }, 400);
    }, 3400);
})();

// =============================================
// DATA — Company Email Directory
// =============================================
let companyEmails = [
    // Douera Unit
    { unit: "Douera", name: "Ahlem TOURQUI", poste: "Coordinatrice d'achat", mail: "supply.logistics@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Amina ABDOUNE", poste: "Secrétaire", mail: "secretariat@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Amina KHELLOUFI", poste: "Responsable marketing", mail: "marketing.r@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Khadidja AYACHE", poste: "Comptable", mail: "assistante.comptabilite@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Maroua ABDALLAH", poste: "Coordinatrice d'achat", mail: "assistance@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Meriem DJADI", poste: "Coordinatrice d'achat", mail: "supply.operations@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Meziane IGHEBRIOUENE", poste: "Directeur des Finances et de la Comptabilité", mail: "dfc@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Mohamed Sedik GUEMARI", poste: "Directeur Marketing", mail: "directeur.marketing@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Nabila HADDADI", poste: "Chef Produit", mail: "chef.produit@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Naima SAHABI", poste: "Coordinatrice d'achat", mail: "info@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Romaissa SALAKDJI", poste: "Coordinatrice d'achat", mail: "achat@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "Wafaa KHELLOUF", poste: "Responsable Service Achat", mail: "achat.manager@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "-", poste: "Infographe", mail: "designer@labo-nedjma.com", status: "Bloquée" },
    { unit: "Douera", name: "-", poste: "Infographe", mail: "infographe@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "-", poste: "Comptes Fournisseurs", mail: "gestion.fournisseur@labo-nedjma.com", status: "Active" },
    { unit: "Douera", name: "-", poste: "Comptable", mail: "comptabilite@labo-nedjma.com", status: "Active" },

    // El Oued Unit
    { unit: "El Oued", name: "Ilhem REZGUI", poste: "Contrôle de quality labo El Oued", mail: "eloued.laboratoire@labo-nedjma.com", status: "Active" },
    { unit: "El Oued", name: "Lamine BEN MOUSSA", poste: "Responsable Unité - El Oued", mail: "eloued.manager@labo-nedjma.com", status: "Active" },
    { unit: "El Oued", name: "Ramzi MADANI", poste: "Planificateur El Oued", mail: "planificateur.eloued@labo-nedjma.com", status: "Active" },
    { unit: "El Oued", name: "-", poste: "Secrétariat El Oued", mail: "eloued.assistante@labo-nedjma.com", status: "Active" },
    { unit: "El Oued", name: "-", poste: "Gestionnaire de stock El Oued", mail: "gestionnaire.eloued@labo-nedjma.com", status: "Active" },

    // Larbâa Unit
    { unit: "Larbâa", name: "Email Reclamation IT Support", poste: "Support IT", mail: "it.support@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Support Insidjam", poste: "Support Insidjam", mail: "support@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Hocine HABES", poste: "Superviseur Production", mail: "habes.hocine@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Faycel THAMER", poste: "superviseur des ventes", mail: "thamer.faycel@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Ressources Humaines", poste: "Ressources Humaines", mail: "ressources.humaines@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Youcef MERZOUK", poste: "Responsable technique", mail: "merzouk.youcef@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Responsable Stock", poste: "Responsable Stock", mail: "responsable.stock@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Abdeldjabar BASSI", poste: "Responsable Sécurité", mail: "bassi.abdeldjabar@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Responsable RH", poste: "Responsable RH", mail: "responsable.rh@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Nadia SEBBAGH", poste: "Responsable R & D", mail: "sebbagh.nadia@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Asma REGUIEG", poste: "Responsable Laboratoire", mail: "labo@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Asma REGUIEG", poste: "Responsable Laboratoire", mail: "reguieg.asma@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Nazim MOHAND SAID", poste: "Responsable IT / Admin Système & Réseaux", mail: "nazim.mohandsaid@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Responsable HSE", poste: "Responsable HSE", mail: "responsable.hse@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Oumeima SAFSAFI", poste: "Responsable Contrôle Qualité", mail: "safsafi.oumeima@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Recrutement", poste: "Recrutement", mail: "recrutement@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Ahlam HADRI", poste: "Planificatrice", mail: "hadri.ahlam@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Yousra AGGOUN", poste: "Microbiologiste - Contrôle de Qualité", mail: "aggoun.yousra@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Hicham GUEMARI", poste: "Manager", mail: "manager@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Abderrahmane BENAOUDA", poste: "Chargé de Paie", mail: "benaouda.abderrahmane@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Fouad BOUREKACHE", poste: "GDS", mail: "bourekache.fouad@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Billel BOURABA", poste: "IT Support", mail: "billel.bouraba@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Yousra AGGOUN", poste: "Microbiologiste - Contrôle de Qualité", mail: "labo-micro@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Meriem HAKEM", poste: "Ingénieur Préparation", mail: "hakem.meriem@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Nadia BENAMMAR", poste: "ingénieur génie procédés", mail: "benammar.nadia@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Contact", poste: "Contact", mail: "contact@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "GDS Larbâa", poste: "GDS Larbâa", mail: "gds.lrb@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Mohamed MEHIDI", poste: "GDS", mail: "mehidi.mohamed@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Directeur des Ressources Humaine", poste: "Directeur des Ressources Humaines", mail: "drh@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Abdelghani GHOMAID", poste: "Directeur de Production", mail: "d.production@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Liza IDRIS BEY", poste: "Développement", mail: "idrisbey.liza@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Nassim BENDAOUD", poste: "GDS Matière Première", mail: "bendaoud.nassim@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Lydia BRAIK", poste: "Développement", mail: "barik.lydia@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Abdelhakim MANSEUR", poste: "GDS", mail: "manseur.abdelhakim@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Samy BEY", poste: "Développement", mail: "bey.samy@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Développement", poste: "Développement", mail: "teams4-developpement@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Amel MEDINI", poste: "ASSISTANTE RH", mail: "medini.amel@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Bouchra AKDOUCHE", poste: "CONTROLE QUALITE (PHYSICO CHEMIE)", mail: "akdouche.bouchra@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Contrôle Qualité", poste: "Contrôle Qualité", mail: "controle.qualite@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Abdelhak DAAS", poste: "Control Qualité", mail: "daas.abdelhak@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Abderraouf DJAIDRI", poste: "Control Qualité", mail: "djaidri.abderraouf@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Khouloud AMRAR", poste: "Control qualité", mail: "amrar.khlouloud@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "grerifa boualem", poste: "GDS", mail: "grerifa.boualem@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "cheddik abdelhakim", poste: "GDS", mail: "cheddik.abdelhakim@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "ouldcherchali islem", poste: "GDS", mail: "ouldcherchali.islem@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Romaissa MANSOURI", poste: "CONTROL QUALITÉ", mail: "mansouri.romuissa@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Maataallah TAMRABET", poste: "commercial Gros Oran", mail: "tamrabet.maataallah@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Amina KHALFELLAH", poste: "Chef D'equipe", mail: "khalfellah.amina@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Thiziri AHADDAD", poste: "CHARGE DEVELOPEMENT RH", mail: "thiziri.ahaddad@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Chahira HARTANI", poste: "CHARGE ADMINISTRATIVE R & D", mail: "hartani.chahira@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Ouarda ARABI", poste: "Assistante administrative", mail: "arabi.ouarda@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Assistante de production", poste: "Assistante de production", mail: "production.assist@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Assistante de production", poste: "Assistante de production", mail: "production.assist2@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Assistante de production", poste: "Assistante de production", mail: "production.assist3@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Assistante de production", poste: "Assistante de production", mail: "production.assist4@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Assistante de production", poste: "Assistante de production", mail: "production.assist5@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Aicha MEZIANE", poste: "Assistante Administrative", mail: "meziane.aicha@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Mohamed TIROUDA", poste: "RES DÉV DES RESSOURCES HUMAINES", mail: "tirouda.mohamed@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Meroua GUELLIL", poste: "assistant production", mail: "guellil.meroua@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Khedoudja ABBAS", poste: "ASSISTANT MGX", mail: "abbas.khedoudja@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Assistant HSE", poste: "Assistant HSE", mail: "assistant.hse@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Assistant de planification", poste: "Assistant de planification", mail: "planification.assist@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Ahmed MEGHARBI", poste: "ANALYSTE PHYSICO CHIMIE", mail: "megharbi.ahmed@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Nadia HARRAG", poste: "ANALYSTE PHYSICO CHIMIE", mail: "harrag.nadia@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Abdeldjalil BENMOUSSA", poste: "Analyste", mail: "analyste@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Oussama MAGNOUCHE", poste: "Adjoint Directeur Général", mail: "oussama.magnouche@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Anfel KACI", poste: "Assistante de production", mail: "kaci.anfel@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Nadia BENAMMAR", poste: "Chimiste Préparation", mail: "labo-prepa@labo-nedjma.com", status: "Bloquée" },
    { unit: "Larbâa", name: "Nesrine BOURAS", poste: "Microbiologiste - Contrôle de Qualité", mail: "bouras.nesrine@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "HAMADACHE FATMAZOHRA", poste: "CONTROLEUR DE GESTION", mail: "hamadache.fatmazohra@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "BEDJAOUI MEHNIA", poste: "ANALYSTE DE PRODUCTION", mail: "bedjaoui.mehnia@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "BOUCHLOUKH ZAKARIA", poste: "ORDONONCEUR DE PRODUCTION", mail: "bouchloukh.zakaria@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "BOUACHA SABRINA", poste: "ASSISTANTE DE PRODUCTION", mail: "bouacha.sabrina@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "hechiche.lamia", poste: "Assistante administrative", mail: "hechiche.lamia@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "RAHLI BADREDDINE", poste: "HSE", mail: "rahali.badreddine@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "kaloune malek", poste: "HSE", mail: "kaloune.malek@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "amel sahraoui", poste: "chef de production", mail: "amel.sahraoui@labo-nedjma.com", status: "Active" },

    // Oued Smar Unit
    { unit: "Oued Smar", name: "Yasmine NOUASRI", poste: "assistant rh", mail: "nouasri.yasmine@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Faycel THAMER", poste: "superviseur des ventes alger", mail: "thamer.faycel@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "CHIBANI SOUMIA", poste: "Gestionnaire administratif et RH", mail: "chibani.soumia@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Abdenour OTMANI", poste: "Responsable du stock", mail: "otmani.abdennour@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Darine TERCHI", poste: "Administrateur des ventes", mail: "terchi.darinelilia@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Hania KHATIR", poste: "Administrateur des ventes", mail: "khatir.hania@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Houari MAHDJOUB", poste: "Responsable MGX", mail: "mahdjoub.houari@labo-nedjma.com", status: "Bloquée" },
    { unit: "Oued Smar", name: "Meriem BELAMINE", poste: "Assistante administrative", mail: "belamine.meriemimane@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Meriem MEHENNI", poste: "Responsable Facturation", mail: "mehenni.meriem@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Mouatez GUEMARI", poste: "Directeur Général", mail: "guemari.mouatez@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Mouna BOUDJELLAB", poste: "Responsable ADV", mail: "boudjellab.mouna@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Narimene BOUBEKEUR", poste: "analyste des ventes", mail: "boubekeur.narimene@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Reda DARRADJI", poste: "Caissier", mail: "daradji.reda@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Wissame TERCHI", poste: "Responsable service clientèle et export", mail: "terchi.wissem@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "-", poste: "Magasinier", mail: "magasinier.os@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "-", poste: "-", mail: "superviseur.vente.est3@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "BARECHE MOHAMED YACINE", poste: "Superviseur des vente tizi ouzou", mail: "bareche.yacine@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Manne walid", poste: "Regional sales Manager", mail: "maane.walid@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Meissoune HAMMANE", poste: "Responsable sales analyst", mail: "hammane.meissoune@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "BADREDDINE RANIA", poste: "Assistante Moyens Généraux de l'unité", mail: "badreddine.rania@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "BELAID Abdelmoumen", poste: "Régional Manager des Ventes - Région Est", mail: "abdelmoumen.belaid@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "abdelhak salem", poste: "GDS", mail: "abdelhak.salem@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "OULDSAAD MENAOUR", poste: "Chargé expedition", mail: "ouldsadsaoud.menouar@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "DJAMA ABDELGHANI", poste: "Chef de parc adjoint", mail: "djama.abdelghani@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Abdelkader BENAISSA", poste: "chef de zone extreme ouest", mail: "benaissa.abdelkader@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "ACHACHE SMAIL", poste: "Superviseur Est 1", mail: "superviseur.vente.est1@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Amine AITEUR", poste: "Superviseur Ouest", mail: "commercial.est@labo-nedjma.com", status: "Bloquée" },
    { unit: "Oued Smar", name: "Amir KERDJANI", poste: "Directeur des Ventes", mail: "kerdjani.amir@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Bilel DEHIRI", poste: "Superviseur Marchandiseur", mail: "dehiri.bilel@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Wahab BERMAD", poste: "Superviseur Centre 1/Analyste des ventes", mail: "bermad.wahab@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "KHELIFATI LOTFI", poste: "Superviseur Ouest 3", mail: "superviseur.zone-ouest3@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "ALI MOHAMED CHERIF", poste: "Superviseur Ouest 2", mail: "superviseur.zone-ouest2@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "HIMEUR ADEM", poste: "Superviseur Est 3", mail: "himeur.adem@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "BOUHADMA TOUFIK", poste: "Chef de Parc", mail: "bouhadma.toufik@labo-nedjma.com", status: "Bloquée" },

    // Rahmania Unit
    { unit: "Rahmania", name: "-", poste: "GDS", mail: "gds.rahmania@labo-nedjma.com", status: "Active" },

    // Autres Unités
    { unit: "Autres Unités", name: "-", poste: "-", mail: "boulahbal.imene@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "chef.parc@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "directeur.vente@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "djeddai.rayen@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "khelloufi.amina@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "r.service-client@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "responsable.a.c@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "responsable.facturation@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "teams1-developpement@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "teams2-developpement@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "teams3-developpement@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "tresorerie@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "khokhi.adel@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "rebaine.rafik@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "ammari.abderrahmane@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "-", poste: "-", mail: "fatmi.ibrahim@labo-nedjma.com", status: "Active" },
    { unit: "Oued Smar", name: "Amine AITEUR", poste: "Manager régional centre", mail: "aiteur.amine@labo-nedjma.com", status: "Active" },
    { unit: "Autres Unités", name: "LATAOUI ABDENNOUR", poste: "Superviseur des ventes - Centre", mail: "lataoui.abdennour@labo-nedjma.com", status: "Active" },
    { unit: "El Oued", name: "-", poste: "Assistante de production El Oued", mail: "eloued.production.assist@labo-nedjma.com", status: "Active" },
    { unit: "Larbâa", name: "Mebarek Mohamed Lotfi", poste: "GDS", mail: "mebarek.mohamedlotfi@labo-nedjma.com", status: "Active" },
];

// Data Sanitization: Remove names for blocked emails
companyEmails = companyEmails.map(e => {
    if (e.status === 'Bloquée') {
        return { ...e, name: "-" };
    }
    return e;
});

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

// Close modals when clicking outside
[profileModal, devModal, companyModal].forEach(modal => {
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
        emailList.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 20px;">Aucun email trouvé.</td></tr>`;
        renderPagination(emails.length, page);
        return;
    }

    paginatedEmails.forEach((item, i) => {
        const globalIndex = startIndex + i + 1;
        const statusClass = item.status === 'Bloquée' ? 'status-blocked' : 'status-active';
        const unitClass = getUnitClass(item.unit);

        const row = `
            <tr>
                <td style="font-weight: 700; color: #94a3b8;">${globalIndex}</td>
                <td><span class="unit-badge ${unitClass}">${item.unit}</span></td>
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
            </tr>
        `;
        emailList.innerHTML += row;
    });

    renderPagination(emails.length, page);
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
// RECENT EMAILS
// =============================================
function renderRecent(emails) {
    const container = document.getElementById('recentEmailsContainer');
    if (!container) return;
    container.innerHTML = '';
    const list = emails || companyEmails;
    const recent = [...list].reverse().slice(0, 6);

    recent.forEach(item => {
        container.innerHTML += `
            <div class="recent-item">
                <h4>${item.mail}</h4>
                <p>${item.poste}</p>
            </div>
        `;
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
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();

    // If not on directory page, navigate to it first
    const directoryPage = document.getElementById('pageDirectory');
    if (!directoryPage || !directoryPage.classList.contains('active')) {
        navigateTo('directory');
    }

    const filtered = companyEmails.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.mail.toLowerCase().includes(term) ||
        item.unit.toLowerCase().includes(term) ||
        item.poste.toLowerCase().includes(term) ||
        item.status.toLowerCase().includes(term)
    );
    renderEmails(filtered);
    renderRecent(filtered);
    updateDirectoryStats(filtered);
    applyDirectoryTheme(term);
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
    unitCardsGrid.innerHTML = '';
    const units = [...new Set(companyEmails.map(e => e.unit))];

    units.forEach(unit => {
        const unitEmails = companyEmails.filter(e => e.unit === unit);
        const active = unitEmails.filter(e => e.status === 'Active').length;
        const blocked = unitEmails.filter(e => e.status === 'Bloquée').length;
        const total = unitEmails.length;
        const percentage = Math.round((active / total) * 100);

        let boxClass = 'box-default';
        const u = unit.toLowerCase();
        if (u.includes('douera')) boxClass = 'box-douera';
        else if (u.includes('oued') && !u.includes('smar')) boxClass = 'box-el-oued';
        else if (u.includes('larb')) boxClass = 'box-larba';
        else if (u.includes('smar')) boxClass = 'box-oued-smar';
        else if (u.includes('rahman')) boxClass = 'box-rahmania';
        else if (u.includes('autre')) boxClass = 'box-autres';

        const colorMap = {
            'box-douera': 'var(--blue)',
            'box-el-oued': 'var(--orange)',
            'box-larba': 'var(--pink)',
            'box-oued-smar': 'var(--purple)',
            'box-rahmania': 'var(--cyan)',
            'box-autres': '#64748b'
        };
        const fillColor = colorMap[boxClass] || 'var(--primary)';

        const card = `
            <div class="unit-stat-card">
                <div class="unit-stat-header">
                    <div class="unit-icon-box ${boxClass}">
                        <i class="fas fa-building-user"></i>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="copy-unit-mini" onclick="copyUnitEmails('${unit}')" title="Copier les emails actifs">
                            <i class="fas fa-copy"></i>
                        </button>
                        <span class="unit-badge ${boxClass.replace('box-', 'unit-')}">${unit}</span>
                    </div>
                </div>
                <h3>${unit}</h3>
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
                    <div class="unit-progress-bg">
                        <div class="unit-progress-fill" style="width: ${percentage}%; background: ${fillColor};"></div>
                    </div>
                </div>
                <button class="view-unit-btn" onclick="viewUnitDetails('${unit}')">
                    <i class="fas fa-arrow-right" style="margin-right: 6px;"></i> Détails de l'unité
                </button>
            </div>
        `;
        unitCardsGrid.innerHTML += card;
    });
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

    // Initialize dashboard on load
    updateDashboardStats();
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

    form.addEventListener('submit', function (e) {
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

        // Ensure initialization
        if (typeof emailjs !== 'undefined') {
            emailjs.init("NZzp8VaAhdhkS_mlV");
        }

        // 3. Send via EmailJS
        emailjs.send('service_vjznpgi', 'template_648u6p9', templateParams)
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
    });
})();
