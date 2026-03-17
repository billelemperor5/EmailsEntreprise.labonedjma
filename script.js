// Initial Data based on the provided company directory
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
  { unit: "Larbâa", name: "Youcef MERZOUK", poste: "Responsable technique", mail: "merzouk.youcef@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Responsable Stock", poste: "Responsable Stock", mail: "responsable.stock@labo-nedjma.com", status: "Bloquée" },
  { unit: "Larbâa", name: "Abdeldjabar BASSI", poste: "Responsable Sécurité", mail: "bassi.abdeldjabar@labo-nedjma.com", status: "Bloquée" },
  { unit: "Larbâa", name: "Responsable RH", poste: "Responsable RH", mail: "responsable.rh@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Nadia SEBBAGH", poste: "Responsable R & D", mail: "sebbagh.nadia@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Asma REGUIEG", poste: "Responsable Laboratoire", mail: "labo@labo-nedjma.com", status: "Bloquée" },
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
  { unit: "Larbâa", name: "Yousra AGGOUN", poste: "Microbiologiste - Contrôle de Qualité", mail: "labo-micro@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Meriem HAKEM", poste: "Ingénieur Préparation", mail: "hakem.meriem@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Nadia BENAMMAR", poste: "ingénieur génie procédés", mail: "benammar.nadia@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Contact", poste: "Contact", mail: "contact@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "GDS Larbâa", poste: "GDS Larbâa", mail: "gds.lrb@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Mohamed MEHIDI", poste: "GDS", mail: "mehidi.mohamed@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Directeur des Ressources Humaine", poste: "Directeur des Ressources Humaines", mail: "drh@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Abdelghani GHOMAID", poste: "Directeur de Production", mail: "d.production@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Liza IDRIS BEY", poste: "Développement", mail: "idrisbey.liza@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Nassim BENDAOUD", poste: "GDS Matière Première", mail: "bendaoud.nassim@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Lydia BRAIK", poste: "Développement", mail: "barik.lydia@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Abdelhakim MANSEUR", poste: "GDS", mail: "manseur.abdelhakim@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Samy BEY", poste: "Développement", mail: "bey.samy@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Développement", poste: "Développement", mail: "teams4-developpement@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Amel MEDINI", poste: "ASSISTANTE RH", mail: "medini.amel@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Bouchra AKDOUCHE", poste: "CONTROLE QUALITE (PHYSICO CHEMIE)", mail: "akdouche.bouchra@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Contrôle Qualité", poste: "Contrôle Qualité", mail: "controle.qualite@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Abdelhak DAAS", poste: "Control Qualité", mail: "daas.abdelhak@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Abderraouf DJAIDRI", poste: "Control Qualité", mail: "djaidri.abderraouf@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Khouloud AMRAR", poste: "Control qualité", mail: "amrar.khouloud@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Romaissa MANSOURI", poste: "CONTROL QUALITÉ", mail: "mansouri.romuissa@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Maataallah TAMRABET", poste: "commercial Gros Oran", mail: "tamrabet.maataallah@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Amina KHALFELLAH", poste: "Chef D'equipe", mail: "khalfellah.amina@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Thiziri AHADDAD", poste: "CHARGE DEVELOPEMENT RH", mail: "thiziri.ahaddad@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Chahira HARTANI", poste: "CHARGE ADMINISTRATIVE R & D", mail: "hartani.chahira@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Ouarda ARABI", poste: "Assistante administrative", mail: "arabi.ouarda@labo-nedjma.com", status: "Bloquée" },
  { unit: "Larbâa", name: "Assistante de production", poste: "Assistante de production", mail: "production.assist@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Assistante de production", poste: "Assistante de production", mail: "production.assist2@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Assistante de production", poste: "Assistante de production", mail: "production.assist3@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Assistante de production", poste: "Assistante de production", mail: "production.assist4@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Assistante de production", poste: "Assistante de production", mail: "production.assist5@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Aicha MEZIANE", poste: "Assistante Administrative", mail: "meziane.aicha@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Mohamed TIROUDA", poste: "RES DÉV DES RESSOURCES HUMAINES", mail: "tirouda.mohamed@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Meroua GUELLIL", poste: "assistant production", mail: "guellil.meroua@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Khedoudja ABBAS", poste: "ASSISTANT MGX", mail: "abbas.khedoudja@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Assistant HSE", poste: "Assistant HSE", mail: "assistant.hse@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Assistant de planification", poste: "Assistant de planification", mail: "planification.assist@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Ahmed MEGHARBI", poste: "ANALYSTE PHYSICO CHIMIE", mail: "megharbi.ahmed@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Nadia HARRAG", poste: "ANALYSTE PHYSICO CHIMIE", mail: "harrag.nadia@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Abdeldjalil BENMOUSSA", poste: "Analyste", mail: "analyste@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Oussama MAGNOUCHE", poste: "Adjoint Directeur Général", mail: "oussama.magnouche@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Anfel KACI", poste: "Assistante de production", mail: "kaci.anfel@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Nadia BENAMMAR", poste: "Chimiste Préparation", mail: "labo-prepa@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "Nesrine BOURAS", poste: "CHEMISTE", mail: "bouras.nesrine@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "HAMADACHE FATMAZOHRA", poste: "CONTROLEUR DE GESTION", mail: "hamadache.fatmazohra@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "BEDJAOUI MEHNIA", poste: "ANALYSTE DE PRODUCTION", mail: "bedjaoui.mehnia@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "BOUCHLOUKH ZAKARIA", poste: "ORDONONCEUR DE PRODUCTION", mail: "bouchloukh.zakaria@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "BOUACHA SABRINA", poste: "ASSISTANTE DE PRODUCTION", mail: "bouacha.sabrina@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "hechiche.lamia", poste: "Assistante administrative", mail: "hechiche.lamia@labo-nedjma.com", status: "Active" },
  { unit: "Larbâa", name: "RAHLI BADREDDINE", poste: "HSE", mail: "rahali.badreddine@labo-nedjma.com", status: "Active" },

  // Oued Smar Unit
  { unit: "Oued Smar", name: "Yasmine NOUASRI", poste: "assistant rh", mail: "nouasri.yasmine@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Faycel THAMER", poste: "superviseur des ventes alger", mail: "thamer.faycel@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "CHIBANI SOUMIA", poste: "Gestionnaire administratif et RH", mail: "chibani.soumia@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Abdenour OTMANI", poste: "Responsable du stock", mail: "otmani.abdennour@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Darine TERCHI", poste: "Administrateur des ventes", mail: "terchi.darinelilia@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Hania KHATIR", poste: "Administrateur des ventes", mail: "khatir.hania@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Houari MAHDJOUB", poste: "Responsable MGX", mail: "mahdjoub.houari@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Meriem BELAMINE", poste: "Assistante administrative", mail: "belamine.meriemimane@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Meriem MEHENNI", poste: "Responsable Facturation", mail: "mehenni.meriem@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Mouatez GUEMARI", poste: "Directeur Général", mail: "guemari.mouatez@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Mouna BOUDJELLAB", poste: "Responsable ADV", mail: "boudjellab.mouna@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Narimene BOUBEKEUR", poste: "analyste des ventes", mail: "boubekeur.narimene@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Reda DARRADJI", poste: "Caissier", mail: "daradji.reda@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Wissame TERCHI", poste: "Responsable service clientèle et export", mail: "terchi.wissem@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "-", poste: "Magasinier", mail: "magasinier.os@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "BARECHE MOHAMED YACINE", poste: "Superviseur des vente tizi ouzou", mail: "bareche.yacine@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Manne walid", poste: "Regional sales Manager", mail: "maane.walid@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Meissoune HAMMANE", poste: "Responsable sales analyst", mail: "hammane.meissoune@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "BADREDDINE RANIA", poste: "Assistante Moyens Généraux de l'unité", mail: "badreddine.rania@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "BELAID Abdelmoumen", poste: "Régional Manager des Ventes - Région Est", mail: "abdelmoumen.belaid@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "abdelhak salem", poste: "GDS", mail: "abdelhak.salem@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "OULDSAAD MENAOUR", poste: "Chargé expedition", mail: "ouldsaadmenouar@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "DJAMA ABDELGHANI", poste: "Chef de parc adjoint", mail: "djama.abdelghani@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Abdelkader BENAISSA", poste: "chef de zone extreme ouest", mail: "benaissa.abdelkader@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "ACHACHE SMAIL", poste: "Superviseur Est 1", mail: "superviseur.vente.est1@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Amine AITEUR", poste: "Superviseur Ouest", mail: "commercial.est@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Amir KERDJANI", poste: "Directeur des Ventes", mail: "kerdjiani.amir@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Bilel DEHIRI", poste: "Superviseur Marchandiseur", mail: "dehiri.bilel@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "Wahab BERMAD", poste: "Superviseur Centre 1/Analyste des ventes", mail: "bermad.wahab@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "KHELIFATI LOTFI", poste: "Superviseur Ouest 3", mail: "superviseur.zone-ouest3@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "ALI MOHAMED CHERIF", poste: "Superviseur Ouest 2", mail: "superviseur.zone-ouest2@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "HIMEUR ADEM", poste: "Superviseur Est 3", mail: "himeur.adem@labo-nedjma.com", status: "Active" },
  { unit: "Oued Smar", name: "BOUHADMA TOUFIK", poste: "Chef de Parc", mail: "bouhadma.toufik@labo-nedjma.com", status: "Active" },

  // Rahmania Unit
  { unit: "Rahmania", name: "-", poste: "GDS", mail: "gds.rahmania@labo-nedjma.com", status: "Active" },
];

// Reference to elements
const emailList = document.getElementById('emailList');
const recentEmailsContainer = document.getElementById('recentEmailsContainer');
const searchInput = document.getElementById('searchInput');
const selectionScreen = document.getElementById('selectionScreen');
const mainDashboard = document.getElementById('mainDashboard');
const mainNav = document.getElementById('mainNav');
const backToHome = document.getElementById('backToHome');
const headerRight = document.getElementById('headerRight');
const copyActiveBtn = document.getElementById('copyActiveBtn');
const copyToast = document.getElementById('copyToast');
const copyCountEl = document.getElementById('copyCount');

const analyticsDashboard = document.getElementById('analyticsDashboard');
const unitCardsGrid = document.getElementById('unitCardsGrid');
const heroSection = document.getElementById('heroSection');
const dashboardContext = document.getElementById('dashboardContext');
const databaseDashboard = document.getElementById('databaseDashboard');
const archiveLog = document.getElementById('archiveLog');

const totalCountEl = document.getElementById('totalCount');
const activeCountEl = document.getElementById('activeCount');
const progressBar = document.getElementById('progressBar');

const infoBtn = document.getElementById('infoBtn');
const profileModal = document.getElementById('profileModal');
const closeModal = document.getElementById('closeModal');

// Navigation Function
function showDashboard(mode) {
  selectionScreen.classList.add('hidden');
  mainDashboard.classList.remove('hidden');
  mainNav.classList.remove('hidden');
  headerRight.classList.add('hidden');
  
  if (mode === 'directory') {
    searchInput.value = ''; // Clear search when entering full directory
    heroSection.classList.remove('hidden');
    document.querySelector('.app-container').classList.remove('hidden');
    analyticsDashboard.classList.add('hidden');
    databaseDashboard.classList.add('hidden');
    renderEmails(companyEmails);
  } else if (mode === 'stats') {
    heroSection.classList.add('hidden');
    document.querySelector('.app-container').classList.add('hidden');
    analyticsDashboard.classList.remove('hidden');
    databaseDashboard.classList.add('hidden');
    renderUnitStats();
  } else if (mode === 'database') {
    heroSection.classList.add('hidden');
    document.querySelector('.app-container').classList.add('hidden');
    analyticsDashboard.classList.add('hidden');
    databaseDashboard.classList.remove('hidden');
    renderArchiveLog();
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderRecent();
  updateStats();
}

backToHome.addEventListener('click', (e) => {
  e.preventDefault();
  selectionScreen.classList.remove('hidden');
  mainDashboard.classList.add('hidden');
  analyticsDashboard.classList.add('hidden');
  databaseDashboard.classList.add('hidden');
  mainNav.classList.add('hidden');
  headerRight.classList.remove('hidden');
});

// Function to render the main email table with new structure
function renderEmails(emails) {
  emailList.innerHTML = '';
  emails.forEach((item, index) => {
    let statusClass = 'badge-new'; // Default Active
    if (item.status === 'Bloquée') statusClass = 'badge-blocked';
    
    // Determine Unit Class
    let unitClass = 'unit-default';
    const unitName = item.unit.toLowerCase();
    if (unitName.includes('douera')) unitClass = 'unit-douera';
    else if (unitName.includes('oued') && !unitName.includes('smar')) unitClass = 'unit-el-oued';
    else if (unitName.includes('larb')) unitClass = 'unit-larba';
    else if (unitName.includes('smar')) unitClass = 'unit-oued-smar';
    else if (unitName.includes('rahman')) unitClass = 'unit-rahmania';

    const row = `
      <tr>
        <td style="font-weight: 600; color: var(--text-muted); opacity: 0.7;">${index + 1}</td>
        <td><span class="unit-badge ${unitClass}">${item.unit}</span></td>
        <td><strong>${item.name}</strong></td>
        <td>${item.poste}</td>
        <td style="color: var(--primary); font-weight: 600;">${item.mail}</td>
        <td><span class="email-badge ${statusClass}">${item.status}</span></td>
      </tr>
    `;
    emailList.innerHTML += row;
  });
}

// Function to render recent emails sidebar
function renderRecent(emails) {
  recentEmailsContainer.innerHTML = '';
  // Use the provided list (could be filtered) and take the last 5
  const listToRender = emails || companyEmails;
  const recentItems = [...listToRender].reverse().slice(0, 5);
  
  recentItems.forEach(item => {
    const recentCard = `
      <div class="recent-item">
        <div class="recent-info">
          <h4>${item.mail}</h4>
          <p>${item.poste}</p>
        </div>
      </div>
    `;
    recentEmailsContainer.innerHTML += recentCard;
  });
}

// Stats Update
function updateStats(emails) {
  const listToCalc = emails || companyEmails;
  const total = listToCalc.length;
  const actives = listToCalc.filter(e => e.status === 'Active').length;
  
  totalCountEl.innerText = total;
  activeCountEl.innerText = actives;
  
  const percentage = total > 0 ? (actives / total) * 100 : 0;
  progressBar.style.width = `${percentage}%`;
}

// Search Functionality
searchInput.addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = companyEmails.filter(item => 
    item.name.toLowerCase().includes(term) || 
    item.mail.toLowerCase().includes(term) ||
    item.unit.toLowerCase().includes(term) ||
    item.poste.toLowerCase().includes(term)
  );
  renderEmails(filtered);
  renderRecent(filtered);
  updateStats(filtered);
});

