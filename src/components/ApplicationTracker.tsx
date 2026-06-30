import React, { useState } from 'react';
import { AICSApplication, UploadedRequirement } from '../types/types';
import { 
  FileCheck, Calendar, Phone, Mail, MapPin, Eye, FileText, CheckCircle2, 
  Clock, AlertCircle, RefreshCw, X, ArrowUpRight, HelpCircle, UserCheck
} from 'lucide-react';

interface ApplicationTrackerProps {
  applications: AICSApplication[];
  onStatusUpdate: (appId: string, newStatus: AICSApplication['status'], notes?: string) => void;
  language?: 'en' | 'fil';
  selectedAppId?: string | null;
  onSelectApp?: (appId: string | null) => void;
}

const TRACKER_TRANSLATIONS = {
  en: {
    noApps: "No Applications Filed Yet",
    noAppsDesc: "You do not have any submitted AICS applications under this profile. Click the 'Apply for AICS' button above to begin filing.",
    submittedRequests: "Your Submitted Requests",
    controlNumber: "CONTROL NUMBER",
    caseFile: "AICS Case File",
    filedOn: "Filed on",
    viewDetails: "View Details",
    currentStatus: "Current Status",
    timelineTitle: "Application Processing Timeline",
    caseworkerRemark: "Social Worker Remark:",
    disapprovedTitle: "Application Disapproved",
    disapprovedDesc: "This application did not meet the guidelines for Assistance in Crisis Situations. Please consult with the local MSWDO desk.",
    applicantProfile: "Applicant Profile",
    nameLabel: "Name:",
    emailLabel: "Email:",
    contactNumberLabel: "Contact Number:",
    householdTitle: "Household Structure",
    nameTh: "Name",
    relTh: "Relationship",
    ageTh: "Age",
    occTh: "Occupation",
    incTh: "Monthly Income",
    submittedDocs: "Submitted Digital Documents",
    viewFileBtn: "View File",
    sandboxTitle: "Reviewer / Social Worker Sandbox Simulation",
    sandboxDesc: "MSWDO officers can alter the client status here to inspect different application stages.",
    updateBtn: "Update",
    addNotePlaceholder: "Add caseworker note...",
    selectAppPrompt: "Please select an application from the list to view its details.",
    closePreview: "Close Preview",
    downloadPdf: "Download PDF to View",
    pdfFileUploaded: "Uploaded PDF File",
    statusPending: "Pending Review",
    statusDocs: "Document Verification",
    statusInterview: "Interview Scheduled",
    statusApproved: "Approved",
    statusCompleted: "Completed",
    statusRejected: "Rejected"
  },
  fil: {
    noApps: "Walang Isinumiteng Aplikasyon",
    noAppsDesc: "Wala kang isinumiteng aplikasyon para sa AICS sa profile na ito. I-click ang button na 'Apply para sa AICS' sa itaas upang magsimula.",
    submittedRequests: "Inyong mga Isinumiteng Kahilingan",
    controlNumber: "CONTROL NUMBER",
    caseFile: "Dokumento ng Kaso ng AICS",
    filedOn: "Isinumite noong",
    viewDetails: "Silipin ang Detalye",
    currentStatus: "Kasalukuyang Status",
    timelineTitle: "Timeline ng Pagproseso ng Aplikasyon",
    caseworkerRemark: "Tala ng Social Worker:",
    disapprovedTitle: "Hindi Inaprubahan ang Aplikasyon",
    disapprovedDesc: "Hindi umabot ang aplikasyong ito sa mga alituntunin para sa Assistance in Crisis Situations. Mangyaring kumonsulta sa MSWDO desk.",
    applicantProfile: "Profile ng Aplikante",
    nameLabel: "Pangalan:",
    emailLabel: "Email:",
    contactNumberLabel: "Numero ng Telepono:",
    householdTitle: "Komposisyon ng Sambahayan",
    nameTh: "Pangalan",
    relTh: "Relasyon",
    ageTh: "Edad",
    occTh: "Trabaho",
    incTh: "Buwanang Kita",
    submittedDocs: "Mga Isinumiteng Digital na Dokumento",
    viewFileBtn: "Silipin ang File",
    sandboxTitle: "Sandbox Simulation para sa Social Worker",
    sandboxDesc: "Maaaring baguhin ng mga MSWDO officer ang status ng aplikasyon dito para sa pagsusuri.",
    updateBtn: "I-update",
    addNotePlaceholder: "Magdagdag ng tala ng caseworker...",
    selectAppPrompt: "Mangyaring pumili ng aplikasyon sa listahan upang makita ang detalye nito.",
    closePreview: "Isara ang Silip",
    downloadPdf: "I-download ang PDF upang Silipin",
    pdfFileUploaded: "Na-upload na PDF File",
    statusPending: "Nakabinbing Pagsusuri",
    statusDocs: "Pagpapatunay ng Dokumento",
    statusInterview: "Nakatakdang Panayam",
    statusApproved: "Inaprubahan",
    statusCompleted: "Kumpleto Na",
    statusRejected: "Tinanggihan"
  }
};

