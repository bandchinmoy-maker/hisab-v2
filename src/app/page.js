'use client'

import React, { useState, useEffect, useRef } from 'react'

const ramayanaSlides = [
  { name: "Shri Ram (श्री राम)", title: "Maryada Purushottam — The Supreme Ideal", deed: "Pita ke vachan hetu 14 varsh ka vanvas sweekar kiya aur asatya par satya ki vijay sthapit karke maryada ka adarsh sthapit kiya.", symbol: "🏹", badge: "Divine Epitome" },
  { name: "Mata Sita (माता सीता)", title: "Pavitrata & Tyag ki Moorti", deed: "Rajya ke sabhi sukhon ka tyag karke vanvas mein sahayatri bani, atulya dhairya aur aatma-bal ka sacha parichay diya.", symbol: "🪷", badge: "Grace & Resilience" },
  { name: "Lakshman ji (लक्ष्मण जी)", title: "Bhratruprem & Nishtha", deed: "Bina ek pal soche bade bhai Shri Ram aur bhabhi ke sath vanvas gaye aur din-raat adig pehra dekar lakshman rekha ki maryada rakhi.", symbol: "🛡️", badge: "Eternal Loyalty" },
  { name: "Hanuman ji (हनुमान जी)", title: "Pawanputra & Sankat Mochan", deed: "Samudra langh kar Lanka mein Mata Sita ki khoj ki, Lanka dahan kiya aur Sanjeevani booti laakar lakshman ji ke pran bachaye.", symbol: "🏔️", badge: "Supreme Devotee" },
  { name: "Jatayu (जटायु)", title: "Param Pakshiraj & Yoddha", deed: "Mata Sita ki raksha ke liye akash mein Ravan se bhayanak yuddh kiya aur dharm ke liye apne praan samarpit kiye.", symbol: "🦅", badge: "Brave Protector" },
  { name: "Sugriva & Angada (सुग्रीव व अंगद)", title: "Kishkindha Leaders", deed: "Shri Ram ke sath sachha mitrata ka vachan nibhaya aur mahan Vanara sena ka netritva karke adharm ka nash kiya.", symbol: "🤝", badge: "Vanara Strength" },
  { name: "Jambavan (जाम्बवान जी)", title: "Riksharaj & Wise Elder", deed: "Apni agya aur gyan se Hanuman ji ko unki alaukik shaktiyon ka smaran karaya aur yuddh mein param margdarshan diya.", symbol: "🐻", badge: "Divine Wisdom" },
  { name: "Nala & Nila (नल और नीलकंठ)", title: "Divine Architects", deed: "Vishwakarma ke aashirwad aur gyan se samudra par mahan 'Ram Setu' ka nirmaan kiya jisse sena Lanka pahunchi.", symbol: "🌉", badge: "Master Engineers" }
];

const TABS = ['Overview', 'Transactions', 'To collect', 'Reports', 'Bank Accounts', 'Business setup'];
const ICONS = { 'Overview': '📊', 'Transactions': '📜', 'To collect': '📥', 'Reports': '📈', 'Bank Accounts': '🏦', 'Business setup': '⚙️' };

const screenCls = 'min-h-screen bg-[#120f0c] flex items-center justify-center p-4';
const inputCls = 'w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white';
const labelCls = 'block text-xs font-bold text-slate-700 uppercase mb-1';
const primaryBtn = 'w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer';
const emptyTx = { text: '', amount: '', type: 'income', category: 'General', paymentMode: 'Cash', bankAccount: 'Main Cash Drawer' };

const AnimStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600;700&display=swap');
    .signature-font { font-family: 'Dancing Script', cursive; }
    @keyframes av-rise{from{opacity:0;transform:translateY(24px) scale(.8)}to{opacity:1;transform:none}}
    @keyframes av-shine{0%{background-position:0% 50%}100%{background-position:200% 50%}}
    @keyframes av-flame{0%,100%{transform:scale(1) rotate(-3deg);filter:drop-shadow(0 0 6px #f59e0b)}50%{transform:scale(1.12) rotate(3deg);filter:drop-shadow(0 0 16px #fbbf24)}}
    @keyframes av-glow{0%,100%{box-shadow:0 0 25px 4px rgba(245,158,11,.35)}50%{box-shadow:0 0 55px 14px rgba(245,158,11,.6)}}
    @keyframes av-spin{to{transform:rotate(360deg)}}
    @keyframes av-fade{from{opacity:0}to{opacity:1}}
    @keyframes av-pop{from{opacity:0;transform:scale(.7) rotate(-6deg)}to{opacity:1;transform:none}}
    .av-letter{display:inline-block;background:linear-gradient(90deg,#b45309,#fbbf24,#fff7d6,#fbbf24,#b45309);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:av-rise .7s ease-out both,av-shine 3s linear infinite}
    .av-title{background:linear-gradient(90deg,#78350f,#d97706,#78350f);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:av-shine 4s linear infinite}
    .av-flame{display:inline-block;animation:av-flame 1.6s ease-in-out infinite}
    .av-glow{animation:av-glow 2.4s ease-in-out infinite}
    .av-ring{animation:av-spin 12s linear infinite}
    .av-fade{animation:av-fade 1.5s ease-out 1.2s both}
    .av-pop{animation:av-pop .6s ease-out both}
  `}</style>
);

export default function HisabApp() {
  const [step, setStep] = useState('loading');
  const [activeTab, setActiveTab] = useState('Overview');
  const [currentSlide, setCurrentSlide] = useState(0);

  const [formData, setFormData] = useState({ name: '', phone: '', pin: '' });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [txData, setTxData] = useState(emptyTx);
  const [dues, setDues] = useState([]);
  const [dueForm, setDueForm] = useState({ party: '', amount: '', dueDate: '' });
  const [biz, setBiz] = useState({ name: '', owner: '', gstin: '', phone: '', address: '' });
  const [bizSaved, setBizSaved] = useState(false);

  const [bankAccounts, setBankAccounts] = useState([
    { id: 1, name: 'Main Cash Drawer', type: 'Cash', accountNo: 'Cash' }
  ]);
  const [bankForm, setBankForm] = useState({ name: '', type: 'Bank', accountNo: '' });
  const [isListening, setIsListening] = useState(false);
  const [detectedSms, setDetectedSms] = useState('');

  // Audio Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Audio playback failed:", err);
        alert("Please place your audio file in public folder or check audio source.");
      });
    }
  };

  const saveDues = (list) => { setDues(list); localStorage.setItem('arthved_dues', JSON.stringify(list)); };
  
  const addDue = (e) => {
    e.preventDefault();
    if (!dueForm.party || !dueForm.amount) return;
    saveDues([{ id: Date.now(), party: dueForm.party, amount: parseFloat(dueForm.amount), dueDate: dueForm.dueDate }, ...dues]);
    setDueForm({ party: '', amount: '', dueDate: '' });
  };

  const receiveDue = (due) => {
    const newTx = { id: Date.now(), text: `Received from ${due.party}`, amount: due.amount, type: 'income', category: 'Udhaar Wapasi', paymentMode: 'Cash', bankAccount: 'Main Cash Drawer', date: new Date().toLocaleDateString() };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('arthved_tx', JSON.stringify(updated));
    saveDues(dues.filter((d) => d.id !== due.id));
  };

  const deleteDue = (id) => saveDues(dues.filter((d) => d.id !== id));

  const saveBiz = (e) => {
    e.preventDefault();
    localStorage.setItem('arthved_biz', JSON.stringify(biz));
    setBizSaved(true);
    setTimeout(() => setBizSaved(false), 2500);
  };

  const handleAddBank = (e) => {
    e.preventDefault();
    if (!bankForm.name) return;
    const updatedBanks = [...bankAccounts, { id: Date.now(), ...bankForm }];
    setBankAccounts(updatedBanks);
    localStorage.setItem('arthved_banks', JSON.stringify(updatedBanks));
    setBankForm({ name: '', type: 'Bank', accountNo: '' });
  };

  const deleteBank = (id) => {
    const updatedBanks = bankAccounts.filter(b => b.id !== id);
    setBankAccounts(updatedBanks);
    localStorage.setItem('arthved_banks', JSON.stringify(updatedBanks));
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const numberMatch = transcript.match(/\d+/);
      const amount = numberMatch ? numberMatch[0] : '';
      const text = transcript.replace(/\d+/g, '').trim();
      const isExpense = transcript.toLowerCase().includes('kharcha') || transcript.toLowerCase().includes('paid') || transcript.toLowerCase().includes('diya');
      
      setTxData(prev => ({
        ...prev,
        text: text || prev.text,
        amount: amount || prev.amount,
        type: isExpense ? 'expense' : 'income'
      }));
    };
    recognition.start();
  };

  const checkClipboardForSMS = async () => {
    try {
      if (!navigator.clipboard || !navigator.clipboard.readText) {
        alert("Clipboard access not available.");
        return;
      }
      const text = await navigator.clipboard.readText();
      if (!text) {
        alert("Clipboard is empty.");
        return;
      }
      const numMatch = text.match(/(?:Rs\.?|INR|₹)\s*(\d+)/i) || text.match(/\b\d+\b/);
      const amount = numMatch ? (numMatch[1] || numMatch[0]) : '';
      const isExpense = text.toLowerCase().includes('debited') || text.toLowerCase().includes('paid') || text.toLowerCase().includes('sent');
      
      setDetectedSms(text);
      setTxData(prev => ({
        ...prev,
        text: text.slice(0, 40) + '...',
        amount: amount,
        type: isExpense ? 'expense' : 'income',
        paymentMode: 'Online'
      }));
    } catch (err) {
      console.error("Clipboard read failed", err);
      alert("Please allow clipboard permission to read SMS.");
    }
  };

  const downloadCSV = () => {
    const rows = [['Date', 'Description', 'Category', 'Payment Mode', 'Bank Account', 'Type', 'Amount'], ...transactions.map((t) => [t.date, t.text, t.category, t.paymentMode, t.bankAccount || 'Main Cash Drawer', t.type, t.amount])];
    const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'arthved-report.csv';
    a.click();
  };

  const totalDue = dues.reduce((a, d) => a + d.amount, 0);
  const byCategory = Object.entries(transactions.filter((t) => t.type === 'expense').reduce((m, t) => { const k = t.category || 'General'; m[k] = (m[k] || 0) + t.amount; return m; }, {})).sort((a, b) => b[1] - a[1]);
  const byMode = Object.entries(transactions.reduce((m, t) => { const k = t.paymentMode || 'Cash'; m[k] = (m[k] || 0) + t.amount; return m; }, {}));

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedTx = localStorage.getItem('arthved_tx');
        if (savedTx) setTransactions(JSON.parse(savedTx));
      } catch (err) {
        console.error('Could not read saved transactions', err);
      }
      try {
        const savedDues = localStorage.getItem('arthved_dues');
        if (savedDues) setDues(JSON.parse(savedDues));
        const savedBiz = localStorage.getItem('arthved_biz');
        if (savedBiz) setBiz(JSON.parse(savedBiz));
        const savedBanks = localStorage.getItem('arthved_banks');
        if (savedBanks) setBankAccounts(JSON.parse(savedBanks));
      } catch (err) {
        console.error('Could not read saved data', err);
      }
      setStep(localStorage.getItem('arthved_user') ? 'login' : 'welcome');
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ramayanaSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.pin) return;
    localStorage.setItem('arthved_user', JSON.stringify(formData));
    setStep('dashboard');
  };

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem('arthved_user') || '{}');
    if (enteredPin === savedUser.pin) {
      setStep('dashboard');
      setPinError(false);
      setEnteredPin('');
    } else {
      setPinError(true);
    }
  };

  const handleLock = () => {
    setStep('login');
    setEnteredPin('');
    setPinError(false);
  };

  const handleResetVault = () => {
    localStorage.removeItem('arthved_user');
    localStorage.removeItem('arthved_tx');
    localStorage.removeItem('arthved_dues');
    localStorage.removeItem('arthved_biz');
    localStorage.removeItem('arthved_banks');
    setTransactions([]);
    setDues([]);
    setBiz({ name: '', owner: '', gstin: '', phone: '', address: '' });
    setStep('welcome');
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!txData.text || !txData.amount) return;
    const amountVal = parseFloat(txData.amount);
    const newTx = {
      id: Date.now(),
      ...txData,
      amount: amountVal,
      date: new Date().toLocaleDateString()
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('arthved_tx', JSON.stringify(updated));

    if (txData.paymentMode === 'Credit Sales') {
      const newDue = {
        id: Date.now() + 1,
        party: txData.text,
        amount: amountVal,
        dueDate: ''
      };
      saveDues([newDue, ...dues]);
    }

    setIsModalOpen(false);
    setTxData(emptyTx);
    setDetectedSms('');
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, c) => a + c.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, c) => a + c.amount, 0);
  const netBalance = totalIncome - totalExpense;

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#120f0c] flex flex-col items-center justify-center font-sans text-amber-100 overflow-hidden relative">
        <AnimStyles />
        <audio ref={audioRef} src="/music.mp3" loop />
        <div className="relative mb-8">
          <div className="av-ring absolute -inset-6 rounded-full border-2 border-dashed border-amber-500/40"></div>
          <div className="av-glow w-28 h-28 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-full flex items-center justify-center text-5xl border border-amber-300/40">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#120f0c" stroke="#f59e0b" strokeWidth="4"/>
              <path d="M50 8V18M50 82V92M8 50H18M82 50H92M20 20L27 27M73 73L80 80M20 80L27 73M73 27L80 20" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="24" fill="#f59e0b"/>
              <path d="M26 50C34 38 42 34 50 34C58 34 66 38 74 50C66 62 58 66 50 66C42 66 34 62 26 50Z" fill="#120f0c" stroke="#fbbf24" strokeWidth="3"/>
              <circle cx="50" cy="50" r="9" fill="#fbbf24"/>
              <circle cx="52" cy="48" r="3" fill="#120f0c"/>
            </svg>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black flex gap-1 md:gap-2">
          {'ARTHVED'.split('').map((ch, i) => (
            <span key={i} className="av-letter" style={{ animationDelay: `${i * 0.12}s, 0s` }}>{ch}</span>
          ))}
        </h1>
        <p className="av-fade text-xs text-amber-200/60 mt-3 font-medium tracking-wider uppercase">Financial Science & Vision • Ayodhya Edition</p>
        <div className="absolute bottom-6 text-amber-300/80 text-sm signature-font tracking-wide">
          Crafted by Chinmoy Suryakant Band
        </div>
      </div>
    );
  }

  if (step === 'welcome') {
    return (
      <div className={screenCls + " relative"}>
        <audio ref={audioRef} src="/music.mp3" loop />
        <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-300/40 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#120f0c" stroke="#f59e0b" strokeWidth="4"/>
              <path d="M50 10V20M50 80V90M10 50H20M80 50H90" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="22" fill="#f59e0b"/>
              <path d="M28 50C36 40 43 36 50 36C57 36 64 40 72 50C64 60 57 64 50 64C43 64 36 60 28 50Z" fill="#120f0c" stroke="#fbbf24" strokeWidth="2.5"/>
              <circle cx="50" cy="50" r="8" fill="#fbbf24"/>
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Welcome to ArthVed</h2>
          <p className="text-xs text-slate-500 mb-6">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
          <div className="space-y-3">
            <button onClick={() => setStep('register')} className={primaryBtn}>✨ New User (Register Vault)</button>
            <button onClick={() => setStep('login')} className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition cursor-pointer">🔑 Old User (Unlock Vault)</button>
          </div>
          <div className="mt-6 pt-4 border-t border-amber-100 text-amber-900/60 text-sm signature-font">
            Chinmoy Suryakant Band
          </div>
        </div>
      </div>
    );
  }

  if (step === 'register') {
    return (
      <div className={screenCls + " relative"}>
        <audio ref={audioRef} src="/music.mp3" loop />
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-200">
          <h2 className="text-xl font-black text-amber-900 mb-1">Create Your Vault</h2>
          <p className="text-xs text-slate-500 mb-6">Set your name and a PIN to protect your accounts on this device.</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className={labelCls}>Full Name / Vyapaar Name</label>
              <input type="text" required placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp Number for Recovery</label>
              <input type="text" placeholder="10-digit number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Set Secure PIN or Password</label>
              <input type="password" required placeholder="Enter PIN (e.g. 1234 or word)" value={formData.pin} onChange={(e) => setFormData({ ...formData, pin: e.target.value })} className={inputCls + ' tracking-widest'} />
            </div>
            <button type="submit" className={primaryBtn + ' mt-2'}>INITIALIZE ARTHVED VAULT 🚀</button>
            <button type="button" onClick={() => setStep('welcome')} className="w-full text-xs text-slate-500 hover:underline mt-2 text-center block">← Back to Welcome</button>
          </form>
          <div className="mt-6 text-center text-amber-900/60 text-sm signature-font">
            Chinmoy Suryakant Band
          </div>
        </div>
      </div>
    );
  }

  if (step === 'login') {
    return (
      <div className={screenCls + " relative"}>
        <audio ref={audioRef} src="/music.mp3" loop />
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-amber-200 text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">🔒</div>
          <h2 className="text-2xl font-black text-slate-900 mb-1">Unlock ArthVed Vault</h2>
          <p className="text-xs text-slate-500 mb-6">Enter your PIN or Password</p>
          <input
            type="password"
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            placeholder="••••"
            className={`w-full px-4 py-3 border rounded-xl mb-2 focus:outline-none text-center tracking-widest text-lg font-bold bg-amber-50/20 ${pinError ? 'border-rose-500' : 'border-amber-200'}`}
            onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
          />
          {pinError && <p className="text-xs text-rose-500 mb-4 font-medium">Wrong PIN! Please try again.</p>}
          <button onClick={handleLogin} className={primaryBtn}>Unlock Dashboard 🔓</button>
          <button
            onClick={() => { if (window.confirm('This will delete your account AND all saved transactions on this device. Continue?')) handleResetVault(); }}
            className="mt-4 text-xs text-slate-400 hover:underline block mx-auto font-medium"
          >
            Reset Vault / Register New Account
          </button>
          <div className="mt-6 text-amber-900/60 text-sm signature-font">
            Chinmoy Suryakant Band
          </div>
        </div>
      </div>
    );
  }

  const slide = ramayanaSlides[currentSlide];

  const txTable = (
    <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 mb-12">
      <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2"><span>📜</span> Karma Lekha (Transactions)</h2>
      {transactions.length === 0 ? (
        <p className="text-sm text-slate-500 py-8 text-center">Abhi tak koi bhi len-den darj nahi kiya gaya hai.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-amber-100 text-xs text-amber-900 uppercase">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Vivaran (Description)</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Account Tag</th>
                <th className="py-3 px-4">Rashi (Amount)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50 text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-amber-50/50">
                  <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{tx.text}</td>
                  <td className="py-3 px-4 text-slate-600">{tx.category || 'General'}</td>
                  <td className="py-3 px-4"><span className="bg-amber-100 text-amber-900 text-xs px-2 py-1 rounded-md font-bold">{tx.paymentMode || 'Cash'}</span></td>
                  <td className="py-3 px-4"><span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-md font-medium">🏦 {tx.bankAccount || 'Main Cash Drawer'}</span></td>
                  <td className={`py-3 px-4 font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'income' ? '+' : '-'} ₹ {Math.abs(tx.amount).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 flex font-sans">
      <AnimStyles />
      <audio ref={audioRef} src="/music.mp3" loop />
      
      <aside className="w-64 bg-white border-r border-amber-200 hidden md:flex flex-col justify-between p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-amber-100">
            <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]">
              <circle cx="50" cy="50" r="48" fill="#120f0c" stroke="#f59e0b" strokeWidth="3.5"/>
              <path d="M50 10V20M50 80V90M10 50H20M80 50H90M22 22L29 29M71 71L78 78M22 78L29 71M71 29L78 22" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="24" fill="#f59e0b"/>
              <path d="M26 50C34 38 42 34 50 34C58 34 66 38 74 50C66 62 58 66 50 66C42 66 34 62 26 50Z" fill="#120f0c" stroke="#fbbf24" strokeWidth="2.5"/>
              <circle cx="50" cy="50" r="9" fill="#fbbf24"/>
              <circle cx="52" cy="48" r="3" fill="#120f0c"/>
            </svg>
            <div>
              <h1 className="av-title font-black text-lg leading-tight">ArthVed</h1>
              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Ayodhya Edition</p>
            </div>
          </div>
          <nav className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-3 ${activeTab === tab ? 'bg-amber-800 text-white shadow-md' : 'text-slate-600 hover:bg-amber-50 hover:text-amber-900'}`}
              >
                <span>{ICONS[tab]}</span>{tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Empty Space Music Widget & Creator Signature Integration */}
        <div className="pt-4 border-t border-amber-100 space-y-3">
          <div className="bg-amber-50 border border-amber-200/60 p-3 rounded-2xl text-center shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-amber-900 uppercase">🎵 Divine Dhun</span>
              <button 
                onClick={toggleMusic}
                className="bg-amber-800 hover:bg-amber-900 text-white text-xs px-3 py-1 rounded-lg font-bold shadow transition cursor-pointer"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>
            <p className="text-[10px] text-slate-600 font-medium leading-tight">
              Music by <span className="font-bold text-amber-900">Kalpesh Ajugia</span> from <span className="font-bold text-amber-900">Pixabay</span>[cite: 5]
            </p>
          </div>

          <div className="text-center text-amber-900/70 text-sm signature-font">
            Chinmoy Suryakant Band
          </div>

          <button onClick={handleLock} className="w-full py-2 px-4 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer">
            <span>🔒</span> Lock Vault
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-amber-200 pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-black text-amber-900">{activeTab}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Surya ki urja, Nayan ki drishti — har hisab ekdam saaf.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsModalOpen(true)} className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer">
              <span>➕</span> Add Sale / Expense
            </button>
            <button onClick={handleLock} className="md:hidden bg-slate-100 text-slate-700 px-3 py-2.5 rounded-xl font-bold text-sm cursor-pointer">🔒</button>
          </div>
        </header>

        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-3 py-2 rounded-xl font-bold text-xs cursor-pointer ${activeTab === tab ? 'bg-amber-800 text-white' : 'bg-white border border-amber-200 text-slate-600'}`}
            >
              {ICONS[tab]} {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Overview' && (
          <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-amber-300 mb-8 bg-slate-900 text-white min-h-[320px] flex items-center">
            <div key={"bg"+currentSlide} className="av-pop absolute inset-y-0 right-0 pr-8 flex items-center text-[13rem] opacity-10 select-none pointer-events-none">{slide.symbol}</div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center gap-6 w-full">
              <div key={currentSlide} className="av-pop w-28 h-28 md:w-36 md:h-36 rounded-2xl border-2 border-amber-400/80 shadow-2xl flex-shrink-0 bg-gradient-to-br from-amber-800 to-amber-950 flex items-center justify-center text-6xl md:text-7xl">{slide.symbol}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow">{slide.badge}</span>
                  <span className="text-amber-300 text-xs font-bold">✦ Valmiki Ramayana Chronicle ✦</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-amber-100 tracking-wide mb-1">{slide.name}</h3>
                <p className="text-amber-400 text-xs font-bold mb-2">{slide.title}</p>
                <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-medium max-w-2xl">"{slide.deed}"</p>
                <div className="flex items-center gap-2 mt-4">
                  {ramayanaSlides.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/30 hover:bg-white/60'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Balance (Kosh)</p>
                <h3 className={`text-2xl font-black mt-2 ${netBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>₹ {netBalance.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Aagman (Total Income)</p>
                <h3 className="text-2xl font-black mt-2 text-emerald-600">₹ {totalIncome.toLocaleString()}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vyaya (Total Expense)</p>
                <h3 className="text-2xl font-black mt-2 text-rose-600">₹ {totalExpense.toLocaleString()}</h3>
              </div>
            </div>
            {txTable}
          </>
        )}

        {activeTab === 'Transactions' && txTable}

        {activeTab === 'To collect' && (
          <div className="space-y-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Baaki (To Collect)</p>
              <h3 className="text-2xl font-black mt-2 text-amber-700">₹ {totalDue.toLocaleString()}</h3>
            </div>
            <form onSubmit={addDue} className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div><label className={labelCls}>Party Name</label><input type="text" required placeholder="Jaise: Sharma ji" value={dueForm.party} onChange={(e) => setDueForm({ ...dueForm, party: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Rashi (₹)</label><input type="number" required min="0" step="0.01" placeholder="0.00" value={dueForm.amount} onChange={(e) => setDueForm({ ...dueForm, amount: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Due Date</label><input type="date" value={dueForm.dueDate} onChange={(e) => setDueForm({ ...dueForm, dueDate: e.target.value })} className={inputCls} /></div>
              <button type="submit" className={primaryBtn}>➕ Add Baaki</button>
            </form>
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4">📥 Wasooli List</h2>
              {dues.length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">Koi baaki nahi hai. Sab hisab saaf! 🎉</p>
              ) : (
                <div className="divide-y divide-amber-50">
                  {dues.map((d) => {
                    const overdue = d.dueDate && new Date(d.dueDate) < new Date();
                    return (
                      <div key={d.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-800">{d.party}</p>
                          <p className={`text-xs ${overdue ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>{d.dueDate ? `Due: ${d.dueDate}${overdue ? ' (late)' : ''}` : 'No due date'}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-amber-700">₹ {d.amount.toLocaleString()}</span>
                          <button onClick={() => receiveDue(d)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-lg cursor-pointer">✔ Mila</button>
                          <button onClick={() => { if (window.confirm('Delete this entry?')) deleteDue(d.id); }} className="text-slate-400 hover:text-rose-600 text-sm cursor-pointer">🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Bank Accounts' && (
          <div className="space-y-6 mb-12 max-w-3xl">
            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
              <h2 className="text-xl font-bold text-amber-900 mb-1">🏦 Bank & Online Accounts Management</h2>
              <p className="text-xs text-slate-500 mb-4">Add your personal bank accounts or UPI IDs here so you can tag your transactions accurately.</p>
              
              <form onSubmit={handleAddBank} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-6">
                <div><label className={labelCls}>Account Name</label><input type="text" required placeholder="Jaise: SBI Current, Paytm" value={bankForm.name} onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })} className={inputCls} /></div>
                <div><label className={labelCls}>Account No / UPI ID</label><input type="text" placeholder="**** 1234 / UPI" value={bankForm.accountNo} onChange={(e) => setBankForm({ ...bankForm, accountNo: e.target.value })} className={inputCls} /></div>
                <button type="submit" className={primaryBtn}>➕ Add Account</button>
              </form>

              <div className="divide-y divide-amber-50">
                {bankAccounts.map((acc) => (
                  <div key={acc.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{acc.name}</p>
                      <p className="text-xs text-slate-500">{acc.accountNo || 'Secure Vault Tag'}</p>
                    </div>
                    {bankAccounts.length > 1 && (
                      <button onClick={() => deleteBank(acc.id)} className="text-rose-500 text-xs font-bold hover:underline cursor-pointer">Remove</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Reports' && (
          <div className="space-y-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[['Aagman (Income)', totalIncome, 'text-emerald-600'], ['Vyaya (Expense)', totalExpense, 'text-rose-600'], ['Net Balance', netBalance, netBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'], ['Baaki (To Collect)', totalDue, 'text-amber-700']].map(([label, val, cls]) => (
                <div key={label} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                  <h3 className={`text-xl font-black mt-2 ${cls}`}>₹ {val.toLocaleString()}</h3>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
              <div className="flex flex-wrap justify-between items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-amber-900">📈 Bachat (Savings): {totalIncome > 0 ? Math.round((netBalance / totalIncome) * 100) : 0}% of income</h2>
                <button onClick={downloadCSV} disabled={transactions.length === 0} className="bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer">⬇ Download CSV (Excel)</button>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-amber-900 mb-4">Kharcha by Category</h2>
              {byCategory.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">Abhi koi kharcha darj nahi hai.</p> : byCategory.map(([cat, amt]) => (
                <div key={cat} className="mb-3">
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-1"><span>{cat}</span><span>₹ {amt.toLocaleString()} ({Math.round((amt / totalExpense) * 100)}%)</span></div>
                  <div className="h-2.5 bg-amber-100 rounded-full overflow-hidden"><div className="h-full bg-amber-600 rounded-full transition-all duration-700" style={{ width: `${(amt / totalExpense) * 100}%` }}></div></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-amber-900 mb-4">Payment Mode</h2>
              {byMode.length === 0 ? <p className="text-sm text-slate-500 py-4 text-center">Abhi koi len-den nahi hai.</p> : (
                <div className="flex flex-wrap gap-3">
                  {byMode.map(([mode, amt]) => (
                    <div key={mode} className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-amber-900 uppercase">{mode}</p>
                      <p className="font-black text-slate-800">₹ {amt.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Business setup' && (
          <form onSubmit={saveBiz} className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 max-w-2xl space-y-4 mb-12">
            <h2 className="text-xl font-bold text-amber-900">⚙️ Vyapaar ki Jaankari</h2>
            <div><label className={labelCls}>Business Name</label><input type="text" placeholder="Jaise: Sharma General Store" value={biz.name} onChange={(e) => setBiz({ ...biz, name: e.target.value })} className={inputCls} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Owner Name</label><input type="text" value={biz.owner} onChange={(e) => setBiz({ ...biz, owner: e.target.value })} className={inputCls} /></div>
              <div><label className={labelCls}>Phone</label><input type="text" value={biz.phone} onChange={(e) => setBiz({ ...biz, phone: e.target.value })} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>GSTIN (optional)</label><input type="text" maxLength={15} placeholder="15-character GST number" value={biz.gstin} onChange={(e) => setBiz({ ...biz, gstin: e.target.value.toUpperCase() })} className={inputCls + ' tracking-widest'} /></div>
            <div><label className={labelCls}>Address</label><textarea rows={3} value={biz.address} onChange={(e) => setBiz({ ...biz, address: e.target.value })} className={inputCls}></textarea></div>
            <button type="submit" className={primaryBtn}>Surakshit Karein 💾</button>
            {bizSaved && <p className="text-sm text-emerald-600 font-bold text-center">✔ Saved on this device!</p>}
            
            <div className="pt-4 border-t border-amber-100 text-center text-amber-900/60 text-sm signature-font">
              Chinmoy Suryakant Band
            </div>
          </form>
        )}

        <footer className="mt-12 py-4 border-t border-amber-200/60 text-center text-amber-900/60 text-sm signature-font">
          ArthVed • Designed & Developed by Chinmoy Suryakant Band
        </footer>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-100">
              <h3 className="text-lg font-bold text-amber-900">Naya Karma Lekha Jodein</h3>
              <button type="button" onClick={() => { setIsModalOpen(false); setDetectedSms(''); }} className="text-slate-400 hover:text-rose-600 text-xl font-bold p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl flex flex-col justify-between">
                <p className="text-[11px] font-bold text-amber-900 mb-1">🎙️ Voice Ledger</p>
                <button 
                  type="button" 
                  onClick={startVoiceRecognition}
                  className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow transition ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-800 text-white hover:bg-amber-900'}`}
                >
                  {isListening ? 'Sun rahe hain...' : 'Bolie'}
                </button>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-2xl flex flex-col justify-between">
                <p className="text-[11px] font-bold text-amber-900 mb-1">📋 SMS Auto-Paste</p>
                <button 
                  type="button" 
                  onClick={checkClipboardForSMS}
                  className="w-full py-1.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shadow transition"
                >
                  Detect SMS
                </button>
              </div>
            </div>

            {detectedSms && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-[11px] text-emerald-900">
                <span className="font-bold">💡 SMS Detected & Auto-Filled:</span> {detectedSms}
              </div>
            )}

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className={labelCls}>Vivaran (Description)</label>
                <input type="text" required placeholder="Jaise: Yajna Samagri, Seva daan..." value={txData.text} onChange={(e) => setTxData({ ...txData, text: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Rashi (Amount in ₹)</label>
                <input type="number" required min="0" step="0.01" placeholder="0.00" value={txData.amount} onChange={(e) => setTxData({ ...txData, amount: e.target.value })} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Prakar (Type)</label>
                  <select value={txData.type} onChange={(e) => setTxData({ ...txData, type: e.target.value })} className={inputCls}>
                    <option value="income">Aagman (Income)</option>
                    <option value="expense">Vyaya (Expense)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Payment Mode</label>
                  <select value={txData.paymentMode} onChange={(e) => setTxData({ ...txData, paymentMode: e.target.value })} className={inputCls}>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Online">Online</option>
                    <option value="Credit Sales">Credit Sales</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Bank / AccountTag</label>
                  <select value={txData.bankAccount} onChange={(e) => setTxData({ ...txData, bankAccount: e.target.value })} className={inputCls}>
                    {bankAccounts.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <input type="text" placeholder="Jaise: Samagri, Bhent..." value={txData.category} onChange={(e) => setTxData({ ...txData, category: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-amber-100">
                <button type="button" onClick={() => { setIsModalOpen(false); setDetectedSms(''); }} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer">Surakshit Karein</button>
              </div>
            </form>
            <div className="mt-4 pt-3 border-t border-amber-100 text-center text-amber-900/60 text-xs signature-font">
              Chinmoy Suryakant Band
            </div>
          </div>
        </div>
      )}
    </div>
  );
}