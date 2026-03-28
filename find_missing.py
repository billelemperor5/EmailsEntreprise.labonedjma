import re

with open("c:\\Users\\bille\\Desktop\\system email\\system email\\script.js", "r", encoding="utf-8") as f:
    js_content = f.read()

# I will parse existing
existing_emails = re.findall(r'mail:\s*"([^"]+)"', js_content)
existing_emails = set([e.strip().lower() for e in existing_emails])

prompt_list = """
abdelhak.salem@labo-nedjma.com
abdelmoumen.belaid@labo-nedjma.com
achat.manager@labo-nedjma.com
achat@labo-nedjma.com
aggoun.yousra@labo-nedjma.com
akdouche.bouchra@labo-nedjma.com
amrar.khlouloud@labo-nedjma.com
assistance@labo-nedjma.com
assistante.comptabilite@labo-nedjma.com
badreddine.rania@labo-nedjma.com
bareche.yacine@labo-nedjma.com
barik.lydia@labo-nedjma.com
bedjaoui.mehnia@labo-nedjma.com
belamine.meriemimane@labo-nedjma.com
benaissa.abdelkader@labo-nedjma.com
benammar.nadia@labo-nedjma.com
benaouda.abderrahmane@labo-nedjma.com
bendaoud.nassim@labo-nedjma.com
bermad.wahab@labo-nedjma.com
bey.samy@labo-nedjma.com
billel.bouraba@labo-nedjma.com
bouacha.sabrina@labo-nedjma.com
boubekeur.narimene@labo-nedjma.com
bouchloukh.zakaria@labo-nedjma.com
boudjellab.mouna@labo-nedjma.com
boulahbal.imene@labo-nedjma.com
bouras.nesrine@labo-nedjma.com
bourekache.fouad@labo-nedjma.com
cheddik.abdelhakim@labo-nedjma.com
chef.parc@labo-nedjma.com
chef.produit@labo-nedjma.com
chibani.soumia@labo-nedjma.com
commercial.est@labo-nedjma.com
comptabilite@labo-nedjma.com
contact@labo-nedjma.com
controle.qualite@labo-nedjma.com
d.production@labo-nedjma.com
daas.abdelhak@labo-nedjma.com
daradji.reda@labo-nedjma.com
dehiri.bilel@labo-nedjma.com
dfc@labo-nedjma.com
directeur.marketing@labo-nedjma.com
directeur.vente@labo-nedjma.com
djaidri.abderraouf@labo-nedjma.com
djama.abdelghani@labo-nedjma.com
djeddai.rayen@labo-nedjma.com
drh@labo-nedjma.com
eloued.assistante@labo-nedjma.com
eloued.laboratoire@labo-nedjma.com
eloued.manager@labo-nedjma.com
gds.rahmania@labo-nedjma.com
gestion.fournisseur@labo-nedjma.com
gestionnaire.eloued@labo-nedjma.com
grerifa.boualem@labo-nedjma.com
guellil.meroua@labo-nedjma.com
guemari.mouatez@labo-nedjma.com
habes.hocine@labo-nedjma.com
hadri.ahlam@labo-nedjma.com
hakem.meriem@labo-nedjma.com
hamadache.fatmazohra@labo-nedjma.com
hammane.meissoune@labo-nedjma.com
harrag.nadia@labo-nedjma.com
hartani.chahira@labo-nedjma.com
hechiche.lamia@labo-nedjma.com
himeur.adem@labo-nedjma.com
idrisbey.liza@labo-nedjma.com
info@labo-nedjma.com
infographe@labo-nedjma.com
kaci.anfel@labo-nedjma.com
kaloune.malek@labo-nedjma.com
kerdjani.amir@labo-nedjma.com
khalfellah.amina@labo-nedjma.com
khatir.hania@labo-nedjma.com
khelloufi.amina@labo-nedjma.com
maane.walid@labo-nedjma.com
magasinier.os@labo-nedjma.com
mahdjoub.houari@labo-nedjma.com
manseur.abdelhakim@labo-nedjma.com
mansouri.romuissa@labo-nedjma.com
marketing.r@labo-nedjma.com
medini.amel@labo-nedjma.com
megharbi.ahmed@labo-nedjma.com
mehenni.meriem@labo-nedjma.com
mehidi.mohamed@labo-nedjma.com
meziane.aicha@labo-nedjma.com
nouasri.yasmine@labo-nedjma.com
otmani.abdennour@labo-nedjma.com
ouldcherchali.islem@labo-nedjma.com
ouldsadsaoud.menouar@labo-nedjma.com
oussama.magnouche@labo-nedjma.com
planificateur.eloued@labo-nedjma.com
r.service-client@labo-nedjma.com
rahali.badreddine@labo-nedjma.com
recrutement@labo-nedjma.com
reguieg.asma@labo-nedjma.com
responsable.a.c@labo-nedjma.com
responsable.facturation@labo-nedjma.com
ressources.humaines@labo-nedjma.com
safsafi.oumeima@labo-nedjma.com
sebbagh.nadia@labo-nedjma.com
secretariat@labo-nedjma.com
superviseur.vente.est1@labo-nedjma.com
superviseur.vente.est3@labo-nedjma.com
superviseur.zone-ouest2@labo-nedjma.com
superviseur.zone-ouest3@labo-nedjma.com
supply.logistics@labo-nedjma.com
supply.operations@labo-nedjma.com
support@labo-nedjma.com
tamrabet.maataallah@labo-nedjma.com
teams1-developpement@labo-nedjma.com
teams2-developpement@labo-nedjma.com
teams3-developpement@labo-nedjma.com
teams4-developpement@labo-nedjma.com
terchi.darinelilia@labo-nedjma.com
terchi.wissem@labo-nedjma.com
thamer.faycel@labo-nedjma.com
thiziri.ahaddad@labo-nedjma.com
tirouda.mohamed@labo-nedjma.com
tresorerie@labo-nedjma.com
khokhi.adel@labo-nedjma.com
rebaine.rafik@labo-nedjma.com
"""

missing_emails = []
for line in prompt_list.strip().split("\n"):
    em = line.strip().lower()
    if em and em not in existing_emails:
        missing_emails.append(em)

out = ""
for em in missing_emails:
    out += f'    {{ unit: "Autres Unités", name: "-", poste: "-", mail: "{em}", status: "Active" }},\n'

with open("c:\\Users\\bille\\Desktop\\system email\\system email\\missing.txt", "w", encoding="utf-8") as f:
    f.write(out)
