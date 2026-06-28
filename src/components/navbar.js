/**
 * MSWDO Portal Navbar Component
 * 
 * Note: For complete state synchronization with React routing, local storage, 
 * user authentication, and real-time multi-language and theme toggling, the live
 * working navbar is directly integrated in `/src/App.tsx`. 
 * This file serves as a clean, modular export representation of the Navbar component.
 */

import React, { useState } from 'react';
import { 
  ChevronDown, Menu, X, LogIn, LogOut, ClipboardList, CheckCircle2, Globe, Moon, Sun 
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  handleLogout, 
  activeTab, 
  setActiveTab, 
  selectedServiceId, 
  setSelectedServiceId,
  language,
  setLanguage,
  theme,
  setTheme,
  userApplications = []
}) {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileProgramsOpen, setIsMobileProgramsOpen] = useState(false);
  const [isMobileApplicationsOpen, setIsMobileApplicationsOpen] = useState(false);

  const servicesData = [
    { id: 'aics', name: 'AICS Program', fullName: 'Assistance to Individuals in Crisis Situations' },
    { id: 'pwd', name: 'PWD Services', fullName: 'Persons with Disability Welfare & ID Registration' },
    { id: 'senior', name: 'Senior Citizens', fullName: 'Elderly Welfare Services & OSCA Registration' },
    { id: 'solo-parent', name: 'Solo Parents', fullName: 'Solo Parents Welfare Services & ID Issuance' }
  ];

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
      programs: "Programs",
      applications: "Applications"
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
      programs: "Mga Programa",
      applications: "Mga Aplikasyon"
    }
  };

  const t = translations[language || 'en'];

  return (
    <nav className="sticky top-0 bg-blue-900 text-white shadow-md z-40 transition-all navbar-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-sm shrink-0">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Seal_of_the_Department_of_Social_Welfare_and_Development.svg" 
                alt="Logo" 
                className="w-full h-full"
              />
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight block uppercase leading-tight">
                MSWDO Portal
              </span>
              <span className="text-[10px] text-blue-200 block uppercase tracking-widest font-semibold">
                Municipal Social Welfare & Development Office
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('home')}
              className={`pb-1 text-xs font-bold tracking-wide uppercase transition-all border-b-2 ${
                activeTab === 'home' ? 'border-blue-400 text-white' : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              {t.home}
            </button>

            {/* Desktop Hover Dropdown */}
            <div 
              className="relative dropdown-trigger"
              onMouseEnter={() => setIsServicesDropdownOpen(true)}
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button
                onClick={(e) => e.preventDefault()}
                className={`pb-1 text-xs font-bold tracking-wide uppercase transition-all border-b-2 flex items-center gap-1 ${
                  activeTab === 'services-info' ? 'border-blue-400 text-white' : 'border-transparent text-blue-200 hover:text-white'
                }`}
              >
                {t.welfareServices} <ChevronDown size={12} />
              </button>
              
              {isServicesDropdownOpen && (
                <div className="absolute left-0 pt-2 w-72 z-50 text-slate-800 animate-fade-in dropdown-menu">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2.5">
                    {servicesData.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => {
                          setSelectedServiceId(service.id);
                          setActiveTab('services-info');
                          setIsServicesDropdownOpen(false);
                          setTimeout(() => {
                            const el = document.getElementById(`program-section-${service.id}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 100);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors flex items-start gap-2.5"
                      >
                        <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg mt-0.5 shrink-0">
                          <span className="text-xs">✦</span>
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-950">{service.name}</p>
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
              className={`pb-1 text-xs font-bold tracking-wide uppercase transition-all border-b-2 ${
                activeTab === 'about' ? 'border-blue-400 text-white' : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              {t.aboutUs}
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`pb-1 text-xs font-bold tracking-wide uppercase transition-all border-b-2 ${
                activeTab === 'contact' ? 'border-blue-400 text-white' : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              {t.contactUs}
            </button>
          </div>

          {/* Desktop Lang & Theme Toggles + Auth */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setLanguage(lang => lang === 'en' ? 'fil' : 'en')}
                className="p-2 rounded-xl bg-blue-800/40 hover:bg-blue-800/85 border border-blue-700 text-blue-200 hover:text-white text-xs font-bold transition-all"
              >
                🌐 {language === 'en' ? 'EN' : 'FIL'}
              </button>
              <button
                onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-xl bg-blue-800/40 hover:bg-blue-800/85 border border-blue-700 text-blue-200 hover:text-white text-xs font-bold transition-all"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>

            {/* Mobile Burger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-blue-800/50 text-blue-200 hover:text-white transition-all focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-blue-950 text-white shadow-2xl z-50 flex flex-col p-5 border-r border-blue-800/50">
            <div className="flex items-center justify-between pb-5 border-b border-blue-800">
              <span className="font-bold text-sm tracking-tight block uppercase">MSWDO PORTAL</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-blue-200"><X size={18} /></button>
            </div>
            {/* Scrollable menu options */}
            <div className="flex-1 overflow-y-auto pt-4 space-y-4">
              <button onClick={() => { setActiveTab('home'); setIsMobileMenuOpen(false); }} className="w-full text-left font-bold text-xs uppercase">{t.home}</button>
              <div>
                <button onClick={() => setIsMobileProgramsOpen(!isMobileProgramsOpen)} className="w-full text-left font-bold text-xs uppercase flex justify-between">
                  <span>{t.programs}</span> <ChevronDown size={14} />
                </button>
                {isMobileProgramsOpen && (
                  <div className="pl-3 py-1 mt-1 space-y-2">
                    {servicesData.map(service => (
                      <button 
                        key={service.id} 
                        onClick={() => { setSelectedServiceId(service.id); setActiveTab('services-info'); }}
                        className="w-full text-left text-[11px] font-bold text-blue-200"
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