export default function ApplicationTracker({ applications, onStatusUpdate, language = 'en', selectedAppId: propSelectedAppId, onSelectApp }: ApplicationTrackerProps) {
  const t = TRACKER_TRANSLATIONS[language];
  const [localSelectedAppId, setLocalSelectedAppId] = useState<string | null>(
    applications.length > 0 ? applications[0].id : null
  );

  const selectedAppId = propSelectedAppId !== undefined ? propSelectedAppId : localSelectedAppId;
  const setSelectedAppId = onSelectApp || setLocalSelectedAppId;

  const [previewDoc, setPreviewDoc] = useState<UploadedRequirement | null>(null);
  
  // Simulation panel helper state
  const [simStatus, setSimStatus] = useState<AICSApplication['status']>('Document Verification');
  const [simNotes, setSimNotes] = useState('');

  // Auto select first application if active selection goes null/missing
  const activeAppId = selectedAppId || (applications.length > 0 ? applications[0].id : null);
  const activeApp = applications.find(a => a.id === activeAppId);

  if (applications.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto shadow-xl">
        <div className="w-16 h-16 bg-neutral-100 dark:bg-slate-800 text-neutral-400 dark:text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">{t.noApps}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
          {t.noAppsDesc}
        </p>
      </div>
    );
  }

  // Localized status names
  const getLocalizedStatus = (status: AICSApplication['status']) => {
    switch (status) {
      case 'Pending Review': return t.statusPending;
      case 'Document Verification': return t.statusDocs;
      case 'Interview Scheduled': return t.statusInterview;
      case 'Approved': return t.statusApproved;
      case 'Completed': return t.statusCompleted;
      case 'Rejected': return t.statusRejected;
      default: return status;
    }
  };

  // Helper to color-code status badges
  const getStatusStyle = (status: AICSApplication['status']) => {
    switch (status) {
      case 'Pending Review':
        return { bg: 'bg-transparent text-blue-600 dark:text-blue-400 border-blue-500/25', dot: 'bg-blue-500' };
      case 'Document Verification':
        return { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25', dot: 'bg-blue-500' };
      case 'Interview Scheduled':
        return { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25', dot: 'bg-purple-500' };
      case 'Approved':
        return { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25', dot: 'bg-emerald-500' };
      case 'Completed':
        return { bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/25', dot: 'bg-slate-500' };
      case 'Rejected':
        return { bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25', dot: 'bg-rose-500' };
    }
  };

  const getStatusStepIndex = (status: AICSApplication['status']) => {
    switch (status) {
      case 'Pending Review': return 0;
      case 'Document Verification': return 1;
      case 'Interview Scheduled': return 2;
      case 'Approved': return 3;
      case 'Completed': return 4;
      default: return -1;
    }
  };

  const timelineSteps = [
    { title: language === 'en' ? 'Application Filed' : 'Ipinadala ang Aplikasyon', desc: language === 'en' ? 'Received online and queued.' : 'Natanggap na online.' },
    { title: language === 'en' ? 'Docs Verification' : 'Pagpapatunay ng Dokumento', desc: language === 'en' ? 'Verifying legal certificates.' : 'Sinusuri ang mga kopya.' },
    { title: language === 'en' ? 'Interview & Evaluation' : 'Panayam at Pagsusuri', desc: language === 'en' ? 'Case study report review.' : 'Pagsusuri ng kaso.' },
    { title: language === 'en' ? 'Approved' : 'Inaprubahan', desc: language === 'en' ? 'Request cleared for payout.' : 'Handa na para sa abuloy.' },
    { title: language === 'en' ? 'Completed' : 'Kumpleto Na', desc: language === 'en' ? 'Financial support released.' : 'Nailabas na ang pondo.' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-start text-slate-800 dark:text-slate-100">
      {/* Applications Sidebar List */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="font-extrabold text-blue-600 dark:text-blue-400 text-xs uppercase tracking-wider mb-1">
          {t.submittedRequests} ({applications.length})
        </h3>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
          {applications.map((app) => {
            const isSelected = app.id === activeAppId;
            const statusStyle = getStatusStyle(app.status);
            return (
              <button
                key={app.id}
                onClick={() => setSelectedAppId(app.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-700 dark:border-blue-500 bg-blue-500/5 ring-1 ring-blue-700 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/20'
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    {app.controlNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${statusStyle.bg}`}>
                    {getLocalizedStatus(app.status)}
                  </span>
                </div>
                
                <h4 className="font-bold text-xs md:text-sm text-blue-600 dark:text-blue-400 mt-2 uppercase tracking-tight">
                  {app.assistanceType} Assistance
                </h4>

                <div className="flex items-center justify-between text-[10px] text-blue-600 dark:text-blue-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar size={12} />
                    {new Date(app.submissionDate).toLocaleDateString()}
                  </span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-0.5">
                    {t.viewDetails} <ArrowUpRight size={10} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Application Detailed View */}
      {activeApp ? (
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Accent Header */}
          <div className="p-6 border-b border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[10px] font-extrabold block tracking-wider dark:text-slate-400 text-slate-500">
                {t.controlNumber}: {activeApp.controlNumber}
              </span>
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1 uppercase tracking-tight">
                {activeApp.assistanceType} {t.caseFile}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.filedOn} {new Date(activeApp.submissionDate).toLocaleString()}
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t.currentStatus}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1.5 ${getStatusStyle(activeApp.status).bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${getStatusStyle(activeApp.status).dot}`} />
                {getLocalizedStatus(activeApp.status)}
              </span>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            {/* Intake Sheet Header */}
            <div className="text-center border-b-2 border-slate-300 dark:border-slate-700 pb-6 mb-2">
              <div className="flex items-center justify-center gap-4 mb-3">
                <img src="/images/mswdo.jpeg" alt="MSWDO Logo" className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-full" />
                <div>
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Republic of the Philippines</p>
                  <p className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200">Province of Iloilo</p>
                  <p className="text-sm md:text-lg font-black text-slate-900 dark:text-white">Municipality of Tubungan</p>
                  <p className="text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-300">Municipal Social Welfare and Development Office</p>
                </div>
                <img src="/images/logo.jpeg" alt="Logo" className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-full" />
              </div>
              <div className="border-t-2 border-b-2 border-slate-900 dark:border-white py-1.5 mb-2 max-w-xs mx-auto">
                <h2 className="text-sm md:text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">INTAKE SHEET</h2>
              </div>
              <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">AICS Assistance Application</h3>
              <p className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400 mt-1">{activeApp.controlNumber}</p>
            </div>

            {/* Status Timeline Visualizer */}
            {activeApp.status !== 'Rejected' ? (
              <div className="bg-slate-50 dark:bg-slate-950/30 p-6 rounded-2xl border border-slate-150 dark:border-slate-800">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                  {t.timelineTitle}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
                  {/* Connect Line */}
                  <div className="hidden md:block absolute top-4 left-4 right-4 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
                  
                  {timelineSteps.map((step, idx) => {
                    const currentIndex = getStatusStepIndex(activeApp.status);
                    const isPassed = currentIndex >= idx;
                    const isCurrent = currentIndex === idx;

                    return (
                      <div key={idx} className="flex md:flex-col items-center md:items-center gap-4 md:gap-0 text-left md:text-center relative z-10">
                        {/* Dot */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border transition-all shrink-0 ${
                          isPassed 
                            ? 'bg-blue-700 border-blue-700 text-white shadow-md'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                        }`}>
                          {isPassed && !isCurrent ? <CheckCircle2 size={15} /> : idx + 1}
                        </div>

                        {/* Labels */}
                        <div className="mt-0 md:mt-3 min-w-0">
                          <h4 className={`text-[11px] md:text-xs font-bold leading-tight ${isCurrent ? 'text-blue-700 dark:text-blue-400 font-black' : isPassed ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                            {step.title}
                          </h4>
                          <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 md:max-w-[110px] mx-auto hidden md:block leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {activeApp.statusNotes && (
                  <div className="mt-6 p-4 bg-blue-500/10 border-l-4 border-blue-600 rounded-r-xl text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                    <strong className="font-extrabold block text-blue-950 dark:text-blue-200 mb-0.5">{t.caseworkerRemark}</strong> {activeApp.statusNotes}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-rose-500/10 border-l-4 border-rose-500 p-4 rounded-r-xl text-xs text-rose-900 dark:text-rose-300 leading-relaxed">
                <h4 className="font-extrabold text-rose-950 dark:text-rose-200 mb-1 flex items-center gap-1.5">
                  <AlertCircle size={14} /> {t.disapprovedTitle}
                </h4>
                <p>{activeApp.statusNotes || t.disapprovedDesc}</p>
              </div>
            )}

            {/* Applicant Profile */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-3">
                {t.applicantProfile}
              </h3>
              <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-150 dark:border-slate-800 space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="dark:text-slate-400 text-slate-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getStatusStyle(activeApp.status).bg}`}>
                    {getLocalizedStatus(activeApp.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="dark:text-slate-400 text-slate-500">{t.nameLabel}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeApp.applicantName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="dark:text-slate-400 text-slate-500">{t.emailLabel}</span>
                  <span className="font-mono text-slate-900 dark:text-white truncate max-w-[180px]">{activeApp.applicantEmail}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="dark:text-slate-400 text-slate-500">{t.contactNumberLabel}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeApp.applicantPhone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="dark:text-slate-400 text-slate-500">Address:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right max-w-[200px]">{activeApp.applicantAddress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="dark:text-slate-400 text-slate-500">Birthdate:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeApp.applicantBirthdate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="dark:text-slate-400 text-slate-500">Civil Status:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{activeApp.applicantCivilStatus}</span>
                </div>
              </div>
            </div>

            {/* Clientele Categories */}
            {activeApp.clienteleCategories && activeApp.clienteleCategories.length > 0 && (
              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-3">Clientele Category</h3>
                <div className="flex flex-wrap gap-2">
                  {activeApp.clienteleCategories.map((cat) => (
                    <span key={cat} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 rounded-lg text-[11px] font-bold border border-blue-200 dark:border-blue-900/30">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Impression/Findings */}
            {activeApp.impressionFindings && (
              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-3">IV. IMPRESSION/FINDINGS</h3>
                <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-150 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{activeApp.impressionFindings}&rdquo;
                </div>
              </div>
            )}

            {/* Recommendation */}
            {activeApp.recommendation && (
              <div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-wider mb-3">V. RECOMMENDATION</h3>
                <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-150 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{activeApp.recommendation}&rdquo;
                </div>
              </div>
            )}

            {/* Household composition */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider mb-3">
                {t.householdTitle}
              </h3>
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950/20 text-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900 text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3 pl-4">{t.nameTh}</th>
                        <th className="p-3">{t.relTh}</th>
                        <th className="p-3">{t.ageTh}</th>
                        <th className="p-3">{t.occTh}</th>
                        <th className="p-3 text-right pr-4">{t.incTh}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                      {activeApp.householdMembers.map((m, i) => (
                        <tr key={i} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/30">
                          <td className="p-3 pl-4 font-bold text-slate-900 dark:text-white">{m.name}</td>
                          <td className="p-3">{m.relationship}</td>
                          <td className="p-3">{m.age} yrs</td>
                          <td className="p-3">{m.occupation}</td>
                          <td className="p-3 text-right pr-4 font-mono font-bold text-slate-900 dark:text-white">₱{m.monthlyIncome.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Digital Documents List */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-wider mb-3">
                {t.submittedDocs} ({activeApp.documents.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeApp.documents.map((doc) => (
                  <div key={doc.id} className="p-3 bg-slate-50 dark:bg-slate-950/20 rounded-xl border border-slate-150 dark:border-slate-800 flex items-center justify-between text-xs hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-all">
                    <div className="flex items-center gap-2.5 max-w-[70%]">
                      <FileCheck className="text-emerald-600 dark:text-emerald-400 shrink-0" size={18} />
                      <div className="truncate min-w-0">
                        <p className="font-bold text-slate-850 dark:text-slate-200 truncate" title={doc.requirementName}>{doc.requirementName}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{doc.fileName}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-blue-700 dark:text-blue-450 font-bold flex items-center gap-1 transition-colors cursor-pointer text-[11px] shrink-0"
                    >
                      <Eye size={12} /> {t.viewFileBtn}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Lines */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="text-center">
                  <div className="border-b-2 border-slate-900 dark:border-white w-48 mx-auto mb-1"></div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">CLIENT</p>
                </div>
                <div className="text-center">
                  <div className="border-b-2 border-slate-900 dark:border-white w-48 mx-auto mb-1"></div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Prepared by</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="lg:col-span-8 text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <p className="text-xs text-slate-400 dark:text-slate-500">{t.selectAppPrompt}</p>
        </div>
      )}

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
                <div className="text-center py-12 flex flex-col items-center gap-3 dark:text-white text-slate-900">
                  <FileText size={48} className="dark:text-slate-400 text-slate-500" />
                  <p className="text-sm font-bold">{t.pdfFileUploaded}</p>
                  <a 
                    href={previewDoc.fileData} 
                    download={previewDoc.fileName}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-extrabold rounded-xl shadow-lg transition-colors dark:text-white text-slate-900"
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
