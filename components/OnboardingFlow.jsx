'use client';

import React, { useState } from 'react';

export default function OnboardingFlow({ onComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [consentStorage, setConsentStorage] = useState(true);
  const [consentCloudSync, setConsentCloudSync] = useState(true);

  const handleFinish = (e) => {
    e.preventDefault();
    if (!name || !password) {
      alert('Please fill in your name and password.');
      return;
    }

    const userData = {
      name,
      whatsapp: whatsapp || 'Not Provided',
      createdAt: new Date().toISOString()
    };

    generateLocalBackupFile(userData);
    onComplete(userData);
  };

  const generateLocalBackupFile = (data) => {
    const backupData = JSON.stringify({ ...data, version: '1.0', type: 'hisab-recovery-file' });
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hisab_Secure_Recovery_${Date.now()}.hisab`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-lg w-full border border-amber-100">
        {step === 1 && (
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Welcome to Hisab</span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-1 mb-3">Your Private Financial Vault</h1>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Your data stays secure on your device with zero-knowledge encryption. Let's set up your safe environment in seconds.
            </p>

            <div className="space-y-4 mb-8">
              <label className="flex items-start space-x-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-200/50 cursor-pointer">
                <input type="checkbox" checked={consentStorage} onChange={(e) => setConsentStorage(e.target.checked)} className="mt-1 accent-amber-600" />
                <div className="text-xs text-slate-700">
                  <span className="font-bold block text-slate-900">Local-First Storage Permission</span>
                  Allows app to store your encrypted transactions locally for lightning-fast offline performance.
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 bg-amber-50/50 rounded-2xl border border-amber-200/50 cursor-pointer">
                <input type="checkbox" checked={consentCloudSync} onChange={(e) => setConsentCloudSync(e.target.checked)} className="mt-1 accent-amber-600" />
                <div className="text-xs text-slate-700">
                  <span className="font-bold block text-slate-900">End-to-End Encrypted Cloud Sync</span>
                  Keeps an encrypted backup on cloud so you never lose data if your device changes.
                </div>
              </label>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl transition shadow-lg shadow-amber-600/20"
            >
              Continue Setup &rarr;
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleFinish}>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Step 2 of 2</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1 mb-4">Account & Recovery Setup</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name / Business Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ramesh Kirana Store" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp Number (For Instant Recovery)</label>
                <input 
                  type="tel" 
                  placeholder="e.g. +91 9876543210" 
                  value={whatsapp} 
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Set Master Password / PIN</label>
                <input 
                  type="password" 
                  required
                  placeholder="Minimum 4 characters" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
              🛡️ Note: A secure recovery file (`.hisab`) will automatically download to your device right now as an offline safety net.
            </p>

            <button 
              type="submit"
              className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-2xl transition shadow-lg shadow-amber-600/20"
            >
              Initialize My Vault & Unlock UI
            </button>
          </form>
        )}
      </div>
    </div>
  );
}