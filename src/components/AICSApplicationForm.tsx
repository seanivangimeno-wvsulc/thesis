import React, { useState, useEffect } from 'react';
import { User, AICSApplication, HouseholdMember, UploadedRequirement, AssistanceType } from '../types';
import { 
  FileText, Users, UploadCloud, CheckCircle2, ClipboardCheck, 
  Trash2, Plus, ArrowLeft, ArrowRight, Eye, ShieldAlert, FileType, Check, X 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AICSApplicationFormProps {
  currentUser: User;
  onSubmitSuccess: (application: AICSApplication) => void;
  onCancel: () => void;
  language?: 'en' | 'fil';
}

const FORM_TRANSLATIONS = {
  en: {
    step: "Step",
    of: "of",
    applyingAs: "Applying as",
    category: "Category",
    household: "Household",
    documents: "Documents",
    verify: "Verify",
    aicsApp: "AICS Assistance Application",
    assistanceRequiredTitle: "1. Select the Type of Assistance Required",
    assistanceRequiredDesc: "Choose the program that best matches your immediate crisis. You will need to upload specific supporting files based on this selection.",
    explainEmergency: "2. Explain Your Emergency / Reason for Request *",
    explainEmergencyDesc: "Provide a detailed description of the crisis or emergency situation. Describe why your family requires immediate support. (Minimum 20 characters)",
    explainPlaceholder: "Describe what happened, current health/medical condition, school requirements, or financial distress. Please be precise so social workers can evaluate your case fairly.",
    charMin: "characters (min 20)",
    householdTitle: "Household Composition & Income",
    householdDesc: "Add the members of your immediate household (spouse, children, parents, dependents living under your roof) and their respective occupations or sources of income.",
    fullName: "Full Name",
    age: "Age",
    relationship: "Relationship",
    occupation: "Occupation",
    monthlyIncome: "Monthly Income (₱)",
    addMember: "Add Household Member",
    nameTh: "Name",
    ageTh: "Age",
    relTh: "Relationship",
    occTh: "Occupation",
    incTh: "Monthly Income",
    actionTh: "Action",
    noFamily: "No family members registered. Please add yourself and your family/dependents above. (Minimum 1 required)",
    totalInc: "Total Household Income:",
    perMonth: "/ month",
    digDocTitle: "Digital Document Requirements for",
    digDocDesc: "To complete your online application, please upload high-resolution photos or scanned PDFs of the following documents. Max size 5MB per file.",
    chooseFile: "Choose File",
    uploadBtn: "Upload File",
    successUploaded: "Successfully Uploaded",
    pendingDigSub: "Pending digital submission. Please click 'Choose File' to upload.",
    preview: "View",
    remove: "Remove",
    cancel: "Cancel Application",
    next: "Next Step",
    back: "Back",
    submit: "Submit Application",
    reviewTitle: "Review Your Complete Application",
    reviewDesc: "Please double-check all details below before final submission. Once submitted, your application will undergo formal evaluation.",
    applicantNameLabel: "Applicant Name",
    assistanceProgramLabel: "Assistance Program",
    phoneLabel: "Phone Number",
    addressLabel: "Residential Address",
    reasonLabel: "Reason / Justification",
    summaryLabel: "Household & Financial Summary",
    memberCol: "Family Member",
    relCol: "Relationship",
    incCol: "Income",
    docsSubbedLabel: "Digital Documents Submitted",
    legalDeclTitle: "Legal Declaration & Consent:",
    legalDeclText: "By clicking Submit Application, I hereby declare that all the information I have written here is true, and the files uploaded are authentic copies. I understand that any false declarations may result in the denial of this and future requests.",
    clientRequired: "Client Login Required",
    accessRestricted: "Access Restricted",
    closePreview: "Close Preview",
    viewFileBtn: "View File",
    downloadPdf: "Download PDF to View",
    pdfUploaded: "Uploaded PDF File",
    missingUploadErr: "Please upload all required digital documents before continuing. Missing:",
    justificationErr: "Please explain your situation/justification in more detail (minimum 20 characters). This is required for review.",
    householdErr: "Please add at least one household member (including yourself or dependents) to reflect household composition.",
    addMemberErr: "Please provide Name, Age, and Relationship to add a member."
  },
  fil: {
    step: "Hakbang",
    of: "ng",
    applyingAs: "Nag-aaplay bilang",
    category: "Kategorya",
    household: "Sambahayan",
    documents: "Dokumento",
    verify: "Suriin",
    aicsApp: "Aplikasyon para sa Tulong ng AICS",
    assistanceRequiredTitle: "1. Piliin ang Uri ng Tulong na Kailangan",
    assistanceRequiredDesc: "Piliin ang programang pinaka-angkop sa inyong kasalukuyang krisis. Kakailanganin mong mag-upload ng mga sumusuportang dokumento batay dito.",
    explainEmergency: "2. Ipaliwanag ang Inyong Emerhensya / Dahilan ng Kahilingan *",
    explainEmergencyDesc: "Magbigay ng detalyadong paglalarawan ng krisis o sitwasyon ng emerhensya. Ipaliwanag kung bakit nangangailangan ng agarang tulong ang inyong pamilya (Hindi bababa sa 20 karakter).",
    explainPlaceholder: "Ilarawan ang nangyari, kasalukuyang kalagayan ng kalusugan, pangangailangan sa paaralan, o pinansyal na kagipitan. Maging tiyak upang masuri nang patas ng mga social worker ang inyong kaso.",
    charMin: "karakter (min 20)",
    householdTitle: "Komposisyon ng Sambahayan at Kita",
    householdDesc: "Idagdag ang mga miyembro ng inyong kasalukuyang sambahayan (asawa, mga anak, magulang, o mga dependent na kasama sa bahay) at ang kanilang trabaho o kita.",
    fullName: "Buong Pangalan",
    age: "Edad",
    relationship: "Relasyon",
    occupation: "Trabaho",
    monthlyIncome: "Buwanang Kita (₱)",
    addMember: "Idagdag ang Miyembro ng Pamilya",
    nameTh: "Pangalan",
    ageTh: "Edad",
    relTh: "Relasyon",
    occTh: "Trabaho",
    incTh: "Buwanang Kita",
    actionTh: "Aksyon",
    noFamily: "Walang nakatalang miyembro ng pamilya. Mangyaring idagdag ang inyong sarili at pamilya sa itaas. (Kailangan ng kahit isa)",
    totalInc: "Kabuuang Kita ng Sambahayan:",
    perMonth: "/ buwan",
    digDocTitle: "Mga Kailangang Digital na Dokumento para sa Tulong na",
    digDocDesc: "Upang makumpleto ang inyong online na aplikasyon, mag-upload ng malilinaw na larawan o PDF scan ng mga sumusunod na dokumento. Hanggang 5MB bawat file.",
    chooseFile: "Pumili ng File",
    uploadBtn: "I-upload ang File",
    successUploaded: "Matagumpay na Na-upload",
    pendingDigSub: "Naghihintay ng pag-upload. I-click ang 'Pumili ng File' upang mag-upload.",
    preview: "Silipin",
    remove: "Alisin",
    cancel: "I-cancel ang Aplikasyon",
    next: "Susunod na Hakbang",
    back: "Bumalik",
    submit: "Ipadala ang Aplikasyon",
    reviewTitle: "Suriin ang Inyong Buong Aplikasyon",
    reviewDesc: "Mangyaring i-double check ang lahat ng mga detalye sa ibaba bago tuluyang isumite. Pagkatapos maisumite, dadaan ang inyong aplikasyon sa pagsusuri.",
    applicantNameLabel: "Pangalan ng Aplikante",
    assistanceProgramLabel: "Programa ng Tulong",
    phoneLabel: "Numero ng Telepono",
    addressLabel: "Tirahan / Address",
    reasonLabel: "Dahilan / Hustipikasyon",
    summaryLabel: "Komposisyon at Kita ng Sambahayan",
    memberCol: "Miyembro ng Pamilya",
    relCol: "Relasyon",
    incCol: "Kita",
    docsSubbedLabel: "Mga Isinumiteng Digital na Dokumento",
    legalDeclTitle: "Legal na Deklarasyon at Pahintulot:",
    legalDeclText: "Sa pag-click sa Ipadala ang Aplikasyon, pinatutunayan ko na ang lahat ng impormasyong isinulat ko rito ay totoo, at ang mga file na na-upload ay tunay na mga kopya. Nauunawaan ko na ang anumang maling deklarasyon ay maaaring maging dahilan ng pagtanggi sa hiling na ito o sa hinaharap.",
    clientRequired: "Kailangan ang Client Login",
    accessRestricted: "Nalilimitahan ang Akses",
    closePreview: "Isara ang Silip",
    viewFileBtn: "Silipin ang File",
    downloadPdf: "I-download ang PDF upang Silipin",
    pdfUploaded: "Na-upload na PDF File",
    missingUploadErr: "Mangyaring i-upload ang lahat ng kailangang digital na dokumento bago magpatuloy. Kulang:",
    justificationErr: "Mangyaring ipaliwanag nang mas detalyado ang inyong sitwasyon/dahilan (hindi bababa sa 20 karakter). Ito ay kailangan sa pagsusuri.",
    householdErr: "Mangyaring magdagdag ng kahit isang miyembro ng pamilya (kasama ang inyong sarili o mga dependent) upang makita ang buong pamilya.",
    addMemberErr: "Mangyaring ilagay ang Pangalan, Edad, at Relasyon upang maidagdag ang miyembro."
  }
};

const ASSISTANCE_TYPES = (lang: 'en' | 'fil'): { type: AssistanceType; label: string; description: string }[] => [
  { 
    type: 'Medical', 
    label: lang === 'en' ? 'Medical Assistance' : 'Tulong Medikal', 
    description: lang === 'en' 
      ? 'For hospital bills, laboratory tests, dialysis, chemotherapy, and prescription medicines.'
      : 'Para sa mga bayarin sa ospital, laboratoryo, dialysis, chemotherapy, at mga inireresetang gamot.'
  },
  { 
    type: 'Funeral', 
    label: lang === 'en' ? 'Funeral & Burial Assistance' : 'Tulong sa Libing at Pagpapalibing', 
    description: lang === 'en'
      ? 'For coffin purchase, burial services, embalming, and other related mortuary expenses.'
      : 'Para sa kabaong, serbisyo sa libing, embalming, at iba pang kaugnay na gastos.'
  },
  { 
    type: 'Food', 
    label: lang === 'en' ? 'Food Assistance' : 'Tulong sa Pagkain', 
    description: lang === 'en'
      ? 'For immediate hot meals, grocery packs, or nutritional milk supplies for families in crisis.'
      : 'Para sa mga agarang lutong pagkain, grocery packs, o gatas para sa mga pamilyang nasa krisis.'
  },
  { 
    type: 'Educational', 
    label: lang === 'en' ? 'Educational Assistance' : 'Tulong sa Edukasyon', 
    description: lang === 'en'
      ? 'For public school and college students to cover tuition fees, school uniforms, and learning materials.'
      : 'Para sa mga mag-aaral sa pampublikong paaralan at kolehiyo para sa tuition, uniporme, at kagamitan.'
  },
  { 
    type: 'Transportation', 
    label: lang === 'en' ? 'Transportation Assistance' : 'Tulong sa Transportasyon', 
    description: lang === 'en'
      ? 'For stranded individuals or families needing emergency fare to return home to provinces.'
      : 'Para sa mga stranded na indibidwal o pamilya na nangangailangan ng pamasahe pauwi sa probinsya.'
  },
  { 
    type: 'Financial', 
    label: lang === 'en' ? 'Direct Financial Assistance' : 'Direktang Tulong Pinansyal', 
    description: lang === 'en'
      ? 'Emergency cash grants for indigent families facing sudden severe hardships.'
      : 'Emerhensiyang tulong pinansyal para sa mga pamilyang lubos na naghihikahos dahil sa biglaang pagsubok.'
  }
];

const getRequiredDocsForType = (type: AssistanceType, lang: 'en' | 'fil'): string[] => {
  const baseDocs = lang === 'en' ? [
    'Barangay Certificate of Indigency (Purpose: MSWDO Assistance)',
    'Valid Government-issued ID of Applicant (Front & Back)'
  ] : [
    'Sertipiko ng Indigency mula sa Barangay (Para sa MSWDO)',
    'Valid Government ID ng Aplikante (Harap at Likod)'
  ];

  switch (type) {
    case 'Medical':
      return lang === 'en' 
        ? [...baseDocs, 'Clinical Abstract or Medical Certificate', 'Medicine Prescription or Hospital Billing Statement']
        : [...baseDocs, 'Clinical Abstract o Sertipikong Medikal mula sa Doktor', 'Reseta ng Gamot o Hospital Billing Statement'];
    case 'Funeral':
      return lang === 'en'
        ? [...baseDocs, 'Death Certificate (Certified True Copy)', 'Funeral Service Contract']
        : [...baseDocs, 'Death Certificate ng Yumao (Certified True Copy)', 'Kontrata sa Serbisyo ng Libing'];
    case 'Educational':
      return lang === 'en'
        ? [...baseDocs, 'Certificate of Enrollment or School assessment form', 'Recent Report Card or Study Load']
        : [...baseDocs, 'Sertipiko ng Pagpapatala o School Assessment Form', 'Kamakailang Report Card o Study Load'];
    case 'Transportation':
      return lang === 'en'
        ? [...baseDocs, 'Referral Letter / Police Blotter (if stranded due to crime)', 'Travel Pass / ID of relatives in destination province']
        : [...baseDocs, 'Referral Letter / Police Blotter (kung stranded dahil sa krimen)', 'Travel Pass / ID ng mga kamag-anak sa pupuntahan'];
    default:
      return baseDocs;
  }
};

export default function AICSApplicationForm({ currentUser, onSubmitSuccess, onCancel, language = 'en' }: AICSApplicationFormProps) {
  const t = FORM_TRANSLATIONS[language];
  const [step, setStep] = useState<number>(1);
  const [error, setError] = useState<string>('');

  // Step 1: Assistance Category & Reason
  const [assistanceType, setAssistanceType] = useState<AssistanceType>('Medical');
  const [justification, setJustification] = useState<string>('');

  // Step 2: Household Members
  const [householdMembers, setHouseholdMembers] = useState<HouseholdMember[]>([]);
  const [memberName, setMemberName] = useState('');
  const [memberAge, setMemberAge] = useState<number | ''>('');
  const [memberRelationship, setMemberRelationship] = useState('');
  const [memberOccupation, setMemberOccupation] = useState('');
  const [memberIncome, setMemberIncome] = useState<number | ''>('');

  // Step 3: Documents
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, UploadedRequirement>>({});
  const [previewDoc, setPreviewDoc] = useState<UploadedRequirement | null>(null);

  // Load draft from localStorage on mount based on user identity
  useEffect(() => {
    const savedDraft = localStorage.getItem(`mswdo_draft_form_${currentUser.id}`);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.assistanceType) setAssistanceType(parsed.assistanceType);
        if (parsed.justification) setJustification(parsed.justification);
        if (parsed.householdMembers) setHouseholdMembers(parsed.householdMembers);
      } catch (e) {
        console.error('Failed to parse draft form data:', e);
      }
    }
  }, [currentUser.id]);

  // Save draft to localStorage when states change
  useEffect(() => {
    const draft = {
      assistanceType,
      justification,
      householdMembers
    };
    localStorage.setItem(`mswdo_draft_form_${currentUser.id}`, JSON.stringify(draft));
  }, [assistanceType, justification, householdMembers, currentUser.id]);

  // Dynamic document requirements list based on selection
  const activeRequirements = getRequiredDocsForType(assistanceType, language);

  const handleAddHouseholdMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName || !memberAge || !memberRelationship) {
      setError(t.addMemberErr);
      return;
    }

    const newMember: HouseholdMember = {
      name: memberName,
      age: Number(memberAge),
      relationship: memberRelationship,
      occupation: memberOccupation || (language === 'en' ? 'None / Unemployed' : 'Walang Trabaho'),
      monthlyIncome: memberIncome ? Number(memberIncome) : 0
    };

    setHouseholdMembers([...householdMembers, newMember]);
    
    // Clear inputs
    setMemberName('');
    setMemberAge('');
    setMemberRelationship('');
    setMemberOccupation('');
    setMemberIncome('');
    setError('');
  };

  const handleRemoveHouseholdMember = (index: number) => {
    setHouseholdMembers(householdMembers.filter((_, i) => i !== index));
  };

  const handleFileUpload = (reqName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target && event.target.result) {
        const base64Data = event.target.result as string;
        
        const newDoc: UploadedRequirement = {
          id: 'doc_' + Math.random().toString(36).substr(2, 9),
          requirementName: reqName,
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          fileType: file.type,
          fileData: base64Data,
          uploadedAt: new Date().toLocaleString()
        };

        setUploadedDocs(prev => ({
          ...prev,
          [reqName]: newDoc
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveUploadedDoc = (reqName: string) => {
    setUploadedDocs(prev => {
      const updated = { ...prev };
      delete updated[reqName];
      return updated;
    });
  };

  const validateStep = (currentStep: number): boolean => {
    setError('');
    
    if (currentStep === 1) {
      if (!justification.trim() || justification.trim().length < 20) {
        setError(t.justificationErr);
        return false;
      }
    }

    if (currentStep === 2) {
      if (householdMembers.length === 0) {
        setError(t.householdErr);
        return false;
      }
    }

    if (currentStep === 3) {
      // All active requirements must be uploaded
      const missing = activeRequirements.filter(req => !uploadedDocs[req]);
      if (missing.length > 0) {
        setError(`${t.missingUploadErr} "${missing[0]}"`);
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmitApplication = async () => {
    if (!validateStep(3)) return;

    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    const controlNumber = `AICS-${year}-${rand}`;

    const newApplication = {
      id: 'app_' + Math.random().toString(36).substr(2, 9),
      user_id: currentUser.id,
      applicant_name: currentUser.name,
      applicant_email: currentUser.email,
      applicant_phone: currentUser.phone,
      assistance_type: assistanceType,
      justification,
      household_members: householdMembers,
      documents: Object.values(uploadedDocs),
      status: 'Pending Review',
      submission_date: new Date().toISOString(),
      control_number: controlNumber
    };

    const { error: insertError } = await supabase
      .from('applications')
      .insert([newApplication]);

    if (insertError) {
      console.error('Failed to submit application to Supabase:', insertError);
      setError('Failed to submit application. Please try again.');
      return;
    }

    const returnedApp: AICSApplication = {
      id: newApplication.id,
      userId: newApplication.user_id,
      applicantName: newApplication.applicant_name,
      applicantEmail: newApplication.applicant_email,
      applicantPhone: newApplication.applicant_phone,
      assistanceType: newApplication.assistance_type as AssistanceType,
      justification: newApplication.justification,
      householdMembers: newApplication.household_members,
      documents: newApplication.documents,
      status: newApplication.status as AICSApplication['status'],
      submissionDate: newApplication.submission_date,
      controlNumber: newApplication.control_number
    };

    localStorage.removeItem(`mswdo_draft_form_${currentUser.id}`);
    onSubmitSuccess(returnedApp);
  };

  const stepLabels = [
    { label: t.category, icon: FileText },
    { label: t.household, icon: Users },
    { label: t.documents, icon: UploadCloud },
    { label: t.verify, icon: ClipboardCheck }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto">
      {/* Top Gradient Banner */}
      <div className="h-2 bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-900"></div>

      {/* Form Header */}
      <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold text-blue-750 dark:text-blue-400 uppercase tracking-widest bg-blue-500/10 dark:bg-blue-500/5 px-2.5 py-1 rounded-md">
            {t.step} {step} {t.of} 4
          </span>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-3 uppercase tracking-tight">
            {t.aicsApp}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.applyingAs}: <strong className="text-slate-800 dark:text-slate-200">{currentUser.name}</strong> ({currentUser.phone})
          </p>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-1.5 self-center">
          {stepLabels.map((item, idx) => {
            const stepNum = idx + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;
            return (
              <React.Fragment key={stepNum}>
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border transition-all ${
                    isCompleted 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' 
                      : isActive 
                        ? 'bg-blue-700 border-blue-700 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-800 border-neutral-200 dark:border-slate-700 text-neutral-400 dark:text-neutral-500'
                  }`}>
                    {isCompleted ? <Check size={14} strokeWidth={3} /> : stepNum}
                  </div>
                  <span className={`text-[9px] font-bold mt-1.5 hidden md:block uppercase tracking-wider ${isActive ? 'text-blue-600 dark:text-blue-400 font-extrabold' : isCompleted ? 'text-emerald-500' : 'text-neutral-400'}`}>
                    {item.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`h-0.5 w-6 md:w-12 -mt-4 hidden md:block ${step > stepNum ? 'bg-emerald-500' : 'bg-neutral-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Form Fields Panel */}
      <div className="p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border-l-4 border-rose-500 text-rose-800 dark:text-rose-300 text-xs md:text-sm font-medium rounded-r-lg flex items-start gap-3">
            <ShieldAlert className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" size={18} />
            <div>{error}</div>
          </div>
        )}

        {/* STEP 1: CATEGORY SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {t.assistanceRequiredTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.assistanceRequiredDesc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {ASSISTANCE_TYPES(language).map((item) => {
                  const isSelected = assistanceType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        setAssistanceType(item.type);
                        setError('');
                      }}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-700 bg-blue-550/10 dark:bg-blue-500/10 ring-1 ring-blue-700'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`font-bold text-xs md:text-sm uppercase tracking-tight ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'}`}>
                          {item.label}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-blue-700 bg-blue-700' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 uppercase tracking-wide">
                {t.explainEmergency}
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                {t.explainEmergencyDesc}
              </p>
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                placeholder={t.explainPlaceholder}
                rows={5}
                className="w-full p-4 text-xs md:text-sm border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 bg-white dark:bg-slate-950/20 text-slate-800 dark:text-slate-100 transition-all leading-relaxed"
                required
              ></textarea>
              <div className="text-right text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 font-mono">
                {justification.length} {t.charMin}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: HOUSEHOLD COMPOSITION */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {t.householdTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.householdDesc}
              </p>
            </div>

            {/* Add Member Form */}
            <form onSubmit={handleAddHouseholdMember} className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/55 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Maria Dela Cruz"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t.age}
                </label>
                <input
                  type="number"
                  value={memberAge}
                  onChange={(e) => setMemberAge(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 25"
                  min={0}
                  max={120}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t.relationship}
                </label>
                <input
                  type="text"
                  value={memberRelationship}
                  onChange={(e) => setMemberRelationship(e.target.value)}
                  placeholder="e.g. Spouse"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t.occupation}
                </label>
                <input
                  type="text"
                  value={memberOccupation}
                  onChange={(e) => setMemberOccupation(e.target.value)}
                  placeholder="e.g. Farmer"
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  {t.monthlyIncome}
                </label>
                <input
                  type="number"
                  value={memberIncome}
                  onChange={(e) => setMemberIncome(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="0"
                  min={0}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div className="md:col-span-5 flex justify-end mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={14} /> {t.addMember}
                </button>
              </div>
            </form>

            {/* Household Members List */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950/20">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="p-3.5 pl-4">{t.nameTh}</th>
                      <th className="p-3.5">{t.ageTh}</th>
                      <th className="p-3.5">{t.relTh}</th>
                      <th className="p-3.5">{t.occTh}</th>
                      <th className="p-3.5 text-right">{t.incTh}</th>
                      <th className="p-3.5 pr-4 text-center">{t.actionTh}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    {householdMembers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50/10">
                          {t.noFamily}
                        </td>
                      </tr>
                    ) : (
                      householdMembers.map((member, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                          <td className="p-3.5 pl-4 font-bold text-slate-900 dark:text-white">{member.name}</td>
                          <td className="p-3.5">{member.age} yrs old</td>
                          <td className="p-3.5">{member.relationship}</td>
                          <td className="p-3.5">{member.occupation}</td>
                          <td className="p-3.5 text-right font-mono font-semibold text-slate-900 dark:text-slate-100">
                            ₱{member.monthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-3.5 pr-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveHouseholdMember(idx)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all"
                              title="Remove Member"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {householdMembers.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex justify-between items-center text-xs md:text-sm font-semibold border border-slate-150 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">{t.totalInc}</span>
                <span className="font-black text-slate-950 dark:text-white text-base font-mono">
                  ₱{householdMembers.reduce((sum, m) => sum + m.monthlyIncome, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} {t.perMonth}
                </span>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: DOCUMENT UPLOAD */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {t.digDocTitle} {assistanceType}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.digDocDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activeRequirements.map((reqName) => {
                const uploadedFile = uploadedDocs[reqName];
                return (
                  <div 
                    key={reqName} 
                    className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      uploadedFile 
                        ? 'border-emerald-200 dark:border-emerald-900/50 bg-emerald-500/5' 
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-900/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl shrink-0 ${uploadedFile ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                        <FileType size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs md:text-sm font-bold text-slate-900 dark:text-white leading-tight truncate">
                          {reqName}
                        </h4>
                        {uploadedFile ? (
                          <p className="text-[10px] md:text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
                            <CheckCircle2 size={12} /> {t.successUploaded}: {uploadedFile.fileName} ({uploadedFile.fileSize})
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                            {t.pendingDigSub}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {uploadedFile ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(uploadedFile)}
                            className="px-3 py-1.5 border border-slate-250 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg flex items-center gap-1 bg-white dark:bg-slate-900 cursor-pointer"
                          >
                            <Eye size={13} /> {t.preview}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveUploadedDoc(reqName)}
                            className="p-1.5 hover:bg-rose-500/10 text-rose-500 hover:text-rose-600 rounded-lg transition-all border border-transparent hover:border-rose-250 cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      ) : (
                        <label className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs transition-all">
                          <UploadCloud size={14} /> {t.chooseFile}
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => handleFileUpload(reqName, e)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: VERIFY AND SUBMIT */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {t.reviewTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.reviewDesc}
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-850 bg-slate-50 dark:bg-slate-950/40 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.applicantNameLabel}</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-1">{currentUser.name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.assistanceProgramLabel}</span>
                  <span className="font-black text-blue-700 dark:text-blue-450 block mt-1">{assistanceType} Assistance</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.phoneLabel}</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-1">{currentUser.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.addressLabel}</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-1">{currentUser.address}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">{t.reasonLabel}</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-150 dark:border-slate-800/80 italic">
                  &ldquo;{justification}&rdquo;
                </p>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{t.summaryLabel}</span>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-150 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        <th className="p-2.5 pl-3">{t.memberCol}</th>
                        <th className="p-2.5">{t.relCol}</th>
                        <th className="p-2.5 text-right pr-3">{t.incCol}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {householdMembers.map((m, i) => (
                        <tr key={i} className="border-b last:border-0 border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300">
                          <td className="p-2.5 pl-3 font-semibold text-slate-850 dark:text-white">{m.name} ({m.age} yrs)</td>
                          <td className="p-2.5">{m.relationship}</td>
                          <td className="p-2.5 text-right pr-3 font-mono font-bold text-slate-900 dark:text-slate-200">₱{m.monthlyIncome.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{t.docsSubbedLabel}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.values(uploadedDocs) as UploadedRequirement[]).map((doc) => (
                    <div key={doc.id} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="truncate max-w-[180px] font-bold text-slate-800 dark:text-slate-300" title={doc.requirementName}>
                        {doc.requirementName}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 font-bold flex items-center gap-0.5 text-[11px] cursor-pointer"
                      >
                        <Eye size={12} /> {t.viewFileBtn}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-955/15 rounded-2xl border border-amber-200/60 dark:border-amber-900/30 flex items-start gap-3">
              <ShieldAlert className="shrink-0 text-amber-650 dark:text-amber-400 mt-0.5" size={18} />
              <div className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                <strong className="font-extrabold block mb-1 uppercase tracking-wide text-amber-950 dark:text-amber-200">{t.legalDeclTitle}</strong>
                {t.legalDeclText}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="p-6 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs md:text-sm rounded-xl bg-white dark:bg-slate-900 flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft size={16} /> {t.back}
          </button>
        ) : (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-xs md:text-sm rounded-xl transition-all cursor-pointer"
          >
            {t.cancel}
          </button>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs md:text-sm rounded-xl flex items-center gap-2 shadow-md shadow-blue-700/10 transition-all cursor-pointer"
          >
            {t.next} <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitApplication}
            className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs md:text-sm rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer uppercase tracking-wider"
          >
            <CheckCircle2 size={16} /> {t.submit}
          </button>
        )}
      </div>

      {/* Document Quick Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-950/80 flex items-center justify-center p-4 z-[60] backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{previewDoc.requirementName}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{previewDoc.fileName} • {previewDoc.fileSize}</p>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex justify-center bg-slate-950 max-h-[60vh] overflow-auto">
              {previewDoc.fileType.startsWith('image/') ? (
                <img 
                  src={previewDoc.fileData} 
                  alt={previewDoc.requirementName} 
                  className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-lg border border-white/5"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-center text-white py-12 flex flex-col items-center gap-3">
                  <FileType size={48} className="text-slate-400" />
                  <p className="text-sm font-bold">{t.pdfUploaded}</p>
                  <a 
                    href={previewDoc.fileData} 
                    download={previewDoc.fileName}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition-colors"
                  >
                    {t.downloadPdf}
                  </a>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 hover:bg-slate-850 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                {t.closePreview}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