// Copy Active Emails Functionality
copyActiveBtn.addEventListener('click', () => {
    const term = searchInput.value.toLowerCase();
    
    // Filter by search term AND Active status
    const filteredActive = companyEmails
        .filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(term) || 
                               item.mail.toLowerCase().includes(term) ||
                               item.unit.toLowerCase().includes(term) ||
                               item.poste.toLowerCase().includes(term);
            return matchesSearch && item.status === 'Active';
        })
        .map(item => item.mail)
        .join('; ');

    if (filteredActive) {
        const count = filteredActive.split(';').length;
        // Fallback for non-secure contexts (like file://)
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(filteredActive).then(() => {
                showToast(count);
            }).catch(err => {
                copyFallback(filteredActive, count);
            });
        } else {
            copyFallback(filteredActive, count);
        }
    }
});

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


// Analytics Rendering
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
        let icon = 'fa-building-user'; // Unified professional corporate icon
        const u = unit.toLowerCase();
        
        if (u.includes('douera')) { boxClass = 'box-douera'; }
        else if (u.includes('oued') && !u.includes('smar')) { boxClass = 'box-el-oued'; }
        else if (u.includes('larb')) { boxClass = 'box-larba'; }
        else if (u.includes('smar')) { boxClass = 'box-oued-smar'; }
        else if (u.includes('rahman')) { boxClass = 'box-rahmania'; }

        const card = `
            <div class="unit-stat-card">
                <div class="unit-stat-header">
                    <div class="unit-icon-box ${boxClass}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <button class="copy-unit-mini" onclick="copyUnitEmails('${unit}')" title="Copier les emails actifs de cette unité">
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
                            <span style="color: #10b981; font-weight: 700;">${active}</span> / 
                            <span style="color: #ef4444; font-weight: 700;">${blocked}</span>
                        </span>
                    </div>
                    <div class="unit-progress-bg">
                        <div class="unit-progress-fill ${boxClass.replace('box-', 'unit-')}" style="width: ${percentage}%; background-color: currentColor;"></div>
                    </div>
                </div>
                <button class="view-unit-btn" onclick="viewUnitDetails('${unit}')">Détails de l'unité</button>
            </div>
        `;
        unitCardsGrid.innerHTML += card;
    });
}

