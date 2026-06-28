import React, { useState } from 'react';
import { ServiceInfo } from '../types/types';
import LucideIcon from './LucideIcon';
import { Check, ClipboardList, Info, HelpCircle, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  key?: React.Key;
  service: ServiceInfo;
  onApplyClick?: () => void;
}

export default function ServiceCard({ service, onApplyClick }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
      isExpanded 
        ? 'border-blue-500 shadow-lg shadow-blue-700/5' 
        : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
    }`}>
      {/* Card Header area */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="p-3 bg-blue-50 text-blue-700 rounded-xl shrink-0">
            <LucideIcon name={service.iconName} size={26} />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
            {service.id.toUpperCase()}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mt-4 leading-tight">
          {service.fullName}
        </h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Expanded details or read more action */}
      <div className="px-6 pb-6 pt-0 border-t border-slate-100">
        {!isExpanded ? (
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Info size={14} /> View Qualifications & Requirements
            </button>
            
            {service.id === 'aics' && onApplyClick && (
              <button
                onClick={() => onApplyClick()}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                Apply Online <ArrowRight size={12} />
              </button>
            )}
          </div>
        ) : (
          <div className="pt-5 space-y-5">
            {/* Eligibility criteria */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <HelpCircle size={14} className="text-blue-600" />
                How to Qualify (Eligibility)
              </h4>
              <ul className="space-y-1.5 pl-1">
                {service.eligibility.map((criterion, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                    <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                    <span>{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Application checklist */}
            <div className="space-y-2 pt-3 border-t border-slate-150">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                <ClipboardList size={14} className="text-blue-700" />
                Required Documents Checklist
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-1">
                {service.requirements.map((req, idx) => (
                  <li key={idx} className="text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-700 shrink-0 mt-1.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions panel */}
            <div className="pt-4 border-t border-slate-150 flex items-center justify-between">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Collapse Details
              </button>

              {service.id === 'aics' && onApplyClick ? (
                <button
                  onClick={() => onApplyClick()}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold rounded-lg flex items-center gap-1 shadow-md shadow-blue-700/15 transition-colors cursor-pointer"
                >
                  Apply Online Now <ArrowRight size={13} />
                </button>
              ) : (
                <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 uppercase tracking-wide">
                  Physical submission at MSWDO Office
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
