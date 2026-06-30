import React, { useState, useEffect } from 'react';
import { User, AICSApplication, AssistanceType } from '../types/types';
import { servicesData } from '../data/servicesData';
import PortalHeader from '../components/PortalHeader';
import ServiceCard from '../components/ServiceCard';
import AuthModal from '../components/AuthModal';
import AICSApplicationForm from '../components/AICSApplicationForm';
import ApplicationTracker from '../components/ApplicationTracker';
import { 
  Landmark, Activity, Award, Users, HeartHandshake, LogIn, LogOut, 
  User as UserIcon, ClipboardList, CheckCircle2, ShieldAlert, ChevronRight, 
  Info, Sparkles, MessageSquare, ArrowRight, BookOpen, ChevronDown, Phone, Mail, Clock,
  Menu, X
} from 'lucide-react';
import LucideIcon from '../components/LucideIcon';
import { supabase } from '../lib/supabase';
// Multi-language Translation Dictionary
const translations = {
  en: {
    home: "Home",
    welfareServices: "Welfare Services",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    applyAics: "Apply for AICS",
    myApplications: "My Applications",
    signIn: "Sign In",
    createAccount: "Create Account",
    signOut: "Sign Out",
    welcomeTitle: "Municipal Social Welfare & Development Office",
    welcomeSubtitle: "Serving the People of Tubungan with Compassion, Integrity, and Excellence",
    programs: "Programs",
    applications: "Applications",
    changeLanguage: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    qualificationsHeader: "Qualifications & Document Checklists",
    qualificationsSub: "Official guidelines, eligibility standards, and mandatory document checklists for Tubungan Social Programs.",
    onlyAicsOnline: "Only AICS is Online",
    onlyAicsOnlineDesc: "Please note that while qualifications for all 4 major services are listed here, only AICS applications are processed directly through this online portal. All other registrations must be completed physically at the Tubungan MSWDO office.",
    applyOnlineNow: "Apply Online Now",
    programOverview: "Program Overview",
    whoIsQualified: "Who is Qualified (Eligibility Standards)",
    mandatoryDocs: "Mandatory Supporting Documents",
    mandatoryDocsDesc: "Please prepare the following requirements. If applying for AICS online, you must upload high-quality photos or PDF files of these documents.",
    stepByStepTitle: "Step-by-Step Application Guide",
    benefitsTitle: "Privileges, Benefits & Discounts",
    processingInfo: "Processing Timeline & Office Location",
    processingTimeLabel: "Estimated Processing Time:",
    locationLabel: "Office Location:",
    contactLabel: "Contact Officer:",
    aboutTitle: "About MSWDO Tubungan",
    aboutSub: "Learn about the Municipal Social Welfare and Development Office of Tubungan, Iloilo, and our commitment to public welfare.",
    ourMissionMandate: "Our Mission & Mandate",
    ourVision: "Our Vision",
    ourMission: "Our Mission",
    ourVisionDesc: "We envision Tubungan as a self-reliant, secure, and empowered community where poor, vulnerable, and disadvantaged individuals, families, and sectors are provided with social protection and opportunities to achieve a better quality of life.",
    ourMissionDesc: "To provide immediate social protection and welfare services to Tubungan residents, promoting social integration, capacity building, and livelihood opportunities for senior citizens, solo parents, persons with disabilities, and families in crisis.",
    governanceMandate: "Governance & Mandate",
    governanceDesc: "MSWDO Tubungan operates in accordance with the Local Government Code of 1991 (RA 7160) and national welfare guidelines issued by the Department of Social Welfare and Development (DSWD). We serve as the frontline social protection office, managing local budget allocations, emergency response funding, and social pensions.",
    dataPrivacy: "Data Privacy Protected",
    emergencyCoord: "Emergency Coordination",
    directAssistance: "Direct Municipal Assistance",
    contactTitle: "Contact Tubungan MSWDO",
    contactSub: "If you have immediate questions regarding qualifications or are experiencing a severe social crisis, contact our desk or visit the Municipal Hall.",
    officeInfo: "Office Information",
    mainOfficeAddress: "Main Office Address",
    addressDesc: "Municipal Hall Compound, Poblacion, Tubungan, Iloilo, Philippines 5027",
    officeHours: "Office Hours",
    hoursDesc: "Monday to Friday, 8:00 AM - 5:00 PM (except holidays)",
    directHotlines: "Direct Contact Hotlines",
    electronicMail: "Electronic Support Mail",
    walkInReminder: "* Walk-In Reminder: Physical filing of requirements and card registration processes are available daily during standard office hours.",
    googleMapTitle: "Google Map Location - Tubungan, Iloilo",
  },
  fil: {
    home: "Home",
    welfareServices: "Serbisyong Panlipunan",
    aboutUs: "Tungkol sa Amin",
    contactUs: "Makipag-ugnayan",
    applyAics: "Mag-apply sa AICS",
    myApplications: "Aking mga Dokumento",
    signIn: "Mag-sign In",
    createAccount: "Gumawa ng Account",
    signOut: "Mag-log Out",
    welcomeTitle: "Tanggapan ng Kagalingan at Pagpapaunlad Panlipunan",
    welcomeSubtitle: "Naglilingkod sa Mamamayan ng Tubungan nang may Malasakit, Integridad, at Kahusayan",
    programs: "Mga Programa",
    applications: "Mga Aplikasyon",
    changeLanguage: "Wika",
    theme: "Tema",
    light: "Maliwanag",
    dark: "Madilim",
    qualificationsHeader: "Mga Kwalipikasyon at Listahan ng mga Dokumento",
    qualificationsSub: "Opisyal na patnubay, pamantayan sa pagiging karapat-dapat, at mga listahan ng dokumento para sa mga Programa ng Tubungan.",
    onlyAicsOnline: "Tanging AICS Lamang ang Online",
    onlyAicsOnlineDesc: "Mangyaring tandaan na habang ang mga kwalipikasyon para sa lahat ng 4 na pangunahing serbisyo ay nakalista rito, tanging ang mga aplikasyon ng AICS ang maaaring iproseso online. Ang iba pang mga rehistrasyon ay dapat gawin nang personal sa tanggapan ng Tubungan MSWDO.",
    applyOnlineNow: "Mag-apply Online Ngayon",
    programOverview: "Pangkalahatang Tanaw ng Programa",
    whoIsQualified: "Sino ang Karapat-dapat (Mga Pamantayan)",
    mandatoryDocs: "Mga Kinakailangang Dokumento",
    mandatoryDocsDesc: "Mangyaring ihanda ang mga sumusunod na kinakailangan. Kung mag-aapply para sa AICS online, dapat mag-upload ng malinaw na larawan o PDF ng mga dokumentong ito.",
    stepByStepTitle: "Hakbang-hakbang na Gabay sa Aplikasyon",
    benefitsTitle: "Mga Pribilehiyo, Benepisyo at Diskwento",
    processingInfo: "Oras ng Pagproseso at Lokasyon ng Tanggapan",
    processingTimeLabel: "Tinatayang Oras ng Pagproseso:",
    locationLabel: "Lokasyon ng Tanggapan:",
    contactLabel: "Opisyal na Kontakin:",
    aboutTitle: "Tungkol sa MSWDO Tubungan",
    aboutSub: "Alamin ang tungkol sa Tanggapan ng Kagalingan at Pagpapaunlad Panlipunan ng Tubungan, Iloilo, at ang aming dedikasyon sa kapakanan ng publiko.",
    ourMissionMandate: "Ang Aming Misyon at Mandato",
    ourVision: "Ang Aming Pananaw",
    ourMission: "Ang Aming Misyon",
    ourVisionDesc: "Pinapangarap namin ang Tubungan bilang isang may sariling kakayahan, ligtas, at pinalakas na pamayanan kung saan ang mga mahihirap, mahihina, at disadvantaged na indibidwal, pamilya, at sektor ay binibigyan ng proteksyong panlipunan at mga pagkakataon upang makamit ang mas magandang kalidad ng buhay.",
    ourMissionDesc: "Magbigay ng mabilis na proteksyong panlipunan at serbisyong kapakanan sa mga residente ng Tubungan, na nagtataguyod ng integrasyong panlipunan, pagbuo ng kapasidad, at mga pagkakataon sa pangkabuhayan para sa mga senior citizen, solo parent, mga taong may kapansanan, at mga pamilyang nasa krisis.",
    governanceMandate: "Pamamahala at Mandato",
    governanceDesc: "Ang MSWDO Tubungan ay gumagana alinsunod sa Local Government Code ng 1991 (RA 7160) at pambansang mga alituntunin sa kapakanan na inisyu ng Kagawaran ng Kagalingang Panlipunan at Pagpapaunlad (DSWD). Nagsisilbi kaming frontline na tanggapan ng proteksyon, na namamahala sa mga lokal na alokasyon ng badyet, emergency response funding, at social pension.",
    dataPrivacy: "Protektado ang Pribadong Datos",
    emergencyCoord: "Koordinasyon sa Emerhensya",
    directAssistance: "Direktang Tulong ng Munisipyo",
    contactTitle: "Makipag-ugnayan sa Tubungan MSWDO",
    contactSub: "Kung mayroon kayong agarang katanungan tungkol sa kwalipikasyon o nakakaranas ng matinding krisis, makipag-ugnayan sa amin o bumisita sa Municipal Hall.",
    officeInfo: "Impormasyon ng Tanggapan",
    mainOfficeAddress: "Address ng Pangunahing Tanggapan",
    addressDesc: "Municipal Hall Compound, Poblacion, Tubungan, Iloilo, Philippines 5027",
    officeHours: "Oras ng Tanggapan",
    hoursDesc: "Lunes hanggang Biyernes, 8:00 AM - 5:00 PM (maliban sa mga holiday)",
    directHotlines: "Direktang Linya ng Kontak",
    electronicMail: "Sulat Suporta sa Elektroniko",
    walkInReminder: "* Paalala para sa mga Lumalapit: Ang pisikal na paghahain ng mga kinakailangan at proseso ng pagpaparehistro ng card ay magagamit araw-araw sa karaniwang oras ng opisina.",
    googleMapTitle: "Lokasyon sa Google Map - Tubungan, Iloilo",
  }
};

