import React, { useState } from 'react';
import { User } from '../types';
import { X, Lock, Mail, User as UserIcon, Phone, MapPin, Calendar, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
  initialTab?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialTab = 'login' }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [civilStatus, setCivilStatus] = useState<'Single' | 'Married' | 'Widowed' | 'Separated'>('Single');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Retrieve users from Supabase
    const { data: usersList, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .ilike('email', email);

    if (fetchError) {
      console.error('Failed to fetch user from Supabase:', fetchError);
      setError('An error occurred during login. Please try again.');
      return;
    }

    const userMatch = usersList && usersList.length > 0 ? usersList[0] : null;

    if (!userMatch) {
      setError('No account found with this email. Please register first.');
      return;
    }

    if (userMatch.password !== password) {
      setError('Incorrect password. Please try again.');
      return;
    }

    // Success
    setSuccess('Welcome back! You are now logged in.');
    setTimeout(() => {
      onAuthSuccess({
        id: userMatch.id,
        name: userMatch.name,
        email: userMatch.email,
        phone: userMatch.phone,
        address: userMatch.address,
        birthdate: userMatch.birthdate,
        civilStatus: userMatch.civil_status
      });
      onClose();
      // Reset states
      setEmail('');
      setPassword('');
      setSuccess('');
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !address || !birthdate || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .ilike('email', email);

    if (checkError) {
      console.error('Failed to check existing user:', checkError);
      setError('An error occurred. Please try again.');
      return;
    }

    if (existingUser && existingUser.length > 0) {
      setError('An account with this email already exists. Please login.');
      return;
    }

    // Create new user object
    const newUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      phone,
      address,
      birthdate,
      civil_status: civilStatus,
      password // Plain text for mock behavior compatibility
    };

    // Save to database
    const { error: insertError } = await supabase
      .from('users')
      .insert([newUser]);

    if (insertError) {
      console.error('Failed to save user to Supabase:', insertError);
      setError('Failed to register. Please try again.');
      return;
    }

    setSuccess('Registration successful! Logging you in...');
    setTimeout(() => {
      onAuthSuccess({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        birthdate: newUser.birthdate,
        civilStatus: civilStatus
      });
      onClose();
      // Reset states
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setBirthdate('');
      setPassword('');
      setCivilStatus('Single');
      setSuccess('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden relative">
        {/* Decorative Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-blue-700 via-blue-600 to-slate-900"></div>

        {/* Header */}
        <div className="p-6 pb-4 flex justify-between items-start border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-950 flex items-center gap-2">
              <ShieldCheck className="text-blue-700" size={24} />
              MSWDO Portal Client Auth
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verify your identity to apply and track social assistance programs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 text-center ${
              tab === 'login'
                ? 'border-blue-700 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In to Your Account
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-3 text-sm font-semibold transition-all border-b-2 text-center ${
              tab === 'register'
                ? 'border-blue-700 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Register New Profile
          </button>
        </div>

        {/* Content & Form */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-800 text-xs font-medium rounded-r-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs font-medium rounded-r-md">
              {success}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-md hover:shadow-lg hover:shadow-blue-700/10 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                Sign In <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name (First, Middle, Last) *
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Juan Dela Cruz"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="juan@example.com"
                      className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Mobile/Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09171234567"
                      className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Home / Residential Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2 text-neutral-400" size={18} />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Block, Lot, Street, Barangay, Municipality, Province"
                    rows={2}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all resize-none"
                    required
                  ></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Birthdate *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="date"
                      value={birthdate}
                      onChange={(e) => setBirthdate(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Civil Status *
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <select
                      value={civilStatus}
                      onChange={(e: any) => setCivilStatus(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all bg-white"
                      required
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Create Security Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-700/20 focus:border-blue-700 transition-all"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="text-[10px] text-neutral-400 leading-relaxed mt-2">
                By registering, you certify that all information supplied is true and correct in accordance with the Data Privacy Act of 2012.
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-sm rounded-lg shadow-md hover:shadow-lg hover:shadow-amber-500/10 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                Register & Sign In <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
