import React, { useState } from 'react';

export default function RecoveryModal({ onClose }) {
  const [method, setMethod] = useState('whatsapp');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone) {
      alert('Please enter your registered WhatsApp number.');
      return;
    }
    setOtpSent(true);
    alert('Simulated WhatsApp OTP sent successfully to ' + phone + ' (Use 1234)');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp === '1234') {
      alert('OTP Verified! You can now reset your master password.');
      onClose();
    } else {
      alert('Invalid OTP. Please enter 1234');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = JSON.parse(event.target.result);
          if (content.type === 'hisab-recovery-file') {
            alert('Recovery file successfully verified! Account restored.');
            localStorage.setItem('hisab_onboarding_done', 'true');
            window.location.reload();
          } else {
            alert('Invalid Hisab backup file.');
          }
        } catch (err) {
          alert('Error reading backup file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-md w-full border border-amber-100 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-lg">&times;</button>
        
        <h3 className="text-xl font-bold text-slate-900 mb-1">Account Recovery</h3>
        <p className="text-xs text-slate-500 mb-6">Choose how you want to restore your access safely.</p>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button 
            onClick={() => setMethod('whatsapp')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${method === 'whatsapp' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500'}`}
          >
            WhatsApp OTP
          </button>
          <button 
            onClick={() => setMethod('file')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${method === 'file' ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500'}`}
          >
            Local Backup File
          </button>
        </div>

        {method === 'whatsapp' ? (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered WhatsApp Number</label>
                <input 
                  type="tel" 
                  placeholder="+91 9876543210" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button type="submit" className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition shadow-md">
                  Send WhatsApp OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 4-digit OTP</label>
                <input 
                  type="text" 
                  placeholder="1234" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl mb-4 text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition shadow-md">
                  Verify & Unlock
                </button>
              </form>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-xs text-slate-600 mb-4">Upload your previously downloaded `.hisab` backup file to instantly restore your data.</p>
            <label className="block w-full border-2 border-dashed border-amber-300 rounded-2xl p-6 cursor-pointer hover:bg-amber-50/50 transition">
              <span className="text-xs font-bold text-amber-700 block">Click to browse `.hisab` file</span>
              <input type="file" accept=".hisab" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}