// Rich, Unified Dictionary for Social Welfare Program Cards in English and Filipino
const PROGRAMS_DETAIL_TRANSLATIONS = {
  en: {
    aics: {
      tag: "MUNICIPAL EMERGENCY FUND",
      title: "Assistance to Individuals in Crisis Situations (AICS)",
      law: "MUNICIPAL EMERGENCY FUND",
      overview: "The Assistance to Individuals in Crisis Situations (AICS) serves as a vital social safety net for Tubungan families experiencing unexpected extreme hardships. MSWDO provides localized financial subsidies, guarantee letters, or direct emergency releases to mitigate crises including critical illnesses, unexpected deaths, stranded travel, severe malnutrition, or extreme indigency.",
      eligibility: [
        "Any resident of Tubungan, Iloilo experiencing an active crisis or emergency situation.",
        "Indigent families lacking regular household income or below the municipal poverty line.",
        "Patients undergoing expensive ongoing medical procedures (chemotherapy, dialysis, major surgeries).",
        "Families who lost a primary breadwinner or need immediate coffin/funeral subsidy support.",
        "Students from low-income homes seeking one-time school support to prevent dropping out.",
        "Stranded individuals in the municipality seeking local repatriation transportation."
      ],
      requirements: [
        "Certificate of Indigency issued by your respective Barangay Captain.",
        "Valid Government Issued ID of the applicant (original and photocopy).",
        "For Medical Help: Official Clinical Summary, Doctor's Prescription, and Hospital Bill Statement.",
        "For Funeral Help: Registered Death Certificate and Funeral Contract Statement.",
        "For Educational Help: Valid Student ID and Certificate of Enrollment/Registration.",
        "For Transportation Help: Police Clearance or Barangay Certificate of Stranded Status."
      ],
      benefits: [
        { title: "Medical Assistance", desc: "Vouchers, financial release, or Guarantee Letters for hospitals and pharmacies." },
        { title: "Funeral Subsidies", desc: "Direct support to cover casket, burial plot, and transport services for deceased loved ones." },
        { title: "Educational Subsidy", desc: "Subsidies of ₱3,000 to ₱10,000 to assist underprivileged students during emergencies." }
      ],
      steps: [
        { step: "01", title: "Submit Form", desc: "Submit details online via this portal or physically at MSWDO." },
        { step: "02", title: "Verification", desc: "Caseworkers inspect and confirm submitted papers." },
        { step: "03", title: "Interview", desc: "Undergo a profiling session with a Social Worker." },
        { step: "04", title: "Mayor Approval", desc: "Document undergoes Municipal approval routing." },
        { step: "05", title: "Fund Payout", desc: "Cash or Guarantee Letter release in 1-3 days." }
      ],
      processing: "1 to 3 Working Days",
      location: "1st Floor, Tubungan Municipal Hall",
      contact: "Head Casework Officer"
    },
    pwd: {
      tag: "REPUBLIC ACT 10754",
      title: "Persons with Disability (PWD) Welfare & ID Registration",
      law: "REPUBLIC ACT 10754",
      overview: "MSWDO Tubungan maintains the localized registry of Persons with Disabilities to enforce compliance with Republic Act 10754. Registered PWDs are supplied with the physical National PWD Identification Card, drug and purchase booklets, and customized local interventions like physical rehabilitation support and technical aid tools.",
      eligibility: [
        "Philippine citizens residing in Tubungan with a medically certified long-term impairment.",
        "Individuals with visible physical impairments (amputees, orthopedic difficulties).",
        "Persons with invisible impairments (learning disabilities, speech disorders, severe autism).",
        "Citizens with chronic medical diseases leading to permanent functional limitation.",
        "Blind or low-vision residents, and deaf or hard-of-hearing individuals."
      ],
      requirements: [
        "Official DOH PWD Registry Form (available at MSWDO desk).",
        "Comprehensive Clinical Certificate from a licensed physician classifying the disability.",
        "Two (2) pieces recent 1x1 size ID photos with name tag.",
        "Barangay Residency Certificate proving current home stay in Tubungan.",
        "Birth Certificate photocopy or any valid national identification document."
      ],
      benefits: [
        { title: "20% Discount", desc: "On essential medicines, clinic fees, diagnostic tests, hotel rooms, and dining." },
        { title: "VAT Exemption", desc: "Exemption from the 12% Value Added Tax on key services and medication purchase." },
        { title: "Grocery Subsidy", desc: "Special 5% discount on weekly prime groceries and raw home necessities." },
        { title: "Assistive Devices", desc: "Access to free wheelchairs, custom crutches, and hearing aid distributions." }
      ],
      steps: [
        { step: "01", title: "Medical Check", desc: "Obtain clinical classification certifying physical/mental impairment." },
        { step: "02", title: "Form Filing", desc: "Visit MSWDO and fill out the national DOH PWD registry form." },
        { step: "03", title: "Validation", desc: "MSWDO health desk validates certificates with physician records." },
        { step: "04", title: "DOH Encoding", desc: "Data encoded into national PWD systems for authorization." },
        { step: "05", title: "ID Release", desc: "Get national PWD card and booklets in 2-4 working days." }
      ],
      processing: "2 to 4 Working Days",
      location: "MSWDO PWD Desk, Tubungan Hall",
      contact: "Municipal PWD Officer"
    },
    senior: {
      tag: "REPUBLIC ACT 9994",
      title: "Elderly Welfare Services & OSCA Registration",
      law: "REPUBLIC ACT 9994",
      overview: "The Office of the Senior Citizens Affairs (OSCA) is hosted under MSWDO Tubungan in compliance with the Expanded Senior Citizens Act of 2010 (RA 9994). We issue the Senior Citizen ID card, maintain local records of indigent elders to facilitate social pensions, and direct centenarian incentives alongside municipal cultural services.",
      eligibility: [
        "Any resident of Tubungan, Iloilo who has reached sixty (60) years of age.",
        "Indigent seniors lacking support from children or a stable retirement pension.",
        "Older residents who need a physical ID and purchase booklet to claim legal discounts.",
        "Elders reaching ninety (90) or one hundred (100) years old for cash bonus incentives."
      ],
      requirements: [
        "Birth Certificate photocopy or other official age proof (SSS/GSIS ID, Baptismal Cert).",
        "Barangay Certificate confirming at least six (6) months of stay in Tubungan.",
        "Two (2) recent 1x1 size ID photos with white background.",
        "For Social Pension: Social Case Study profiling report compiled by your Barangay leader."
      ],
      benefits: [
        { title: "20% National Discount", desc: "Exempt from 12% VAT and granted 20% discount on pharmacies, hospital clinics, and transport." },
        { title: "Social Pension", desc: "Eligible indigent elders receive a monthly stipend of ₱1,000, distributed quarterly." },
        { title: "Utility discounts", desc: "5% discount on home electricity and water bills registered under the senior's name." },
        { title: "Centenarian Gift", desc: "₱100,000 cash grant reward upon reaching age 100, with local honors." }
      ],
      steps: [
        { step: "01", title: "Age Validation", desc: "Collect birth certificate or equivalent public record proving age." },
        { step: "02", title: "Apply at OSCA", desc: "Visit OSCA Desk inside Tubungan Municipal Hall and request form." },
        { step: "03", title: "Residency Check", desc: "Submit Barangay residency paper proving continuous home stay." },
        { step: "04", title: "Review & Sign", desc: "OSCA Chapter President registers and endorses your file." },
        { step: "05", title: "ID Pick up", desc: "Release of National Senior ID booklet in 1-2 working days." }
      ],
      processing: "1 to 2 Working Days",
      location: "OSCA Desk, Tubungan Municipal Hall",
      contact: "Head of OSCA Secretariat"
    },
    "solo-parent": {
      tag: "REPUBLIC ACT 11861",
      title: "Solo Parents Welfare Services & ID Issuance",
      law: "REPUBLIC ACT 11861",
      overview: "To safeguard solo parent households, MSWDO Tubungan facilitates registration and benefits issuance under Republic Act 11861 (Expanded Solo Parents Welfare Act). Solo Parents are granted a physical ID card which unlocks discounts on baby supplies, paid leaves, and localized scholarship slots for children.",
      eligibility: [
        "Single mothers or fathers carrying solo parental responsibilities due to death of spouse.",
        "Parents raising children alone because of legal separation or spouse abandonment for 6+ months.",
        "Any relative or guardian rearing a child left behind due to parent physical absence/imprisonment.",
        "Low-income solo parents earning below ₱250,000 annually for additional cash subsidies."
      ],
      requirements: [
        "Barangay Solo Parent Certificate stating single parenting status for at least 6 months.",
        "Photocopies of children's Birth Certificates proving dependency under 18.",
        "Proof of single parenthood status (Spouse Death Certificate, or Legal Separation decree).",
        "Income Tax Return (ITR) or BIR Indigency stating monthly household salary.",
        "Two (2) recent 1x1 ID photos with signature of parent."
      ],
      benefits: [
        { title: "10% Baby Discount", desc: "Exempt from VAT and granted 10% discount on baby milk, food, medicine, and diapers (for kids under 6)." },
        { title: "7 Days Paid Leave", desc: "7 days of fully-paid annual parental leave, extra to regular employee leave allotments." },
        { title: "Monthly Cash Subsidy", desc: "Eligible low-income solo parents receive ₱1,000 monthly cash grant from the municipal budget." },
        { title: "TESDA Scholarships", desc: "Priority enrollment slots for educational livelihood and skill training programs." }
      ],
      steps: [
        { step: "01", title: "Barangay Check", desc: "Obtain Barangay Captain's Solo Parent certification of 6-month status." },
        { step: "02", title: "Gather Records", desc: "Organize kids' birth records and spouse-absence proofs." },
        { step: "03", title: "Desk Filing", desc: "Submit all documents to the MSWDO Solo Parent desk worker." },
        { step: "04", title: "Case Interview", desc: "Undergo brief caseworker evaluation interview at the hall." },
        { step: "05", title: "ID Issuance", desc: "Collect physical Solo Parent National ID in 3-5 working days." }
      ],
      processing: "3 to 5 Working Days",
      location: "MSWDO Desk, Tubungan Municipal Hall",
      contact: "Solo Parent Roster Officer"
    }
  },
  fil: {
    aics: {
      tag: "PONDO NG EMERHENSYA NG MUNISIPYO",
      title: "Tulong sa mga Indibidwal sa Sitwasyon ng Krisis (AICS)",
      law: "MUNICIPAL EMERGENCY FUND",
      overview: "Ang Assistance to Individuals in Crisis Situations (AICS) ay isang mahalagang social safety net para sa mga pamilya sa Tubungan na nakararanas ng hindi inaasahang matinding kahirapan. Ang MSWDO ay nagbibigay ng pinansyal na tulong, mga garantiya (guarantee letters), o direktang emerhensiyang tulong upang maibsan ang krisis tulad ng malubhang sakit, hindi inaasahang pagkamatay, pagka-stranded, matinding malnutrisyon, o lubos na kahirapan.",
      eligibility: [
        "Sinumang residente ng Tubungan, Iloilo na nakakaranas ng aktibong krisis o kagipitan.",
        "Mga pamilyang naghihikahos na walang regular na kita o nasa ibaba ng poverty line ng munisipyo.",
        "Mga pasyenteng sumasailalim sa magastos na medikal na gamutan (chemotherapy, dialysis, operasyon).",
        "Mga pamilyang nawalan ng pangunahing naghahanapbuhay o nangangailangan ng abuloy sa libing.",
        "Mga mag-aaral mula sa pamilyang may mababang kita na nangangailangan ng tulong pinansyal para sa eskwela.",
        "Mga stranded na indibidwal sa munisipyo na humihingi ng tulong para sa pamasahe pauwi."
      ],
      requirements: [
        "Sertipiko ng Indigency na inisyu ng inyong Barangay Captain.",
        "Katibayan ng Pagkakakilanlan (Valid Government ID) ng aplikante (orihinal at kopya).",
        "Para sa Tulong Medikal: Opisyal na Clinical Summary, Reseta ng Doktor, at Hospital Bill Statement.",
        "Para sa Tulong sa Libing: Rehistradong Death Certificate at Kontrata sa Serbisyo ng Libing.",
        "Para sa Tulong sa Edukasyon: Valid Student ID at Sertipiko ng Pagpapatala/Enrolment.",
        "Para sa Tulong sa Transportasyon: Police Clearance o Barangay Certificate para sa mga stranded."
      ],
      benefits: [
        { title: "Tulong Medikal", desc: "Mga voucher, tulong pinansyal, o Guarantee Letters para sa mga ospital at botika." },
        { title: "Tulong sa Libing", desc: "Direktang tulong para sa kabaong, lote sa sementeryo, at serbisyong transportasyon ng yumao." },
        { title: "Tulong sa Edukasyon", desc: "Tulong na ₱3,000 hanggang ₱10,000 para sa mga mag-aaral na nagigipit sa panahon ng kagipitan." }
      ],
      steps: [
        { step: "01", title: "Isumite ang Form", desc: "Isumite ang detalye online gamit ang portal na ito o nang personal sa MSWDO." },
        { step: "02", title: "Pagpapatunay", desc: "Susuriin ng mga caseworker ang inyong isinumiteng dokumento." },
        { step: "03", title: "Panayam", desc: "Sumailalim sa pag-profile at panayam kasama ang isang Social Worker." },
        { step: "04", title: "Pag-apruba ng Alkalde", desc: "Ang dokumento ay dadaan sa pag-apruba ng Alkalde ng Munisipyo." },
        { step: "05", title: "Paglabas ng Pondo", desc: "Pagkuha ng cash o Guarantee Letter sa loob ng 1-3 araw." }
      ],
      processing: "1 hanggang 3 Araw ng Pagtatrabaho",
      location: "Unang Palapag, Tubungan Municipal Hall",
      contact: "Punong Casework Officer"
    },
    pwd: {
      tag: "BATAS REPUBLIKA 10754",
      title: "Kagalingan ng PWD at Pagpaparehistro ng ID",
      law: "REPUBLIC ACT 10754",
      overview: "Pinapanatili ng MSWDO Tubungan ang lokal na listahan ng mga Taong may Kapansanan upang ipatupad ang Republic Act 10754. Ang mga rehistradong PWD ay binibigyan ng National PWD ID Card, booklet para sa gamot at bilihin, at mga lokal na tulong tulad ng suportang rehabilitasyon at mga kagamitang pantulong.",
      eligibility: [
        "Mamamayang Pilipino na naninirahan sa Tubungan na may sertipikadong pangmatagalang kapansanan.",
        "Mga indibidwal na may nakikitang pisikal na kapansanan (amputations, orthopedic problems).",
        "Mga taong may hindi nakikitang kapansanan (learning disabilities, speech disorders, severe autism).",
        "Mga mamamayang may talamak na sakit na nagdudulot ng permanenteng limitasyon sa pagkilos.",
        "Mga residenteng bulag o may malabong paningin, at bingi o may mahirap na pandinig."
      ],
      requirements: [
        "Opisyal na DOH PWD Registry Form (makukuha sa MSWDO desk).",
        "Klinikal na Sertipiko mula sa lisensyadong doktor na nagsasaad ng uri ng kapansanan.",
        "Dalawang (2) piraso ng kamakailang 1x1 larawan na may pangalan.",
        "Sertipiko ng Paninirahan mula sa Barangay na nagpapatunay ng paninirahan sa Tubungan.",
        "Kopya ng Birth Certificate o anumang valid na pambansang ID."
      ],
      benefits: [
        { title: "20% Diskwento", desc: "Sa mga pangunahing gamot, bayad sa klinika, diagnostic tests, hotel, at pagkain sa labas." },
        { title: "Libre sa VAT", desc: "Libre mula sa 12% Value Added Tax sa mga pangunahing serbisyo at pagbili ng gamot." },
        { title: "Subsidy sa Grocery", desc: "Espesyal na 5% discount sa lingguhang pangunahing grocery at mga pangangailangan sa bahay." },
        { title: "Pantulong na Kagamitan", desc: "Pagkakaroon ng libreng wheelchair, saklay, at pamamahagi ng mga hearing aid." }
      ],
      steps: [
        { step: "01", title: "Suriing Medikal", desc: "Kumuha ng klinikal na klasipikasyon na nagpapatunay ng pisikal o mental na kapansanan." },
        { step: "02", title: "Pagpuno ng Form", desc: "Pumunta sa MSWDO at punan ang opisyal na DOH PWD registry form." },
        { step: "03", title: "Pagpapatunay", desc: "Patutunayan ng MSWDO health desk ang mga sertipiko kasama ng rekord ng doktor." },
        { step: "04", title: "DOH Encoding", desc: "I-encode ang inyong impormasyon sa pambansang PWD system para sa awtorisasyon." },
        { step: "05", title: "Paglabas ng ID", desc: "Kunin ang inyong PWD card at mga booklet sa loob ng 2-4 na araw ng pagtatrabaho." }
      ],
      processing: "2 hanggang 4 na Araw ng Pagtatrabaho",
      location: "Desk ng PWD, MSWDO, Tubungan Hall",
      contact: "Opisyal ng PWD ng Munisipyo"
    },
    senior: {
      tag: "BATAS REPUBLIKA 9994",
      title: "Serbisyong Pangkapakanan ng Nakatatanda at Rehistrasyon sa OSCA",
      law: "REPUBLIC ACT 9994",
      overview: "Ang Office of the Senior Citizens Affairs (OSCA) ay nasa ilalim ng pangangasiwa ng MSWDO Tubungan alinsunod sa Expanded Senior Citizens Act of 2010 (RA 9994). Nag-iisyu kami ng Senior Citizen ID card, nagpapanatili ng lokal na listahan para sa social pension, at nangangasiwa ng insentibo para sa centenarians.",
      eligibility: [
        "Anumang residente ng Tubungan, Iloilo na may edad na animnapung (60) taong gulang pataas.",
        "Mga matatandang naghihikahos na walang suporta mula sa mga anak o walang regular na pension.",
        "Mga nakakatandang residente na nangangailangan ng ID at booklet para sa legal na diskwento.",
        "Mga matatandang umabot sa edad na siyamnapu (90) o isandaang (100) taon para sa cash incentives."
      ],
      requirements: [
        "Kopya ng Birth Certificate o iba pang patunay ng edad (SSS/GSIS ID, Binyag Cert).",
        "Sertipiko mula sa Barangay na nagpapatunay ng anim na buwang paninirahan sa Tubungan.",
        "Dalawang (2) piraso ng kamakailang 1x1 larawan na may puting background.",
        "Para sa Social Pension: Social Case Study profiling report mula sa pinuno ng inyong Barangay."
      ],
      benefits: [
        { title: "20% Pambansang Diskwento", desc: "Libre mula sa 12% VAT at may 20% discount sa botika, klinika, ospital, at pamasahe." },
        { title: "Social Pension", desc: "Ang mga kwalipikadong indigent senior ay nakakatanggap ng ₱1,000 buwan-buwan na binabayad kada quarter." },
        { title: "Diskwento sa Kuryente at Tubig", desc: "5% discount sa bayad sa kuryente at tubig na nakapangalan sa Senior Citizen." },
        { title: "Regalo sa Centenarian", desc: "₱100,000 na cash grant kapag umabot sa edad na 100, kasama ang parangal mula sa munisipyo." }
      ],
      steps: [
        { step: "01", title: "Pagpapatunay ng Edad", desc: "Ihanda ang birth certificate o katumbas na pampublikong dokumento bilang patunay ng edad." },
        { step: "02", title: "Mag-apply sa OSCA", desc: "Pumunta sa OSCA Desk sa loob ng Tubungan Municipal Hall at humingi ng form." },
        { step: "03", title: "Pagsusuri ng Paninirahan", desc: "Magsumite ng sertipiko ng paninirahan mula sa Barangay bilang patunay." },
        { step: "04", title: "Pagsusuri at Lagda", desc: "Irerehistro at pipirmahan ng OSCA Chapter President ang inyong aplikasyon." },
        { step: "05", title: "Pagkuha ng ID", desc: "Paglabas ng inyong National Senior ID at booklet sa loob ng 1-2 araw." }
      ],
      processing: "1 hanggang 2 Araw ng Pagtatrabaho",
      location: "Desk ng OSCA, Tubungan Municipal Hall",
      contact: "Pinuno ng OSCA Secretariat"
    },
    "solo-parent": {
      tag: "BATAS REPUBLIKA 11861",
      title: "Kagalingan ng Solo Parents at Pag-iisyu ng ID",
      law: "REPUBLIC ACT 11861",
      overview: "Upang maprotektahan ang mga solo parent, ang MSWDO Tubungan ay nangangasiwa sa pagpaparehistro at pagbibigay ng benepisyo sa ilalim ng Republic Act 11861. Ang Solo Parent ay binibigyan ng ID card para sa mga diskwento sa gatas, gamot, bayad na bakasyon, at iskolarship para sa mga anak.",
      eligibility: [
        "Mga solong ina o ama na mag-isang nagpapalaki dahil sa pagpanaw ng asawa.",
        "Mga magulang na mag-isang nagpapalaki dahil sa hiwalayan o pag-abandona ng asawa sa loob ng 6+ buwan.",
        "Sinumang kamag-anak o tagapangalaga na nag-aaruga ng bata dahil sa pagkawala o pagkakulong ng magulang.",
        "Mga solo parent na may mababang kita na kumikita ng mas mababa sa ₱250,000 kada taon para sa karagdagang cash subsidy."
      ],
      requirements: [
        "Sertipiko ng Barangay Solo Parent na nagpapatunay ng mag-isang pagpapalaki ng anak sa loob ng 6 na buwan.",
        "Kopya ng Birth Certificate ng mga anak na wala pang 18 taong gulang na dumedepende.",
        "Patunay ng Solo Parent status (Death Certificate ng asawa, o sertipiko ng legal na paghihiwalay).",
        "Income Tax Return (ITR) o BIR Indigency Certificate na nagsasaad ng buwanang kita ng pamilya.",
        "Dalawang (2) piraso ng kamakailang 1x1 larawan na may lagda ng magulang."
      ],
      benefits: [
        { title: "10% Diskwento sa Sanggol", desc: "Libre sa VAT at may 10% discount sa gatas, pagkain ng sanggol, gamot, at diapers (para sa bata na wala pang 6 na taon)." },
        { title: "7 Araw na Paid Leave", desc: "7 araw na may bayad na bakasyon kada taon para sa magulang, bukod sa karaniwang leave ng empleyado." },
        { title: "Buwanang Subsidy", desc: "Ang mga kwalipikadong solo parent ay nakakatanggap ng ₱1,000 buwanang cash subsidy mula sa pondo ng munisipyo." },
        { title: "Scholarship sa TESDA", desc: "Priyoridad na slot para sa pagsasanay sa pangkabuhayan at kurso mula sa TESDA para sa mga anak." }
      ],
      steps: [
        { step: "01", title: "Pagsusuri ng Barangay", desc: "Kumuha ng sertipiko ng Solo Parent mula sa inyong Barangay Captain." },
        { step: "02", title: "Ihanda ang Impormasyon", desc: "Ihanda ang birth certificate ng mga anak at mga patunay ng kawalan ng asawa." },
        { step: "03", title: "Paghahain sa Desk", desc: "Isumite ang lahat ng dokumento sa MSWDO Solo Parent desk caseworker." },
        { step: "04", title: "Panayam sa Kaso", desc: "Sumailalim sa maikling panayam at pagsusuri ng caseworker sa munisipyo." },
        { step: "05", title: "Paglabas ng ID", desc: "Kunin ang inyong physical Solo Parent ID sa loob ng 3-5 araw." }
      ],
      processing: "3 hanggang 5 Araw ng Pagtatrabaho",
      location: "Desk ng Solo Parent, Tubungan Municipal Hall",
      contact: "Opisyal ng Solo Parent Roster"
    }
  }
};