function viewUnitDetails(unit) {
    showDashboard('directory');
    searchInput.value = unit;
    if (dashboardContext) {
        dashboardContext.innerText = `Affichage des emails pour l'unité : ${unit}`;
    }
    const event = new Event('input');
    searchInput.dispatchEvent(event);
}

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

// Database Functions
function renderArchiveLog() {
    if (!archiveLog) return;
    archiveLog.innerHTML = '';
    
    const logs = [
        { text: 'Optimisation de la base de données Douera', date: '17 - 03 - 2026' },
        { text: 'Mise à jour des protocoles SMTP Outlook', date: '17 - 03 - 2026' },
        { text: 'Synchronisation Master Data (126 entrées)', date: '16 - 03 - 2026' },
        { text: 'Nettoyage des emails bloqués (Unit: Larbâa)', date: '16 - 03 - 2026' },
        { text: 'Sauvegarde automatique réussie', date: '15 - 03 - 2026' }
    ];

    logs.forEach(log => {
        const item = `
            <div class="archive-item">
                <span class="archive-text">${log.text}</span>
                <span class="archive-date">${log.date}</span>
            </div>
        `;
        archiveLog.innerHTML += item;
    });
}

function exportToExcel() {
    // Generate CSV content (Excel compatible with BOM for proper accents)
    let csv = '\uFEFF'; 
    csv += 'N°;UNITE;NOM ET PRENOM;POSTE;ADRESSE EMAIL;STATUT\n';
    
    companyEmails.forEach((e, index) => {
        // Cleaning potential semicolons in data to prevent CSV corruption
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
    
    // Show success toast for export
    showToast(companyEmails.length);
}

document.addEventListener('DOMContentLoaded', () => {
    // Info Modal Toggle
    if (infoBtn && profileModal && closeModal) {
        infoBtn.addEventListener('click', () => {
            profileModal.classList.add('show');
        });

        closeModal.addEventListener('click', () => {
            profileModal.classList.remove('show');
        });

        // Close on outside click
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                profileModal.classList.remove('show');
            }
        });
    }
});
