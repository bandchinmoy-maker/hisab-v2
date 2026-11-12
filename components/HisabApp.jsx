import React, { useState, useEffect } from 'react';
import OnboardingFlow from './OnboardingFlow';
import DashboardUI from './DashboardUI';
import RecoveryModal from './RecoveryModal';

export default function HisabApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('hisab_user_session');
    const onboardingDone = localStorage.getItem('hisab_onboarding_done');

    if (onboardingDone === 'true' && savedUser) {
      setHasCompletedOnboarding(true);
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthenticated(false);
    }
  }, []);

  const handleOnboardingComplete = (userData) => {
    localStorage.setItem('hisab_onboarding_done', 'true');
    localStorage.setItem('hisab_user_session', JSON.stringify(userData));
    setCurrentUser(userData);
    setHasCompletedOnboarding(true);
    setIsAuthenticated(true);
  };

  const handleUnlock = () => {
    if (currentUser && currentUser.pin) {
      if (enteredPin === currentUser.pin) {
        setIsAuthenticated(true);
        setPinError(false);
      } else {
        setPinError(true);
      }
    } else {
      setIsAuthenticated(true);
    }
  };

  const handleLockApp = () => {
    setIsAuthenticated(false);
    setEnteredPin('');
  };

  const handleLogoutApp = () => {
    localStorage.removeItem('hisab_user_session');
    localStorage.removeItem('hisab_onboarding_done');
    setHasCompletedOnboarding(false);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 font-sans">
      {!hasCompletedOnboarding ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : !isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-amber-100 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-2xl flex items-center justify-center shadow-md text-white">
                👁️
              </div>
            </div>
            <div className="mb-4 inline-block bg-amber-100/80 border border-amber-300 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider">
              🪔 SHUBH LABH • FINANCIAL SCIENCE & VISION
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">Arthved</h2>
            <p className="text-xs text-slate-500 mb-6">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
            
            <input 
              type="password" 
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="Enter 4-digit PIN or Password" 
              className={`w-full px-4 py-3 border rounded-xl mb-2 focus:outline-none text-center tracking-widest text-sm bg-amber-50/20 ${
                pinError ? 'border-red-500' : 'border-amber-200'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUnlock();
              }}
            />
            {pinError && (
              <p className="text-xs text-red-500 mb-4 font-medium">Wrong PIN! Please try again.</p>
            )}
            
            <button 
              onClick={handleUnlock}
              className="w-full py-3.5 bg-[#a34407] hover:bg-[#853705] text-white font-black text-xs rounded-xl transition shadow-md mt-2 cursor-pointer uppercase tracking-wider"
            >
              Unlock Dashboard 🔓
            </button>

            <button 
              onClick={() => setShowRecovery(true)}
              className="mt-4 text-xs text-amber-800 hover:underline block mx-auto font-bold cursor-pointer"
            >
              Forgot PIN? Recover via WhatsApp or Email 📱
            </button>

            <p className="text-[10px] text-slate-400 mt-6 font-medium">Local-First Zero-Knowledge AES Encrypted Secure Vault</p>
          </div>
        </div>
      ) : (
        <DashboardUI onLock={handleLockApp} onLogout={handleLogoutApp} user={currentUser} />
      )}

      {showRecovery && (
        <RecoveryModal onClose={() => setShowRecovery(false)} />
      )}
    </div>
  );
}