export default function App() {
  // Session States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');
  
  // Language & Theme States
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'home' | 'apply' | 'history' | 'services-info' | 'about' | 'contact'>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('aics');
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mobile Submenu Toggles
  const [isMobileProgramsOpen, setIsMobileProgramsOpen] = useState(false);
  const [isMobileApplicationsOpen, setIsMobileApplicationsOpen] = useState(false);
  
  // Applications States
  const [applications, setApplications] = useState<AICSApplication[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  // System Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load user session and applications on mount, along with Elfsight script
  useEffect(() => {
    const savedUser = localStorage.getItem('mswdo_active_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        fetchApplications(user.id);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }

    // Graceful error handling for third-party scripts (e.g. Elfsight CORS/Sandbox errors)
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message === 'Script error.' || !event.filename || !event.filename.includes(window.location.origin)) {
        event.preventDefault();
        return true;
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      localStorage.removeItem('mswdo_active_user');
      return true;
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleRejection);

    // Dynamically inject Elfsight platform script
    const script = document.createElement('script');
    script.src = 'https://elfsightcdn.com/platform.js';
    script.async = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleRejection);
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Update applications state locally — filtered by userId at the database level
  const fetchApplications = async (userId: string) => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId);
    if (error) {
      console.error('Failed to fetch applications from Supabase:', error);
    } else if (data) {
      const mappedApps = data.map(app => ({
        id: app.id,
        userId: app.user_id,
        applicantName: app.applicant_name,
        applicantEmail: app.applicant_email,
        applicantPhone: app.applicant_phone,
        applicantAddress: app.applicant_address || '',
        applicantBirthdate: app.applicant_birthdate || '',
        applicantCivilStatus: app.applicant_civil_status || '',
        assistanceType: app.assistance_type,
        justification: app.justification,
        householdMembers: app.household_members,
        documents: app.documents,
        status: app.status,
        submissionDate: app.submission_date,
        controlNumber: app.control_number,
        clienteleCategories: app.clientele_categories || [],
        impressionFindings: app.impression_findings || '',
        recommendation: app.recommendation || ''
      }));
      setApplications(mappedApps);
    }
  };
  const saveApplications = (updatedApps: AICSApplication[]) => {
    setApplications(updatedApps);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('mswdo_active_user', JSON.stringify(user));
    fetchApplications(user.id);
    showToast(`Successfully logged in as ${user.name}!`, 'success');
    setActiveTab('history');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setApplications([]); // Clear so another user can't see previous user's apps
    localStorage.removeItem('mswdo_active_user');
    showToast('You have been logged out of your account.', 'info');
    setActiveTab('home');
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleApplyClickFromGuide = () => {
    if (!currentUser) {
      setAuthModalInitialTab('login');
      setIsAuthModalOpen(true);
      showToast('Please sign in or register to file an AICS application.', 'info');
    } else {
      setActiveTab('apply');
    }
  };

  const handleApplicationSubmit = (newApp: AICSApplication) => {
    if (currentUser) fetchApplications(currentUser.id); // Re-fetch only this user's apps
    showToast('AICS Application Submitted Successfully!', 'success');
    setActiveTab('history');
  };

  const handleStatusUpdate = async (appId: string, newStatus: AICSApplication['status'], notes?: string) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', appId);

    if (error) {
      console.error('Failed to update status in Supabase:', error);
      showToast('Failed to update status', 'error');
      return;
    }

    const updated = applications.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          statusNotes: notes || `Status updated to: ${newStatus}`
        };
      }
      return app;
    });
    saveApplications(updated);
    showToast(`Case status updated to: ${newStatus}`, 'info');
  };

  // Filter applications belonging only to the logged-in user
  const userApplications = currentUser 
    ? applications.filter(app => app.userId === currentUser.id) 
    : [];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100 animate-fade-in' : 'bg-slate-50 text-slate-800 animate-fade-in'
    }`}>
      {/* Dynamic Header Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[100] max-w-sm w-full rounded-xl shadow-2xl p-4 border flex items-start gap-3 animate-slide-in dark:text-white text-slate-900 dark:bg-slate-900 bg-white dark:border-slate-800 border-slate-200">
          <div className="shrink-0">
            {toast.type === 'success' && <CheckCircle2 className="text-emerald-500" size={20} />}
            {toast.type === 'info' && <Info className="text-amber-500" size={20} />}
            {toast.type === 'error' && <ShieldAlert className="text-rose-500" size={20} />}
          </div>
          <p className="text-xs font-semibold leading-relaxed">{toast.message}</p>
        </div>
      )}

      {/* Global Municipal Branding Navbar */}
      <nav className="sticky top-0 bg-blue-900 shadow-md z-40 transition-all text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo / Brand */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 dark:bg-slate-900 overflow-hidden border-2 border-white/20">
                  <img 
                    src="/images/logo.jpeg" 
                    alt="Tubungan Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm shrink-0 dark:bg-slate-900 overflow-hidden border-2 border-white/20 hidden sm:flex">
                  <img 
                    src="/images/mswdo.jpeg" 
                    alt="MSWDO Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight block uppercase leading-tight dark:text-white text-slate-900">
                  MSWDO Portal
                </span>
                <span className="text-[10px] text-blue-200 block uppercase tracking-widest font-semibold">
                  Municipal Social Welfare & Development Office
                </span>
              </div>
            </div>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              <button
                onClick={() => setActiveTab('home')}
                className={`pb-1 text-xs font-bold tracking-wide uppercase transition-all cursor-pointer border-b-2 ${
                  activeTab === 'home'
                    ? 'border-blue-400 text-white'
                    : 'border-transparent text-blue-200 hover:text-white'
                }`}
              >
                {translations[language].home}
              </button>

              {/* Services Dropdown - Desktop Hover */}
              <div 
                className="relative"
                onMouseEnter={() => {
                  if (dropdownTimeout) {
                    clearTimeout(dropdownTimeout);
                    setDropdownTimeout(null);
                  }
                  setIsServicesDropdownOpen(true);
                  setIsMobileMenuOpen(false); // Close the mobile menu on hover
                }}
                onMouseLeave={() => {
                  const timer = setTimeout(() => {
                    setIsServicesDropdownOpen(false);
                  }, 200); // 200ms comfortable buffer
                  setDropdownTimeout(timer);
                }}
              >
                <button
                  onClick={(e) => {
                    e.preventDefault(); // Clicking Welfare Services does NOT navigate
                  }}
                  className={`pb-1 text-xs font-bold tracking-wide uppercase transition-all cursor-pointer border-b-2 flex items-center gap-1 ${
                    activeTab === 'services-info'
                      ? 'border-blue-400 text-white'
                      : 'border-transparent text-blue-200 hover:text-white'
                  }`}
                >
                  {translations[language].welfareServices} <ChevronDown size={12} />
                </button>
                {isServicesDropdownOpen && (
                  <div className="absolute left-0 pt-2 w-72 z-50 text-slate-800 animate-fade-in dark:text-slate-100">
                    <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2.5 dark:bg-slate-900 dark:border-slate-800">
                      {servicesData.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => {
                            setSelectedServiceId(service.id);
                            setActiveTab('services-info');
                            setIsServicesDropdownOpen(false);
                            // Smooth scroll directly to the selected program section on the services page
                            setTimeout(() => {
                              const el = document.getElementById(`program-section-${service.id}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }, 100);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-start gap-2.5 cursor-pointer"
                        >
                          <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg mt-0.5 shrink-0">
                            <LucideIcon name={service.iconName} size={14} />
                          </div>
                          <div>
                            <p className="font-bold text-xs text-blue-600 dark:text-blue-400">{service.name}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{service.fullName}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('about')}
                className={`pb-1 text-xs font-bold tracking-wide uppercase transition-all cursor-pointer border-b-2 ${
                  activeTab === 'about'
                    ? 'border-blue-400 text-white'
                    : 'border-transparent text-blue-200 hover:text-white'
                }`}
              >
                {translations[language].aboutUs}
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`pb-1 text-xs font-bold tracking-wide uppercase transition-all cursor-pointer border-b-2 ${
                  activeTab === 'contact'
                    ? 'border-blue-400 text-white'
                    : 'border-transparent text-blue-200 hover:text-white'
                }`}
              >
                {translations[language].contactUs}
              </button>

              {currentUser && (
                <>
                  <button
                    onClick={() => setActiveTab('apply')}
                    className={`pb-1 text-xs font-bold tracking-wide uppercase transition-all cursor-pointer border-b-2 ${
                      activeTab === 'apply'
                        ? 'border-blue-400 text-white'
                        : 'border-transparent text-blue-200 hover:text-white'
                    }`}
                  >
                    {translations[language].applyAics}
                  </button>

                  <button
                    onClick={() => setActiveTab('history')}
                    className={`pb-1 text-xs font-bold tracking-wide uppercase transition-all cursor-pointer border-b-2 relative ${
                      activeTab === 'history'
                        ? 'border-blue-400 text-white'
                        : 'border-transparent text-blue-200 hover:text-white'
                    }`}
                  >
                    <span className="relative inline-block">
                      {translations[language].myApplications}
                      {userApplications.length > 0 && (
                        <span className="absolute -top-2.5 -right-3 px-1.5 py-0.5 rounded-full bg-blue-500 text-[9px] font-extrabold shadow-sm dark:text-white text-slate-900">
                          {userApplications.length}
                        </span>
                      )}
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Auth, Language & Theme Actions */}
            <div className="flex items-center gap-3">
              {/* Desktop Toggles */}
              <div className="hidden lg:flex items-center gap-2 mr-1">
                {/* Language Switch */}
                <button
                  onClick={() => setLanguage(lang => lang === 'en' ? 'fil' : 'en')}
                  className="p-2 rounded-xl bg-blue-800/40 hover:bg-blue-800/80 border border-blue-700 text-blue-200 hover:text-white transition-all text-xs font-bold cursor-pointer flex items-center gap-1"
                  title="Change Language"
                >
                  🌐 {language === 'en' ? 'EN' : 'FIL'}
                </button>
                {/* Theme Switch */}
                <button
                  onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                  className="p-2 rounded-xl bg-blue-800/40 hover:bg-blue-800/80 border border-blue-700 text-blue-200 hover:text-white transition-all text-xs font-bold cursor-pointer"
                  title="Toggle Theme"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
              </div>

              {currentUser ? (
                <div className="hidden lg:flex items-center gap-3 bg-blue-800/50 py-2 px-4 rounded-lg border border-blue-700/50">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold dark:text-white text-slate-900">{currentUser.name}</span>
                    <span className="text-[9px] text-blue-200 uppercase tracking-widest font-bold">ID: {currentUser.id.substring(4).toUpperCase()}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center font-bold text-blue-900 text-sm">
                    {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg hover:bg-red-500/20 text-blue-200 hover:text-white transition-all cursor-pointer"
                    title="Log Out Profile"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 border border-blue-700/50 hover:border-blue-500 rounded-lg text-xs font-bold text-blue-200 hover:text-white transition-all cursor-pointer bg-blue-800/30"
                  >
                    {translations[language].signIn}
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1 dark:text-white text-slate-900"
                  >
                    <LogIn size={13} /> {translations[language].createAccount}
                  </button>
                </div>
              )}

              {/* Mobile Menu Hamburger Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-blue-800/50 text-blue-200 hover:text-white transition-all cursor-pointer focus:outline-none z-50"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar (Slide-out Drawer Layout) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay - Clicking outside closes sidebar */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Drawer Container */}
          <div className={`fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out border-r animate-slide-in-left ${
            theme === 'dark' 
              ? 'bg-slate-900 border-slate-800 text-white' 
              : 'bg-white border-slate-200 text-slate-800'
          }`}>
            {/* Header / Brand */}
            <div className="p-5 border-b flex items-center justify-between border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-0.5 shadow-xs shrink-0 dark:bg-slate-900">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Seal_of_the_Department_of_Social_Welfare_and_Development.svg" 
                    alt="Logo" 
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <span className="font-extrabold text-sm tracking-tight block uppercase leading-tight text-blue-700 dark:text-blue-450">
                    MSWDO PORTAL
                  </span>
                  <span className="text-[8px] block uppercase tracking-wider font-semibold dark:text-slate-400 text-slate-500">
                    Tubungan Municipal
                  </span>
                </div>
              </div>
              
              {/* Close Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 transition-colors cursor-pointer dark:text-slate-400 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sidebar Body Scrollable Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Language & Theme Controls */}
              <div className="grid grid-cols-2 gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                {/* Language button */}
                <button
                  onClick={() => setLanguage(l => l === 'en' ? 'fil' : 'en')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-extrabold transition-all bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  🌐 {language === 'en' ? 'English' : 'Tagalog'}
                </button>
                
                {/* Theme button */}
                <button
                  onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-extrabold transition-all bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
                </button>
              </div>

              {/* Main Navigation links */}
              <div className="space-y-1.5">
                {/* Home link */}
                <button
                  onClick={() => {
                    setActiveTab('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-between ${
                    activeTab === 'home' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span>{translations[language].home}</span>
                </button>

                {/* Programs Collapsible Dropdown */}
                <div className="space-y-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileProgramsOpen(!isMobileProgramsOpen);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide flex items-center justify-between transition-all ${
                      isMobileProgramsOpen 
                        ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span>{translations[language].programs}</span>
                    <ChevronDown size={14} className={`transition-transform duration-250 ${isMobileProgramsOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Submenu of Programs - Sidebar remains open on click */}
                  {isMobileProgramsOpen && (
                    <div className="pl-3 pr-1 py-1 space-y-1.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 mt-1">
                      {servicesData.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => {
                            setSelectedServiceId(service.id);
                            setActiveTab('services-info');
                            setIsMobileMenuOpen(false); // Close the sidebar on select so they see the program card page
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-2.5 rounded-lg cursor-pointer ${
                            selectedServiceId === service.id && activeTab === 'services-info'
                              ? 'bg-blue-500/10 border border-blue-500/20'
                              : ''
                          }`}
                        >
                          <div className="p-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md shrink-0 mt-0.5">
                            <LucideIcon name={service.iconName} size={12} />
                          </div>
                          <div>
                            <p className="font-bold text-[11px] leading-tight text-blue-600 dark:text-blue-400">{service.name}</p>
                            <p className="text-[9px] line-clamp-1 dark:text-slate-400 text-slate-500">{service.fullName}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Applications Collapsible Dropdown (if logged in) */}
                {currentUser && (
                  <div className="space-y-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileApplicationsOpen(!isMobileApplicationsOpen);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide flex items-center justify-between transition-all ${
                        isMobileApplicationsOpen 
                          ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span>{translations[language].applications}</span>
                      <ChevronDown size={14} className={`transition-transform duration-250 ${isMobileApplicationsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Submenu of Applications - Sidebar remains open on click */}
                    {isMobileApplicationsOpen && (
                      <div className="pl-3 pr-1 py-1 space-y-1.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 mt-1">
                        <button
                          onClick={() => {
                            setActiveTab('apply');
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-2.5 rounded-lg cursor-pointer ${
                            activeTab === 'apply' ? 'bg-blue-500/10 border border-blue-500/20' : ''
                          }`}
                        >
                          <div className="p-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-md shrink-0 mt-0.5">
                            <ClipboardList size={12} />
                          </div>
                          <div>
                            <p className="font-bold text-[11px] leading-tight text-slate-850 dark:text-slate-200">
                              {translations[language].applyAics}
                            </p>
                            <p className="text-[9px] dark:text-slate-400 text-slate-500">Fill & submit online form</p>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setActiveTab('history');
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-2.5 rounded-lg cursor-pointer ${
                            activeTab === 'history' ? 'bg-blue-500/10 border border-blue-500/20' : ''
                          }`}
                        >
                          <div className="p-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-md shrink-0 mt-0.5">
                            <CheckCircle2 size={12} />
                          </div>
                          <div className="flex-1 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-[11px] leading-tight text-slate-850 dark:text-slate-200">
                                {translations[language].myApplications}
                              </p>
                              <p className="text-[9px] dark:text-slate-400 text-slate-500">Track and monitor requests</p>
                            </div>
                            {userApplications.length > 0 && (
                              <span className="bg-blue-500 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm ml-2 dark:text-white text-slate-900">
                                {userApplications.length}
                              </span>
                            )}
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* About Us Link */}
                <button
                  onClick={() => {
                    setActiveTab('about');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all block ${
                    activeTab === 'about' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {translations[language].aboutUs}
                </button>

                {/* Contact Us Link */}
                <button
                  onClick={() => {
                    setActiveTab('contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all block ${
                    activeTab === 'contact' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {translations[language].contactUs}
                </button>
              </div>
            </div>

            {/* Sidebar Footer with Profile or Sign In */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
              {currentUser ? (
                <div className="flex items-center justify-between gap-3 bg-blue-500/10 dark:bg-blue-900/40 p-3 rounded-xl border border-blue-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                      {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-850 dark:text-slate-200">{currentUser.name}</p>
                      <p className="text-[9px] font-medium dark:text-slate-400 text-slate-500">ID: {currentUser.id.substring(4).toUpperCase()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                    title="Log Out Profile"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('login');
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 border border-slate-200 dark:border-slate-800 hover:border-slate-300 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-200 transition-all bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer text-center"
                  >
                    {translations[language].signIn}
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('register');
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer text-center dark:text-white text-slate-900"
                  >
                    {translations[language].createAccount}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* TAB 1: HOME & WELFARE PROGRAMS GUIDE */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-fade-in">
            {/* Beautiful Hero Section with Background Image */}
            <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-xl flex items-center justify-center text-center px-4 md:px-8">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80')` 
                }}
              />
              {/* Solid overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/85 to-slate-950/95" />
              
              {/* Hero Content */}
              <div className="relative z-10 max-w-3xl space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-xs font-bold text-blue-300 backdrop-blur-xs">
                  <Landmark size={14} className="text-blue-400" /> Municipal Social Welfare & Development Office
                </div>
                
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight uppercase dark:text-white text-slate-900">
                  Tubungan MSWDO Portal
                </h1>
                
                <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium dark:text-slate-300 text-slate-600">
                  Your direct digital link to social welfare programs and emergency assistance. Securely register, apply for AICS, and track document validation in real time.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setAuthModalInitialTab('register');
                        setIsAuthModalOpen(true);
                      } else {
                        setActiveTab('apply');
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-sm shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider dark:text-white text-slate-900"
                  >
                    {currentUser ? 'File AICS Application' : 'Register Secure Profile'} <ArrowRight size={16} />
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveTab('services-info');
                      setSelectedServiceId('aics');
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/25 hover:border-white/40 dark:text-white text-slate-900"
                  >
                    Explore Services Guide
                  </button>
                </div>
              </div>
            </div>

            {/* Registration Gate (Prompts guest users to create account first) */}
            {!currentUser && (
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 dark:bg-slate-900 dark:border-slate-800">
                <div className="lg:col-span-6 p-8 md:p-12 relative flex flex-col justify-between overflow-hidden min-h-[350px] dark:text-white text-slate-900 dark:bg-slate-900 bg-white">
                  <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1000')" }} />
                  <div className="relative z-10 space-y-6">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      Identity Verification Required
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                      Create Your Secured Account to Open the Portal
                    </h2>
                    <p className="text-xs md:text-sm leading-relaxed dark:text-slate-300 text-slate-600">
                      To submit AICS applications and access digital services, all residents of Tubungan must verify their identity. This keeps your personal case files secure and compliant with the Data Privacy Act of 2012.
                    </p>
                    
                    <div className="space-y-3 pt-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-emerald-400 mt-0.5" size={16} />
                        <span className="text-xs font-semibold text-slate-200">Pre-fill future social applications instantly</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-emerald-400 mt-0.5" size={16} />
                        <span className="text-xs font-semibold text-slate-200">Track real-time caseworker reviews and feedback</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="text-emerald-400 mt-0.5" size={16} />
                        <span className="text-xs font-semibold text-slate-200">Secure digital document storage and validation</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative z-10 text-[10px] pt-6 border-t dark:text-slate-400 text-slate-500 dark:border-slate-800 border-slate-200">
                    * All data is processed using AES-256 SSL encryption.
                  </div>
                </div>

                <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-center bg-slate-50 dark:bg-slate-950">
                  <div className="max-w-md w-full mx-auto space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Get Started Today</h3>
                      <p className="text-xs text-slate-500 mt-1">Register a new profile or sign in to open the digital dashboard.</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => {
                          setAuthModalInitialTab('register');
                          setIsAuthModalOpen(true);
                        }}
                        className="flex-1 py-3 bg-blue-700 hover:bg-blue-800 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer dark:text-white text-slate-900"
                      >
                        <LogIn size={14} /> Create Account / Register
                      </button>
                      <button
                        onClick={() => {
                          setAuthModalInitialTab('login');
                          setIsAuthModalOpen(true);
                        }}
                        className="flex-1 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer dark:bg-slate-900 dark:border-slate-800"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Core Social Services Catalog Row */}
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-600 tracking-tight dark:text-blue-400">
                    Our Core Social Services
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Tubungan MSWDO manages multiple assistance programs. Click below to view official qualifications and document requirements.
                  </p>
                </div>
              </div>

              {/* Grid of services info cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {servicesData.map((service) => (
                  <div key={service.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all dark:bg-slate-900 dark:border-slate-800">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div className="p-3 bg-blue-50 text-blue-700 rounded-xl shrink-0">
                          <LucideIcon name={service.iconName} size={24} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                          {service.id.toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-4 leading-tight dark:text-white">
                        {service.fullName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedServiceId(service.id);
                          setActiveTab('services-info');
                        }}
                        className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        View Qualifications & Requirements <ChevronRight size={14} />
                      </button>
                      
                      {service.id === 'aics' && (
                        <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 uppercase tracking-wide">
                          Online Application Available
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Step Guide */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div className="space-y-2">
                <span className="text-2xl font-black text-blue-700">01.</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Create Secured Profile</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Register with your official name, municipal residential address, and contact number. We protect your data securely under the Data Privacy Act.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-2xl font-black text-amber-500">02.</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Upload Requirements</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Take a digital photo of your Barangay Indigency, valid government ID, or clinical documents and attach them directly to your application slot.
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-2xl font-black text-green-700">03.</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Track Review Status</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Monitor verification stages and social worker caseworker remarks from your digital portal. Get scheduled for direct payouts.
                </p>
              </div>
            </div>

            {/* Live Facebook Updates Feed */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 dark:text-white">
                  <span className="w-2.5 h-5 bg-blue-700 rounded-full inline-block" /> Live Municipal Announcements & News
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Stay updated with the latest notices, payout schedules, and emergency alerts from our official Facebook feed.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 min-h-[400px] dark:bg-slate-950">
                {/* Elfsight Facebook Feed */}
                <div className="elfsight-app-7c1854a3-bf46-4d2d-b085-97e08c579d4b" data-elfsight-app-lazy="true"></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SERVICES DETAIL HUB */}
        {activeTab === 'services-info' && (
          <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-150">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/40">
                {translations[language].qualificationsHeader}
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase leading-tight text-blue-600 dark:text-blue-400">
                MSWDO Tubungan Citizen Charter
              </h2>
              <p className="text-xs md:text-sm text-blue-600 dark:text-blue-400">
                {translations[language].qualificationsSub}
              </p>
            </div>

            {/* Jump Navigation links */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-center gap-3 shadow-sm">
              <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Jump to Program:
              </span>
              {servicesData.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedServiceId(service.id);
                    const el = document.getElementById(`program-section-${service.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    selectedServiceId === service.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>

            {/* Info Callout */}
            <div className="bg-blue-900/5 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/40 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-2">
                <h4 className="font-bold text-sm text-blue-800 dark:text-blue-400 flex items-center gap-2 uppercase">
                  <ShieldAlert size={16} /> {translations[language].onlyAicsOnline}
                </h4>
                <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed font-semibold">
                  {translations[language].onlyAicsOnlineDesc}
                </p>
              </div>
              <div className="md:col-span-4 flex justify-end">
                <button
                  onClick={handleApplyClickFromGuide}
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-xs transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 uppercase tracking-wide cursor-pointer dark:text-white text-slate-900"
                >
                  <ClipboardList size={14} /> {translations[language].applyOnlineNow}
                </button>
              </div>
            </div>

            {/* Single Program Page - Interactive, Dynamic, Beautiful & Fully Localized */}
            <div className="space-y-12">
              {(() => {
                const item = PROGRAMS_DETAIL_TRANSLATIONS[language][selectedServiceId as 'aics' | 'pwd' | 'senior' | 'solo-parent'] || PROGRAMS_DETAIL_TRANSLATIONS[language]['aics'];
                const iconName = selectedServiceId === 'pwd' ? 'Smile' : selectedServiceId === 'senior' ? 'Users' : selectedServiceId === 'solo-parent' ? 'HeartHandshake' : 'Activity';
                const isAics = selectedServiceId === 'aics';

                return (
                  <div 
                    id={`program-section-${selectedServiceId}`} 
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden transition-all animate-fade-in"
                  >
                    {/* Header Banner - styled exactly like the beautiful AICS banner */}
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl">
                          <LucideIcon name={iconName} size={32} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md">
                            {item.tag}
                          </span>
                          <h3 className="text-xl md:text-2xl font-black mt-1 uppercase tracking-tight">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                      {isAics ? (
                        <button
                          onClick={handleApplyClickFromGuide}
                          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer self-start md:self-center uppercase tracking-wider dark:text-white text-slate-900"
                        >
                          {translations[language].applyOnlineNow} <ArrowRight size={14} />
                        </button>
                      ) : (
                        <span className="text-xs text-blue-100 font-extrabold bg-blue-500/20 px-3.5 py-2 rounded-xl border border-blue-400/20 uppercase tracking-wider self-start md:self-center">
                          Physical Office Application
                        </span>
                      )}
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
                      {/* Overview */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          {translations[language].programOverview}
                        </h4>
                        <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950/45 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                          {item.overview}
                        </p>
                      </div>

                      {/* Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Eligibility */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="text-blue-500" size={16} /> {translations[language].whoIsQualified}
                          </h4>
                          <div className="space-y-2.5">
                            {item.eligibility.map((criterion, i) => (
                              <div key={i} className="flex gap-3 text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                <span className="font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                                <span>{criterion}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Requirements */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ClipboardList className="text-blue-500" size={16} /> {translations[language].mandatoryDocs}
                          </h4>
                          <div className="space-y-2.5">
                            {item.requirements.map((req, i) => (
                              <div key={i} className="flex gap-3 text-xs md:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                <span className="font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                                <span>{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Benefits & Privileges */}
                      <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="text-blue-500" size={16} /> {translations[language].benefitsTitle}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {item.benefits.map((benefit, i) => (
                            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-between">
                              <p className="font-bold text-xs md:text-sm text-blue-800 dark:text-blue-400 uppercase tracking-tight">{benefit.title}</p>
                              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{benefit.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          {translations[language].stepByStepTitle}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {item.steps.map((step, idx) => (
                            <div key={idx} className="p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded-2xl border border-blue-100/45 dark:border-blue-900/40 relative">
                              <span className="absolute top-2 right-3 font-black text-blue-300/60 dark:text-blue-700/60 text-lg">{step.step}</span>
                              <p className="font-bold text-xs md:text-sm text-slate-900 dark:text-slate-100">{step.title}</p>
                              <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{step.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer Info Box */}
                      <div className="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/5 text-blue-800 dark:text-blue-300 border border-blue-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs md:text-sm font-semibold">
                        <p>🕒 <strong>{translations[language].processingTimeLabel}</strong> {item.processing}</p>
                        <p>📍 <strong>{translations[language].locationLabel}</strong> {item.location}</p>
                        <p>👤 <strong>{translations[language].contactLabel}</strong> {item.contact}</p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Hidden block to suppress original static layouts */}
            <div className="hidden space-y-12">
              {/* SECTION 1: AICS */}
              <div 
                id="program-section-aics" 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden scroll-mt-24 transition-all"
              >
                {/* Header banner */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <LucideIcon name="Activity" size={32} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md">
                        MUNICIPAL EMERGENCY FUND
                      </span>
                      <h3 className="text-xl md:text-2xl font-black mt-1 uppercase tracking-tight">
                        Assistance to Individuals in Crisis Situations (AICS)
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={handleApplyClickFromGuide}
                    className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-xs font-extrabold rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer self-start md:self-center uppercase tracking-wider dark:text-white text-slate-900"
                  >
                    Apply Online Now <ArrowRight size={14} />
                  </button>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  {/* Overview */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {translations[language].programOverview}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      The Assistance to Individuals in Crisis Situations (AICS) serves as a vital social safety net for Tubungan families experiencing unexpected extreme hardships. MSWDO provides localized financial subsidies, guarantee letters, or direct emergency releases to mitigate crises including critical illnesses, unexpected deaths, stranded travel, severe malnutrition, or extreme indigency. 
                    </p>
                  </div>

                  {/* Two Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Eligibility */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400" /> {translations[language].whoIsQualified}
                      </h4>
                      <div className="space-y-2.5">
                        {[
                          "Any resident of Tubungan, Iloilo experiencing an active crisis or emergency situation.",
                          "Indigent families lacking regular household income or below the municipal poverty line.",
                          "Patients undergoing expensive ongoing medical procedures (chemotherapy, dialysis, major surgeries).",
                          "Families who lost a primary breadwinner or need immediate coffin/funeral subsidy support.",
                          "Students from low-income homes seeking one-time school support to prevent dropping out.",
                          "Stranded individuals in the municipality seeking local repatriation transportation."
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ClipboardList size={16} className="text-blue-600 dark:text-blue-400" /> {translations[language].mandatoryDocs}
                      </h4>
                      <div className="space-y-2.5">
                        {[
                          "Certificate of Indigency issued by your respective Barangay Captain.",
                          "Valid Government Issued ID of the applicant (original and photocopy).",
                          "For Medical Help: Official Clinical Summary, Doctor's Prescription, and Hospital Bill Statement.",
                          "For Funeral Help: Registered Death Certificate and Funeral Contract Statement.",
                          "For Educational Help: Valid Student ID and Certificate of Enrollment/Registration.",
                          "For Transportation Help: Police Clearance or Barangay Certificate of Stranded Status."
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Core Benefits */}
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Award size={16} className="text-blue-600 dark:text-blue-400" /> {translations[language].benefitsTitle}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/45 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-xs text-blue-900 dark:text-blue-300">Medical Assistance</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Vouchers, financial release, or Guarantee Letters for hospitals and pharmacies.</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/45 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-xs text-blue-900 dark:text-blue-300">Funeral Subsidies</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Direct support to cover casket, burial plot, and transport services for deceased loved ones.</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-950/45 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-xs text-blue-900 dark:text-blue-300">Educational Subsidy</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Subsidies of ₱3,000 to ₱10,000 to assist underprivileged students during emergencies.</p>
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      {translations[language].stepByStepTitle}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[
                        { step: "01", title: "Submit Form", desc: "Submit details online via this portal or physically at MSWDO." },
                        { step: "02", title: "Verification", desc: "Caseworkers inspect and confirm submitted papers." },
                        { step: "03", title: "Interview", desc: "Undergo a profiling session with a Social Worker." },
                        { step: "04", title: "Mayor Approval", desc: "Document undergoes Municipal approval routing." },
                        { step: "05", title: "Fund Payout", desc: "Cash or Guarantee Letter release in 1-3 days." }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-blue-50/40 dark:bg-blue-950/20 rounded-2xl border border-blue-100/40 dark:border-blue-900/40 relative">
                          <span className="absolute top-2 right-3 font-black text-blue-300/60 dark:text-blue-700/60 text-lg">{item.step}</span>
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.title}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Processing info footer */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 text-amber-800 dark:text-amber-400 border border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                    <p>🕒 <strong>{translations[language].processingTimeLabel}</strong> 1 to 3 Working Days</p>
                    <p>📍 <strong>{translations[language].locationLabel}</strong> 1st Floor, Tubungan Municipal Hall</p>
                    <p>👤 <strong>{translations[language].contactLabel}</strong> Head Casework Officer</p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PWD */}
              <div 
                id="program-section-pwd" 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden scroll-mt-24 transition-all"
              >
                <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <LucideIcon name="Award" size={32} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md">
                        REPUBLIC ACT 10754
                      </span>
                      <h3 className="text-xl md:text-2xl font-black mt-1 uppercase tracking-tight">
                        Persons with Disability (PWD) Welfare & ID Registration
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-100 font-extrabold bg-emerald-500/20 px-3.5 py-2 rounded-xl border border-emerald-400/20 uppercase tracking-wider self-start md:self-center">
                    Physical Office Application
                  </span>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {translations[language].programOverview}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      MSWDO Tubungan maintains the localized registry of Persons with Disabilities to enforce compliance with Republic Act 10754. Registered PWDs are supplied with the physical National PWD Identification Card, drug and purchase booklets, and customized local interventions like physical rehabilitation support and technical aid tools.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="text-emerald-500" size={16} /> {translations[language].whoIsQualified}
                      </h4>
                      <div className="space-y-2.5">
                        {[
                          "Philippine citizens residing in Tubungan with a medically certified long-term impairment.",
                          "Individuals with visible physical impairments (amputees, orthopedic difficulties).",
                          "Persons with invisible impairments (learning disabilities, speech disorders, severe autism).",
                          "Citizens with chronic medical diseases leading to permanent functional limitation.",
                          "Blind or low-vision residents, and deaf or hard-of-hearing individuals."
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <ClipboardList className="text-emerald-500" size={16} /> {translations[language].mandatoryDocs}
                      </h4>
                      <div className="space-y-2.5">
                        {[
                          "Official DOH PWD Registry Form (available at MSWDO desk).",
                          "Comprehensive Clinical Certificate from a licensed physician classifying the disability.",
                          "Two (2) pieces recent 1x1 size ID photos with name tag.",
                          "Barangay Residency Certificate proving current home stay in Tubungan.",
                          "Birth Certificate photocopy or any valid national identification document."
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="text-emerald-500" size={16} /> {translations[language].benefitsTitle}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-emerald-800 dark:text-emerald-400">20% Discount</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1">On essential medicines, clinic fees, diagnostic tests, hotel rooms, and dining.</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-emerald-800 dark:text-emerald-400">VAT Exemption</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-455 mt-1">Exemption from the 12% Value Added Tax on key services and medication purchase.</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-emerald-800 dark:text-emerald-400">Grocery Subsidy</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-1">Special 5% discount on weekly prime groceries and raw home necessities.</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-emerald-800 dark:text-emerald-400">Assistive Devices</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-455 mt-1">Access to free wheelchairs, custom crutches, and hearing aid distributions.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {translations[language].stepByStepTitle}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[
                        { step: "01", title: "Medical Check", desc: "Obtain clinical classification certifying physical/mental impairment." },
                        { step: "02", title: "Form Filing", desc: "Visit MSWDO and fill out the national DOH PWD registry form." },
                        { step: "03", title: "Validation", desc: "MSWDO health desk validates certificates with physician records." },
                        { step: "04", title: "DOH Encoding", desc: "Data encoded into national PWD systems for authorization." },
                        { step: "05", title: "ID Release", desc: "Get national PWD card and booklets in 2-4 working days." }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/40 relative">
                          <span className="absolute top-2 right-3 font-black text-emerald-300/60 dark:text-emerald-700/60 text-lg">{item.step}</span>
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.title}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 border border-emerald-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                    <p>🕒 <strong>{translations[language].processingTimeLabel}</strong> 2 to 4 Working Days</p>
                    <p>📍 <strong>{translations[language].locationLabel}</strong> MSWDO PWD Desk, Tubungan Hall</p>
                    <p>👤 <strong>{translations[language].contactLabel}</strong> Municipal PWD Officer</p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: SENIOR CITIZENS */}
              <div 
                id="program-section-senior" 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden scroll-mt-24 transition-all"
              >
                <div className="bg-gradient-to-r from-amber-800 to-amber-900 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <LucideIcon name="Users" size={32} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md">
                        REPUBLIC ACT 9994
                      </span>
                      <h3 className="text-xl md:text-2xl font-black mt-1 uppercase tracking-tight">
                        Elderly Welfare Services & OSCA Registration
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs text-amber-100 font-extrabold bg-amber-500/20 px-3.5 py-2 rounded-xl border border-amber-400/20 uppercase tracking-wider self-start md:self-center">
                    Physical Office Application
                  </span>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-450 uppercase tracking-wider">
                      {translations[language].programOverview}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      The Office of the Senior Citizens Affairs (OSCA) is hosted under MSWDO Tubungan in compliance with the Expanded Senior Citizens Act of 2010 (RA 9994). We issue the Senior Citizen ID card, maintain local records of indigent elders to facilitate social pensions, and direct centenarian incentives alongside municipal cultural services.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-450 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="text-amber-500" size={16} /> {translations[language].whoIsQualified}
                      </h4>
                      <div className="space-y-2.5">
                        {[
                          "Any resident of Tubungan, Iloilo who has reached sixty (60) years of age.",
                          "Indigent seniors lacking support from children or a stable retirement pension.",
                          "Older residents who need a physical ID and purchase booklet to claim legal discounts.",
                          "Elders reaching ninety (90) or one hundred (100) years old for cash bonus incentives."
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-extrabold text-amber-600 dark:text-amber-450 mt-0.5">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-450 uppercase tracking-wider flex items-center gap-1.5">
                        <ClipboardList className="text-amber-500" size={16} /> {translations[language].mandatoryDocs}
                      </h4>
                      <div className="space-y-2.5">
                        {[
                          "Birth Certificate photocopy or other official age proof (SSS/GSIS ID, Baptismal Cert).",
                          "Barangay Certificate confirming at least six (6) months of stay in Tubungan.",
                          "Two (2) recent 1x1 size ID photos with white background.",
                          "For Social Pension: Social Case Study profiling report compiled by your Barangay leader."
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-extrabold text-amber-600 dark:text-amber-455 mt-0.5">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-450 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="text-amber-500" size={16} /> {translations[language].benefitsTitle}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-amber-800 dark:text-amber-400">20% National Discount</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Exempt from 12% VAT and granted 20% discount on pharmacies, hospital clinics, and transport.</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-amber-800 dark:text-amber-400">Social Pension</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Eligible indigent elders receive a monthly stipend of ₱1,000, distributed quarterly.</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-amber-800 dark:text-amber-400">Utility discounts</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">5% discount on home electricity and water bills registered under the senior's name.</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-amber-800 dark:text-amber-400">Centenarian Gift</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">₱100,000 cash grant reward upon reaching age 100, with local honors.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-amber-600 dark:text-amber-450 uppercase tracking-wider">
                      {translations[language].stepByStepTitle}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[
                        { step: "01", title: "Age Validation", desc: "Collect birth certificate or equivalent public record proving age." },
                        { step: "02", title: "Apply at OSCA", desc: "Visit OSCA Desk inside Tubungan Municipal Hall and request form." },
                        { step: "03", title: "Residency Check", desc: "Submit Barangay residency paper proving continuous home stay." },
                        { step: "04", title: "Review & Sign", desc: "OSCA Chapter President registers and endorses your file." },
                        { step: "05", title: "ID Pick up", desc: "Release of National Senior ID booklet in 1-2 working days." }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-amber-50/40 dark:bg-amber-950/20 rounded-2xl border border-amber-100/40 dark:border-amber-900/40 relative">
                          <span className="absolute top-2 right-3 font-black text-amber-300/60 dark:text-amber-700/60 text-lg">{item.step}</span>
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.title}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/5 text-amber-800 dark:text-amber-400 border border-amber-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                    <p>🕒 <strong>{translations[language].processingTimeLabel}</strong> 1 to 2 Working Days</p>
                    <p>📍 <strong>{translations[language].locationLabel}</strong> OSCA Desk, Tubungan Municipal Hall</p>
                    <p>👤 <strong>{translations[language].contactLabel}</strong> Head of OSCA Secretariat</p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: SOLO PARENTS */}
              <div 
                id="program-section-solo-parent" 
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden scroll-mt-24 transition-all"
              >
                <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-white">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl">
                      <LucideIcon name="HeartHandshake" size={32} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded-md">
                        REPUBLIC ACT 11861
                      </span>
                      <h3 className="text-xl md:text-2xl font-black mt-1 uppercase tracking-tight">
                        Solo Parents Welfare Services & ID Issuance
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs text-purple-100 font-extrabold bg-purple-500/20 px-3.5 py-2 rounded-xl border border-purple-400/20 uppercase tracking-wider self-start md:self-center">
                    Physical Office Application
                  </span>
                </div>

                <div className="p-6 md:p-8 space-y-8">
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-450 uppercase tracking-wider">
                      {translations[language].programOverview}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      To safeguard solo parent households, MSWDO Tubungan facilitates registration and benefits issuance under Republic Act 11861 (Expanded Solo Parents Welfare Act). Solo Parents are granted a physical ID card which unlocks discounts on baby supplies, paid leaves, and localized scholarship slots for children.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-450 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="text-purple-500" size={16} /> {translations[language].whoIsQualified}
                      </h4>
                      <div className="space-y-2.5">
                        {[
                          "Single mothers or fathers carrying solo parental responsibilities due to death of spouse.",
                          "Parents raising children alone because of legal separation or spouse abandonment for 6+ months.",
                          "Any relative or guardian rearing a child left behind due to parent physical absence/imprisonment.",
                          "Low-income solo parents earning below ₱250,000 annually for additional cash subsidies."
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-extrabold text-purple-600 dark:text-purple-455 mt-0.5">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-450 uppercase tracking-wider flex items-center gap-1.5">
                        <ClipboardList className="text-purple-500" size={16} /> {translations[language].mandatoryDocs}
                      </h4>
                      <div className="space-y-2.5">
                        {[
                          "Barangay Solo Parent Certificate stating single parenting status for at least 6 months.",
                          "Photocopies of children's Birth Certificates proving dependency under 18.",
                          "Proof of single parenthood status (Spouse Death Certificate, or Legal Separation decree).",
                          "Income Tax Return (ITR) or BIR Indigency stating monthly household salary.",
                          "Two (2) recent 1x1 ID photos with signature of parent."
                        ].map((item, i) => (
                          <div key={i} className="flex gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                            <span className="font-extrabold text-purple-600 dark:text-purple-450 mt-0.5">✓</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-455 uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="text-purple-500" size={16} /> {translations[language].benefitsTitle}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-purple-800 dark:text-purple-400">10% Baby Discount</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Exempt from VAT and granted 10% discount on baby milk, food, medicine, and diapers (for kids under 6).</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-purple-800 dark:text-purple-400">7 Days Paid Leave</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">7 days of fully-paid annual parental leave, extra to regular employee leave allotments.</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-purple-800 dark:text-purple-400">Monthly Cash Subsidy</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Eligible low-income solo parents receive ₱1,000 monthly cash grant from the municipal budget.</p>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-950/45 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                        <p className="font-bold text-purple-800 dark:text-purple-400">TESDA Scholarships</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Priority enrollment slots for educational livelihood and skill training programs.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-xs font-extrabold text-purple-600 dark:text-purple-450 uppercase tracking-wider">
                      {translations[language].stepByStepTitle}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {[
                        { step: "01", title: "Barangay Check", desc: "Obtain Barangay Captain's Solo Parent certification of 6-month status." },
                        { step: "02", title: "Gather Records", desc: "Organize kids' birth records and spouse-absence proofs." },
                        { step: "03", title: "Desk Filing", desc: "Submit all documents to the MSWDO Solo Parent desk worker." },
                        { step: "04", title: "Case Interview", desc: "Undergo brief caseworker evaluation interview at the hall." },
                        { step: "05", title: "ID Issuance", desc: "Collect physical Solo Parent National ID in 3-5 working days." }
                      ].map((item, idx) => (
                        <div key={idx} className="p-4 bg-purple-50/40 dark:bg-purple-950/20 rounded-2xl border border-purple-100/40 dark:border-purple-900/40 relative">
                          <span className="absolute top-2 right-3 font-black text-purple-300/60 dark:text-purple-700/60 text-lg">{item.step}</span>
                          <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.title}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-500/10 dark:bg-purple-500/5 text-purple-800 dark:text-purple-400 border border-purple-500/20 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                    <p>🕒 <strong>{translations[language].processingTimeLabel}</strong> 3 to 5 Working Days</p>
                    <p>📍 <strong>{translations[language].locationLabel}</strong> MSWDO Desk, Tubungan Municipal Hall</p>
                    <p>👤 <strong>{translations[language].contactLabel}</strong> Solo Parent Roster Officer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ABOUT US */}
        {activeTab === 'about' && (
          <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Our Mission & Mandate
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-blue-700 tracking-tight uppercase dark:text-blue-400">
                About MSWDO Tubungan
              </h2>
              <p className="text-xs md:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                Learn about the Municipal Social Welfare and Development Office of Tubungan, Iloilo, and our commitment to public welfare.
              </p>
            </div>

            {/* Split Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Our Vision</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We envision Tubungan as a self-reliant, secure, and empowered community where poor, vulnerable, and disadvantaged individuals, families, and sectors are provided with social protection and opportunities to achieve a better quality of life.
                </p>
              </div>

              <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl shadow-sm space-y-4 dark:bg-slate-900 dark:border-slate-800">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                  <Landmark size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Our Mission</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  To provide immediate social protection and welfare services to Tubungan residents, promoting social integration, capacity building, and livelihood opportunities for senior citizens, solo parents, persons with disabilities, and families in crisis.
                </p>
              </div>
            </div>

            {/* Mandate & Governance */}
            <div className="rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden dark:text-white text-slate-900 dark:bg-slate-900 bg-white">
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-xl font-bold text-blue-400">Governance & Mandate</h3>
              <p className="text-xs leading-relaxed dark:text-slate-300 text-slate-600">
                MSWDO Tubungan operates in accordance with the Local Government Code of 1991 (RA 7160) and national welfare guidelines issued by the Department of Social Welfare and Development (DSWD). We serve as the frontline social protection office, managing local budget allocations, emergency response funding, and social pensions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t text-center dark:border-slate-800 border-slate-200">
                <div>
                  <h4 className="text-2xl font-black text-blue-400">100%</h4>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mt-1 dark:text-slate-400 text-slate-500">Data Privacy Protected</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-blue-400">24 Hours</h4>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mt-1 dark:text-slate-400 text-slate-500">Emergency Coordination</p>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-blue-400">Direct</h4>
                  <p className="text-[10px] uppercase tracking-wider font-semibold mt-1 dark:text-slate-400 text-slate-500">Municipal Assistance</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: CONTACT US */}
        {activeTab === 'contact' && (
          <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                Get In Touch
              </span>
              <h2 className="text-3xl font-black text-blue-700 tracking-tight uppercase dark:text-blue-400">
                Contact Tubungan MSWDO
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                If you have immediate questions regarding qualifications or are experiencing a severe social crisis, contact our desk or visit the Municipal Hall.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Contact Info Card */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-6 dark:bg-slate-900 dark:border-slate-800">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 dark:text-white">Office Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5 text-xs text-slate-600">
                      <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                        <Landmark size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Main Office Address</p>
                        <p className="mt-0.5 leading-relaxed">Municipal Hall Compound, Poblacion, Tubungan, Iloilo, Philippines 5027</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 text-xs text-slate-600">
                      <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Office Hours</p>
                        <p className="mt-0.5 leading-relaxed">Monday to Friday<br />8:00 AM - 5:00 PM (except holidays)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 text-xs text-slate-600">
                      <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Direct Contact Hotlines</p>
                        <p className="mt-0.5 font-mono">(02) 8123-4567</p>
                        <p className="font-mono">+63 912 345 6789</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 text-xs text-slate-600">
                      <div className="p-2 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Electronic Support Mail</p>
                        <p className="mt-0.5 font-mono text-blue-700 hover:underline">mswdo@municipality.gov.ph</p>
                        <p className="font-mono text-slate-500">tubungan.gov@gmail.com</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 leading-relaxed dark:bg-slate-950">
                  <strong>* Walk-In Reminder:</strong> Physical filing of requirements and card registration processes are available daily during standard office hours.
                </div>
              </div>

              {/* Map Column */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800">
                <div className="space-y-3 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 px-2 dark:text-slate-100">
                    <span className="w-1.5 h-3.5 bg-blue-700 rounded-full" /> Google Map Location - Tubungan, Iloilo
                  </h3>
                </div>
                {/* Embed Map Iframe */}
                <div className="rounded-xl overflow-hidden border border-slate-200 flex-1 min-h-[350px] relative dark:border-slate-800">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.316827670984!2d122.28919631527376!3d10.793740992309852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33ae567b4ca51cc3%3A0xc3f3454b6c31bfcf!2sTubungan%2C%20Iloilo%2C%20Philippines!5e0!3m2!1sen!2sus!4v1655123456789!5m2!1sen!2sus" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, minHeight: '350px' }} 
                    allowFullScreen={true} 
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    title="Tubungan Google Map Location"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AICS APPLICATION WIZARD */}
        {activeTab === 'apply' && (
          <div className="animate-fade-in space-y-6">
            {currentUser ? (
              <AICSApplicationForm
                currentUser={currentUser}
                onSubmitSuccess={handleApplicationSubmit}
                onCancel={() => setActiveTab('home')}
                language={language}
              />
            ) : (
              <div className="text-center py-16 bg-white border border-neutral-100 rounded-2xl shadow-xl p-8 max-w-xl mx-auto space-y-6 dark:bg-slate-900 dark:border-slate-800">
                <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert size={30} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Client Login Required</h3>
                  <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto leading-relaxed dark:text-slate-400">
                    Before you can file an official application for Assistance in Crisis Situations, you must log in or create a secured client profile.
                  </p>
                </div>

                <div className="flex items-center gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-2 border border-neutral-300 hover:border-neutral-400 text-neutral-700 rounded-lg text-xs font-bold tracking-wide transition-colors cursor-pointer dark:text-slate-300 dark:border-slate-700"
                  >
                    Login to Account
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-xs font-bold tracking-wide shadow-md shadow-blue-700/15 transition-all cursor-pointer flex items-center gap-1 dark:text-white text-slate-900"
                  >
                    Register New Account <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPLICATION TRACKING HISTORY */}
        {activeTab === 'history' && (
          <div className="animate-fade-in space-y-6">
            {currentUser ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h2 className="text-2xl font-black text-blue-600 tracking-tight dark:text-blue-400">
                      My Assistance Applications
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 dark:text-blue-400">
                      Check timeline updates and download submitted requirements.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={async () => {
                        const targetAppId = selectedAppId || (userApplications.length > 0 ? userApplications[0].id : null);
                        if (!targetAppId) {
                          showToast('No application selected.', 'info');
                          return;
                        }

                        if (confirm("Are you sure you want to cancel and delete this application? This action cannot be undone.")) {
                          const { error } = await supabase
                            .from('applications')
                            .delete()
                            .eq('id', targetAppId);
                            
                          if (error) {
                            showToast('Failed to delete application.', 'error');
                            console.error(error);
                          } else {
                            setApplications(prev => prev.filter(app => app.id !== targetAppId));
                            setSelectedAppId(null);
                            showToast('Application has been deleted successfully.', 'success');
                          }
                        }
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-xs dark:text-white text-slate-900"
                    >
                      Cancel / Delete Application
                    </button>
                    <button
                      onClick={() => setActiveTab('apply')}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow-xs dark:text-white text-slate-900"
                    >
                      + File New Request
                    </button>
                  </div>
                </div>

                <ApplicationTracker 
                  applications={userApplications} 
                  onStatusUpdate={handleStatusUpdate}
                  language={language}
                  selectedAppId={selectedAppId}
                  onSelectApp={setSelectedAppId}
                />
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-neutral-100 rounded-2xl shadow-xl p-8 max-w-xl mx-auto space-y-6 dark:bg-slate-900 dark:border-slate-800">
                <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen size={30} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Access Restricted</h3>
                  <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto leading-relaxed dark:text-slate-400">
                    Please log in or register a client profile to track previously filed social welfare assistance cases and status updates.
                  </p>
                </div>

                <div className="flex items-center gap-3 justify-center pt-2">
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-2 border border-neutral-300 hover:border-neutral-400 text-neutral-700 rounded-lg text-xs font-bold transition-all cursor-pointer dark:text-slate-300 dark:border-slate-700"
                  >
                    Login to Account
                  </button>
                  <button
                    onClick={() => {
                      setAuthModalInitialTab('register');
                      setIsAuthModalOpen(true);
                    }}
                    className="px-6 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg text-xs font-bold shadow-md shadow-blue-700/15 transition-all cursor-pointer dark:text-white text-slate-900"
                  >
                    Register New Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Interactive Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-6 px-10 text-[10px] shrink-0 dark:text-slate-400 text-slate-500 dark:bg-slate-900 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p>&copy; 2024 MSWDO Portal System. All rights reserved.</p>
            <p className="text-slate-500 uppercase tracking-wider font-semibold text-[9px]">Municipal Social Welfare & Development Office</p>
          </div>
          <div className="flex space-x-6 font-semibold dark:text-slate-400 text-slate-500">
            <span>Security: SSL Encrypted</span>
            <span>Version 2.4.1</span>
          </div>
        </div>
      </footer>

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialTab={authModalInitialTab}
      />
    </div>
  );
}
