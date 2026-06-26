import React from 'react';
import { Landmark, Calendar, Phone, Mail, Clock, HelpCircle, ShieldCheck } from 'lucide-react';

export default function PortalHeader() {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl overflow-hidden relative shadow-lg border border-slate-800">
      {/* Absolute Decorative Circles */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl -translate-y-12 translate-x-12 pointer-events-none" />
      <div className="absolute bottom-0 left-12 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-between">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
            <Landmark size={14} /> Official MSWDO Client Portal
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            Municipal Social Welfare and Development Office
          </h1>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-xl">
            Providing accessible, secure, and immediate social assistance to support individuals and families in crisis. Learn about municipal services, check eligibility, and file for AICS support with secure digital document verification.
          </p>

          {/* Core Information Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-blue-400" />
              <span>Mon-Fri (8AM-5PM)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="text-blue-400" />
              <span>(02) 8123-4567</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-blue-400" />
              <span>mswdo@municipality.gov.ph</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-blue-400" />
              <span>Secure Data Privacy</span>
            </div>
          </div>
        </div>

        {/* Office Seal/Visual Representation */}
        <div className="bg-slate-800/45 p-6 rounded-2xl border border-slate-700/50 w-full md:w-80 space-y-4">
          <h3 className="font-bold text-xs text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar size={13} /> Immediate Processing
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">AICS Online Review</span>
              <span className="font-bold text-emerald-400">2-3 Office Days</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">PWD / Senior ID</span>
              <span className="font-bold text-slate-300">On-Site Walk-In</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Solo Parent ID</span>
              <span className="font-bold text-slate-300">Case Interview</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 leading-relaxed pt-1">
            * Ensure all required files are readable and up-to-date to prevent delay in processing.
          </div>
        </div>
      </div>
    </div>
  );
}
