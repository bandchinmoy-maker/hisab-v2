'use client';

import React, { useState, useEffect, useRef } from 'react'
import { getTransactions, saveTransaction, deleteTransaction as deleteTxServer } from './actions'

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

// Country list: [country, currency code, symbol, approximate rate to INR].
// NOTE: rates are typed in by hand and are only approximate.
const COUNTRY_ROWS = [
  ["India", "INR", "₹", 1], ["Qatar", "QAR", "QR", 22.80], ["United States", "USD", "$", 86.50],
  ["United Arab Emirates", "AED", "AED", 23.50], ["United Kingdom", "GBP", "£", 110.20],
  ["Eurozone (Germany, France, Italy, etc.)", "EUR", "€", 92.40], ["Saudi Arabia", "SAR", "SR", 23.05],
  ["Afghanistan", "AFN", "؋", 1.20], ["Albania", "ALL", "L", 0.92], ["Algeria", "DZD", "دج", 0.64],
  ["Andorra", "EUR", "€", 92.40], ["Angola", "AOA", "Kz", 0.10], ["Argentina", "ARS", "$", 0.088],
  ["Armenia", "AMD", "֏", 0.22], ["Australia", "AUD", "A$", 55.60], ["Austria", "EUR", "€", 92.40],
  ["Azerbaijan", "AZN", "₼", 50.80], ["Bahamas", "BSD", "$", 86.50], ["Bahrain", "BHD", "BD", 229.30],
  ["Barbados", "BBD", "$", 43.25], ["Belarus", "BYN", "Br", 26.50], ["Belgium", "EUR", "€", 92.40],
  ["Belize", "BZD", "BZ$", 42.80], ["Benin", "XOF", "CFA", 0.14], ["Bhutan", "BTN", "Nu.", 1.00],
  ["Bolivia", "BOB", "Bs.", 12.50], ["Bosnia and Herzegovina", "BAM", "KM", 47.20], ["Botswana", "BWP", "P", 6.40],
  ["Brazil", "BRL", "R$", 14.80], ["Brunei", "BND", "B$", 65.40], ["Bulgaria", "BGN", "лв", 47.20],
  ["Burkina Faso", "XOF", "CFA", 0.14], ["Burundi", "BIF", "FBu", 0.030], ["Cambodia", "KHR", "៛", 0.021],
  ["Cameroon", "XAF", "FCFA", 0.14], ["Canada", "CAD", "C$", 61.20], ["Cape Verde", "CVE", "Esc", 0.84],
  ["Central African Republic", "XAF", "FCFA", 0.14], ["Chad", "XAF", "FCFA", 0.14], ["Chile", "CLP", "$", 0.091],
  ["China", "CNY", "¥", 11.90], ["Colombia", "COP", "$", 0.021], ["Comoros", "KMF", "CF", 0.19],
  ["Congo (Democratic Republic)", "CDF", "FC", 0.030], ["Congo (Republic)", "XAF", "FCFA", 0.14],
  ["Costa Rica", "CRC", "₡", 0.17], ["Croatia", "EUR", "€", 92.40], ["Cuba", "CUP", "$", 3.60],
  ["Cyprus", "EUR", "€", 92.40], ["Czech Republic", "CZK", "Kč", 3.70], ["Denmark", "DKK", "kr", 12.35],
  ["Djibouti", "DJF", "Fdj", 0.49], ["Dominica", "XCD", "EC$", 32.00], ["Dominican Republic", "DOP", "RD$", 1.45],
  ["Ecuador", "USD", "$", 86.50], ["Egypt", "EGP", "E£", 1.78], ["El Salvador", "USD", "$", 86.50],
  ["Equatorial Guinea", "XAF", "FCFA", 0.14], ["Eritrea", "ERN", "Nfk", 5.76], ["Estonia", "EUR", "€", 92.40],
  ["Eswatini", "SZL", "L", 4.75], ["Ethiopia", "ETB", "Br", 0.74], ["Fiji", "FJD", "FJ$", 38.50],
  ["Finland", "EUR", "€", 92.40], ["France", "EUR", "€", 92.40], ["Gabon", "XAF", "FCFA", 0.14],
  ["Gambia", "GMD", "D", 1.25], ["Georgia", "GEL", "₾", 31.80], ["Germany", "EUR", "€", 92.40],
  ["Ghana", "GHS", "GH₵", 5.80], ["Greece", "EUR", "€", 92.40], ["Grenada", "XCD", "EC$", 32.00],
  ["Guatemala", "GTQ", "Q", 11.20], ["Guinea", "GNF", "FG", 0.010], ["Guinea-Bissau", "XOF", "CFA", 0.14],
  ["Guyana", "GYD", "G$", 0.41], ["Haiti", "HTG", "G", 0.65], ["Honduras", "HNL", "L", 3.50],
  ["Hungary", "HUF", "Ft", 0.23], ["Iceland", "ISK", "kr", 0.62], ["Indonesia", "IDR", "Rp", 0.0054],
  ["Iran", "IRR", "﷼", 0.0020], ["Iraq", "IQD", "ع.د", 0.066], ["Ireland", "EUR", "€", 92.40],
  ["Israel", "ILS", "₪", 23.40], ["Italy", "EUR", "€", 92.40], ["Jamaica", "JMD", "J$", 0.55],
  ["Japan", "JPY", "¥", 0.56], ["Jordan", "JOD", "JD", 122.00], ["Kazakhstan", "KZT", "₸", 0.17],
  ["Kenya", "KES", "KSh", 0.67], ["Kiribati", "AUD", "A$", 55.60], ["Korea (North)", "KPW", "₩", 0.96],
  ["Korea (South)", "KRW", "₩", 0.061], ["Kuwait", "KWD", "KD", 281.50], ["Kyrgyzstan", "KGS", "с", 0.98],
  ["Laos", "LAK", "₭", 0.0040], ["Latvia", "EUR", "€", 92.40], ["Lebanon", "LBP", "ل.ل", 0.00096],
  ["Lesotho", "LSL", "L", 4.75], ["Liberia", "LRD", "L$", 0.44], ["Libya", "LYD", "LD", 17.80],
  ["Liechtenstein", "CHF", "CHF", 98.20], ["Lithuania", "EUR", "€", 92.40], ["Luxembourg", "EUR", "€", 92.40],
  ["Madagascar", "MGA", "Ar", 0.019], ["Malawi", "MWK", "MK", 0.050], ["Malaysia", "MYR", "RM", 19.40],
  ["Maldives", "MVR", "Rf", 5.60], ["Mali", "XOF", "CFA", 0.14], ["Malta", "EUR", "€", 92.40],
  ["Marshall Islands", "USD", "$", 86.50], ["Mauritania", "MRU", "UM", 2.20], ["Mauritius", "MUR", "₨", 1.88],
  ["Mexico", "MXN", "$", 4.30], ["Micronesia", "USD", "$", 86.50], ["Moldova", "MDL", "L", 4.80],
  ["Monaco", "EUR", "€", 92.40], ["Mongolia", "MNT", "₮", 0.025], ["Montenegro", "EUR", "€", 92.40],
  ["Morocco", "MAD", "DH", 8.60], ["Mozambique", "MZN", "MT", 1.35], ["Myanmar", "MMK", "K", 0.041],
  ["Namibia", "NAD", "$", 4.75], ["Nauru", "AUD", "A$", 55.60], ["Nepal", "NPR", "रू", 0.62],
  ["Netherlands", "EUR", "€", 92.40], ["New Zealand", "NZD", "NZ$", 51.20], ["Nicaragua", "NIO", "C$", 2.35],
  ["Niger", "XOF", "CFA", 0.14], ["Nigeria", "NGN", "₦", 0.055], ["North Macedonia", "MKD", "ден", 1.50],
  ["Norway", "NOK", "kr", 7.90], ["Oman", "OMR", "OMR", 224.80], ["Palau", "USD", "$", 86.50],
  ["Panama", "PAB", "B/.", 86.50], ["Papua New Guinea", "PGK", "K", 22.10], ["Paraguay", "PYG", "₲", 0.011],
  ["Peru", "PEN", "S/.", 23.20], ["Philippines", "PHP", "₱", 1.48], ["Poland", "PLN", "zł", 21.50],
  ["Portugal", "EUR", "€", 92.40], ["Romania", "RON", "lei", 18.50], ["Russia", "RUB", "₽", 0.92],
  ["Rwanda", "RWF", "FRw", 0.064], ["Saint Kitts and Nevis", "XCD", "EC$", 32.00], ["Saint Lucia", "XCD", "EC$", 32.00],
  ["Saint Vincent and the Grenadines", "XCD", "EC$", 32.00], ["Samoa", "WST", "T", 31.50], ["San Marino", "EUR", "€", 92.40],
  ["Sao Tome and Principe", "STN", "Db", 3.75], ["Senegal", "XOF", "CFA", 0.14], ["Serbia", "RSD", "дин", 0.79],
  ["Seychelles", "SCR", "SR", 6.30], ["Sierra Leone", "SLL", "Le", 0.0039], ["Singapore", "SGD", "S$", 65.40],
  ["Slovakia", "EUR", "€", 92.40], ["Slovenia", "EUR", "€", 92.40], ["Solomon Islands", "SBD", "SI$", 10.20],
  ["Somalia", "SOS", "Sh.so", 0.15], ["South Africa", "ZAR", "R", 4.75], ["South Sudan", "SSP", "£", 0.066],
  ["Spain", "EUR", "€", 92.40], ["Sri Lanka", "LKR", "Rs", 0.29], ["Sudan", "SDG", "SD", 0.14],
  ["Suriname", "SRD", "$", 2.30], ["Sweden", "SEK", "kr", 8.10], ["Switzerland", "CHF", "CHF", 98.20],
  ["Syria", "SYP", "£", 0.034], ["Taiwan", "TWD", "NT$", 2.65], ["Tajikistan", "TJS", "SM", 7.90],
  ["Tanzania", "TZS", "TSh", 0.033], ["Thailand", "THB", "฿", 2.50], ["Timor-Leste", "USD", "$", 86.50],
  ["Togo", "XOF", "CFA", 0.14], ["Tonga", "TOP", "T$", 36.50], ["Trinidad and Tobago", "TTD", "TT$", 12.70],
  ["Tunisia", "TND", "د.ت", 27.50], ["Turkey", "TRY", "₺", 2.50], ["Turkmenistan", "TMT", "m", 24.70],
  ["Tuvalu", "AUD", "A$", 55.60], ["Uganda", "UGX", "USh", 0.023], ["Ukraine", "UAH", "₴", 2.10],
  ["Uruguay", "UYU", "$U", 2.15], ["Uzbekistan", "UZS", "so'm", 0.0068], ["Vanuatu", "VUV", "VT", 0.72],
  ["Vatican City", "EUR", "€", 92.40], ["Venezuela", "VES", "Bs.", 2.35], ["Vietnam", "VND", "₫", 0.0034],
  ["Yemen", "YER", "﷼", 0.35], ["Zambia", "ZMW", "ZK", 3.20], ["Zimbabwe", "ZWL", "Z$", 0.27]
];

const GLOBAL_COUNTRIES = COUNTRY_ROWS.map(([country, currency, symbol, rateToINR]) => ({ country, currency, symbol, rateToINR }));

const TABS = ['Overview', 'Transactions', 'To collect', 'Reports', 'Bank Accounts', 'Business setup'];
const ICONS = { 'Overview': '📊', 'Transactions': '📜', 'To collect': '📥', 'Reports': '📈', 'Bank Accounts': '🏦', 'Business setup': '⚙️' };

const screenCls = 'min-h-screen bg-[#120f0c] flex items-center justify-center p-4';
const inputCls = 'w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white';
const labelCls = 'block text-xs font-bold text-slate-700 uppercase mb-1';
const primaryBtn = 'w-full py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer';
const emptyTx = { text: '', amount: '', type: 'income', category: 'General', paymentMode: 'Cash', bankAccount: 'Main Cash Drawer', country: 'India', currency: 'INR', symbol: '₹' };

// Amount of a transaction in rupees (old entries without amountINR are treated as rupees)
const inr = (t) => t.amountINR ?? t.amount;

// Turns any saved entry (old browser data or backup file) into what the database expects
const toPayload = (t) => ({
  text: String(t.text || ''),
  amount: Number(t.amount) || 0,
  amountINR: Number(inr(t)) || 0,
  type: t.type === 'expense' ? 'expense' : 'income',
  category: t.category || 'General',
  paymentMode: t.paymentMode || 'Cash',
  bankAccount: t.bankAccount || 'Main Cash Drawer',
  country: t.country || 'India',
  currency: t.currency || 'INR',
  symbol: t.symbol || '₹',
  date: t.date || new Date().toLocaleDateString()
});

const monthKey = (t) => { const d = new Date(t.createdAt || Date.now()); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; };
const monthLabel = (k) => { const [y, m] = k.split('-'); return new Date(+y, +m - 1, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' }); };

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

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Live exchange rates (units of each currency per 1 INR). Falls back to the typed-in rates if offline.
  const [liveRates, setLiveRates] = useState(null);
  const [ratesDate, setRatesDate] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [dbStatus, setDbStatus] = useState('loading');
  const [oldLocalCount, setOldLocalCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [monthFilter, setMonthFilter] = useState('all');
  const [search, setSearch] = useState('');
  const getRate = (c) => (liveRates && liveRates[c.currency] ? 1 / liveRates[c.currency] : c.rateToINR);

  // Reload all transactions from the database and remember if it worked
  const refreshTx = async () => {
    try {
      const res = await getTransactions();
      if (res.success) { setTransactions(res.data); setDbStatus('ok'); return true; }
    } catch (err) {
      console.error('Could not load transactions', err);
    }
    setDbStatus('error');
    return false;
  };

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
        alert("Music file not found. Please put music.mp3 inside your project's public folder.");
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

  const receiveDue = async (due) => {
    try {
      const res = await saveTransaction({
        text: `Received from ${due.party}`,
        amount: due.amount,
        amountINR: due.amount,
        type: 'income',
        category: 'Udhaar Wapasi',
        paymentMode: 'Cash',
        bankAccount: bankAccounts[0]?.name || 'Main Cash Drawer',
        country: 'India',
        currency: 'INR',
        symbol: '₹',
        date: new Date().toLocaleDateString()
      });
      if (!res.success) throw new Error(res.error);
      saveDues(dues.filter((d) => d.id !== due.id));
      await refreshTx();
    } catch (err) {
      console.error(err);
      alert('Could not save to the database. The entry was NOT removed from To collect. Please try again.');
    }
  };

  const deleteDue = (id) => saveDues(dues.filter((d) => d.id !== id));

  const deleteTx = async (id) => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    try {
      const res = await deleteTxServer(id);
      if (!res.success) throw new Error(res.error);
      await refreshTx();
    } catch (err) {
      console.error(err);
      alert('Could not delete. Please try again.');
    }
  };

  // Move entries saved in this browser (old version of the app) into the database
  const importOldLocal = async () => {
    try {
      const old = JSON.parse(localStorage.getItem('arthved_tx') || '[]');
      if (!old.length) return;
      if (!window.confirm(`Move ${old.length} old entries from this browser to the database?`)) return;
      let failed = 0;
      for (const t of [...old].reverse()) {
        const res = await saveTransaction(toPayload(t));
        if (!res.success) failed++;
      }
      if (failed === 0) { localStorage.removeItem('arthved_tx'); setOldLocalCount(0); }
      await refreshTx();
      alert(failed === 0 ? 'All old entries moved to the database ✔' : `${failed} entries failed. Nothing was removed from this browser, so you can try again (entries that did move may appear twice).`);
    } catch (err) {
      console.error(err);
      alert('Could not move the old data. Please try again.');
    }
  };
  const openAdd = () => { setEditingId(null); setIsModalOpen(true); };
  const openEdit = (tx) => {
    setEditingId(tx.id);
    setTxData({ text: tx.text, amount: String(tx.amount), type: tx.type, category: tx.category || 'General', paymentMode: tx.paymentMode || 'Cash', bankAccount: tx.bankAccount || 'Main Cash Drawer', country: tx.country || 'India', currency: tx.currency || 'INR', symbol: tx.symbol || '₹' });
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingId(null); setDetectedSms(''); setTxData(emptyTx); };

  const downloadBackup = () => {
    const data = { app: 'arthved', version: 1, exportedAt: new Date().toISOString(), transactions, dues, bankAccounts, biz };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = `arthved-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };
  const restoreBackup = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const d = JSON.parse(reader.result);
        if (d.app !== 'arthved' || !Array.isArray(d.transactions)) throw new Error('bad file');
        if (!window.confirm(`Add ${d.transactions.length} transactions from this backup to the database? Existing transactions stay (restoring the same file twice creates copies). Dues, bank accounts and business info on this device will be replaced.`)) return;
        let failed = 0;
        for (const t of [...d.transactions].reverse()) {
          const res = await saveTransaction(toPayload(t));
          if (!res.success) failed++;
        }
        saveDues(Array.isArray(d.dues) ? d.dues : []);
        if (Array.isArray(d.bankAccounts) && d.bankAccounts.length) { setBankAccounts(d.bankAccounts); localStorage.setItem('arthved_banks', JSON.stringify(d.bankAccounts)); }
        if (d.biz) { setBiz(d.biz); localStorage.setItem('arthved_biz', JSON.stringify(d.biz)); }
        await refreshTx();
        alert(failed === 0 ? 'Backup restored ✔' : `Backup restored, but ${failed} transactions could not be saved.`);
      } catch (err) {
        console.error(err);
        alert('This is not a valid ArthVed backup file, or the database could not be reached.');
      }
    };
    reader.readAsText(file);
  };

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
      const numberMatch = transcript.match(/\d[\d,]*(?:\.\d+)?/);
      const amount = numberMatch ? numberMatch[0].replace(/,/g, '') : '';
      const text = transcript.replace(/\d[\d,]*(?:\.\d+)?/g, '').trim();
      const lower = transcript.toLowerCase();
      // Works for both English-letter and Devanagari speech results
      const isExpense = ['kharcha', 'kharch', 'paid', 'diya', 'खर्च', 'खर्चा', 'दिया', 'दिए'].some((w) => lower.includes(w));

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
      // Reads amounts like "Rs 1,500.00", "INR 250", "₹99"
      const numMatch = text.match(/(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d+)?)/i);
      const amount = numMatch ? numMatch[1].replace(/,/g, '') : '';
      const lower = text.toLowerCase();
      const isExpense = lower.includes('debited') || lower.includes('paid') || lower.includes('sent');

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
    const rows = [['Date', 'Description', 'Category', 'Payment Mode', 'Bank Account', 'Country', 'Currency', 'Type', 'Amount', 'Amount in INR'], ...transactions.map((t) => [t.date, t.text, t.category, t.paymentMode, t.bankAccount || 'Main Cash Drawer', t.country || 'India', t.currency || 'INR', t.type, t.amount, inr(t)])];
    const csv = rows.map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    // The \uFEFF makes Hindi text show correctly in Excel
    a.href = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'arthved-report.csv';
    a.click();
  };

  const months = [...new Set(transactions.map(monthKey))].sort().reverse();
  const viewTx = monthFilter === 'all' ? transactions : transactions.filter((t) => monthKey(t) === monthFilter);
  const q = search.trim().toLowerCase();
  const tableTx = q ? viewTx.filter((t) => `${t.text} ${t.category} ${t.bankAccount} ${t.paymentMode}`.toLowerCase().includes(q)) : viewTx;
  const bankBalance = (name) => transactions.filter((t) => (t.bankAccount || 'Main Cash Drawer') === name).reduce((a, t) => a + (t.type === 'income' ? inr(t) : -inr(t)), 0);

  const totalDue = dues.reduce((a, d) => a + d.amount, 0);
  const byCategory = Object.entries(viewTx.filter((t) => t.type === 'expense').reduce((m, t) => { const k = t.category || 'General'; m[k] = (m[k] || 0) + inr(t); return m; }, {})).sort((a, b) => b[1] - a[1]);
  const byMode = Object.entries(viewTx.reduce((m, t) => { const k = t.paymentMode || 'Cash'; m[k] = (m[k] || 0) + inr(t); return m; }, {}));

  // Fetch daily exchange rates (cached for 12 hours)
  useEffect(() => {
    const loadRates = async () => {
      try {
        const cached = JSON.parse(localStorage.getItem('arthved_rates') || 'null');
        if (cached && Date.now() - cached.time < 12 * 60 * 60 * 1000) {
          setLiveRates(cached.rates);
          setRatesDate(cached.updated);
          return;
        }
        const res = await fetch('https://open.er-api.com/v6/latest/INR');
        const data = await res.json();
        if (data.result === 'success' && data.rates) {
          const updated = (data.time_last_update_utc || '').slice(0, 16);
          localStorage.setItem('arthved_rates', JSON.stringify({ time: Date.now(), rates: data.rates, updated }));
          setLiveRates(data.rates);
          setRatesDate(updated);
        }
      } catch (err) {
        console.error('Could not load exchange rates, using saved approximate rates', err);
      }
    };
    loadRates();
  }, []);

  // Music player lives here so it keeps playing when the screen changes
  useEffect(() => {
    const a = new Audio('/music.mp3');
    a.loop = true;
    audioRef.current = a;
    return () => a.pause();
  }, []);

  useEffect(() => {
    refreshTx();
    const timer = setTimeout(() => {
      try {
        setOldLocalCount(JSON.parse(localStorage.getItem('arthved_tx') || '[]').length);
      } catch (err) {
        console.error('Could not read old browser entries', err);
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
    localStorage.removeItem('arthved_dues');
    localStorage.removeItem('arthved_biz');
    localStorage.removeItem('arthved_banks');
    setDues([]);
    setBiz({ name: '', owner: '', gstin: '', phone: '', address: '' });
    setBankAccounts([{ id: 1, name: 'Main Cash Drawer', type: 'Cash', accountNo: 'Cash' }]);
    setStep('welcome');
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (saving || !txData.text || !txData.amount) return;
    const amountVal = parseFloat(txData.amount);
    const countryObj = GLOBAL_COUNTRIES.find(c => c.country === (txData.country || 'India')) || GLOBAL_COUNTRIES[0];
    const old = editingId ? transactions.find((t) => t.id === editingId) : null;
    // If amount and currency are unchanged, keep the rupee value from the original day
    const unchanged = old && old.amount === amountVal && (old.currency || 'INR') === countryObj.currency;
    const amountINR = unchanged ? inr(old) : Math.round(amountVal * getRate(countryObj) * 100) / 100;
    const bankAccount = bankAccounts.some(b => b.name === txData.bankAccount) ? txData.bankAccount : (bankAccounts[0]?.name || 'Main Cash Drawer');

    setSaving(true);
    try {
      if (txData.paymentMode === 'Credit Sales') {
        // A credit sale is not income yet. It goes to "To collect" and becomes income when you press "Mila".
        saveDues([{ id: Date.now(), party: txData.text, amount: amountINR, dueDate: '' }, ...dues]);
        if (old) await deleteTxServer(old.id);
      } else {
        const res = await saveTransaction({
          id: old ? old.id : undefined,
          text: txData.text,
          amount: amountVal,
          amountINR,
          type: txData.type,
          category: txData.category || 'General',
          paymentMode: txData.paymentMode || 'Cash',
          bankAccount,
          country: countryObj.country,
          currency: countryObj.currency,
          symbol: countryObj.symbol,
          date: old ? old.date : new Date().toLocaleDateString()
        });
        if (!res.success) throw new Error(res.error);
      }
      await refreshTx();
      setIsModalOpen(false);
      setEditingId(null);
      // Keep the chosen country for the next entry
      setTxData({ ...emptyTx, country: countryObj.country, currency: countryObj.currency, symbol: countryObj.symbol });
      setDetectedSms('');
    } catch (err) {
      console.error(err);
      alert('Could not save to the database. Please check your internet and try again. Nothing was lost: your form is still open.');
    } finally {
      setSaving(false);
    }
  };

  const totalIncome = viewTx.filter(t => t.type === 'income').reduce((a, c) => a + inr(c), 0);
  const totalExpense = viewTx.filter(t => t.type === 'expense').reduce((a, c) => a + inr(c), 0);
  const netBalance = totalIncome - totalExpense;

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#120f0c] flex flex-col items-center justify-center font-sans text-amber-100 overflow-hidden relative">
        <AnimStyles />
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
        <AnimStyles />
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
        <AnimStyles />
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
        <AnimStyles />
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
            onClick={() => { if (window.confirm('This removes your PIN and your dues, bank accounts and business info from this device. Your transactions in the database are NOT deleted. Continue?')) handleResetVault(); }}
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
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-xl font-bold text-amber-900 flex items-center gap-2"><span>📜</span> Karma Lekha (Transactions)</h2>
        <span className={`text-xs px-3 py-1 rounded-lg font-bold ${dbStatus === 'ok' ? 'bg-emerald-100 text-emerald-800' : dbStatus === 'error' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'}`}>
          {dbStatus === 'ok' ? 'Cloud database connected 🟢' : dbStatus === 'error' ? 'Database not reachable 🔴' : 'Connecting…'}
        </span>
      </div>
      {tableTx.length === 0 ? (
        <p className="text-sm text-slate-500 py-8 text-center">Abhi tak koi bhi len-den darj nahi kiya gaya hai.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-amber-100 text-xs text-amber-900 uppercase">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Vivaran (Description)</th>
                <th className="py-3 px-4">Country / Currency</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Account Tag</th>
                <th className="py-3 px-4">Rashi (Amount)</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-50 text-sm">
              {tableTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-amber-50/50">
                  <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{tx.text}</td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded font-bold">
                      {tx.country || 'India'} ({tx.currency || 'INR'})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{tx.category || 'General'}</td>
                  <td className="py-3 px-4"><span className="bg-amber-100 text-amber-900 text-xs px-2 py-1 rounded-md font-bold">{tx.paymentMode || 'Cash'}</span></td>
                  <td className="py-3 px-4"><span className="bg-slate-100 text-slate-800 text-xs px-2 py-1 rounded-md font-medium">🏦 {tx.bankAccount || 'Main Cash Drawer'}</span></td>
                  <td className={`py-3 px-4 font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.type === 'income' ? '+' : '-'} {tx.symbol || '₹'} {Math.abs(tx.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button onClick={() => openEdit(tx)} className="text-amber-700 hover:text-amber-900 mr-3 cursor-pointer" title="Edit">✏️</button>
                    <button onClick={() => deleteTx(tx.id)} className="text-slate-400 hover:text-rose-600 cursor-pointer" title="Delete">🗑️</button>
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

        <div className="pt-4 border-t border-amber-100 space-y-3">
          <div className="bg-amber-900 text-amber-100 p-2.5 rounded-xl text-[10px] shadow-inner space-y-1 border border-amber-700">
            <div className="flex items-center justify-between font-bold text-amber-300">
              <span>🌐 {liveRates ? 'Daily Rates' : 'Approx. Rates'} (vs INR)</span>
            </div>
            <div className="flex justify-between text-slate-200">
              <span>1 USD ≈ ₹{getRate(GLOBAL_COUNTRIES.find((c) => c.currency === 'USD')).toFixed(2)}</span>
              <span>1 QAR ≈ ₹{getRate(GLOBAL_COUNTRIES.find((c) => c.currency === 'QAR')).toFixed(2)}</span>
            </div>
            <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer" className="block text-[9px] text-amber-300/80 underline">Rates By Exchange Rate API{ratesDate ? ` • ${ratesDate}` : ''}</a>
          </div>

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
              Music by <span className="font-bold text-amber-900">Kalpesh Ajugia</span> from <span className="font-bold text-amber-900">Pixabay</span>
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
            <button onClick={openAdd} className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 cursor-pointer">
              <span>➕</span> Add Sale / Expense
            </button>
            <button onClick={toggleMusic} className="md:hidden bg-amber-100 text-amber-900 px-3 py-2.5 rounded-xl font-bold text-sm cursor-pointer">{isPlaying ? '⏸' : '🎵'}</button>
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

        {dbStatus === 'error' && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold rounded-xl p-3">
            ⚠️ Cannot reach the database. Your transactions may not be showing. Check your internet and refresh the page.
          </div>
        )}

        {['Overview', 'Transactions', 'Reports'].includes(activeTab) && (
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className={inputCls} style={{ width: 'auto' }}>
              <option value="all">All time</option>
              {months.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
            </select>
            {activeTab === 'Transactions' && (
              <input type="text" placeholder="🔍 Search description, category, account..." value={search} onChange={(e) => setSearch(e.target.value)} className={inputCls + ' md:max-w-sm'} />
            )}
          </div>
        )}

        {activeTab === 'Overview' && (
          <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-amber-300 mb-8 bg-slate-900 text-white min-h-[320px] flex items-center">
            <div key={"bg" + currentSlide} className="av-pop absolute inset-y-0 right-0 pr-8 flex items-center text-[13rem] opacity-10 select-none pointer-events-none">{slide.symbol}</div>
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
                <p className="text-[10px] text-slate-400 mt-1">*All currencies converted to ₹ (approx.)</p>
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
              <h2 className="text-xl font-bold text-amber-900 mb-1">📥 Wasooli List</h2>
              <p className="text-[11px] text-slate-400 mb-4">ℹ️ Saved on this device only for now.</p>
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
              <p className="text-xs text-slate-500 mb-4">Add your personal bank accounts or UPI IDs here so you can tag your transactions accurately. Saved on this device only for now.</p>

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
                    <div className="flex items-center gap-4">
                      <span className={`font-black ${bankBalance(acc.name) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>₹ {bankBalance(acc.name).toLocaleString()}</span>
                      {acc.id !== 1 && (
                        <button onClick={() => deleteBank(acc.id)} className="text-rose-500 text-xs font-bold hover:underline cursor-pointer">Remove</button>
                      )}
                    </div>
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

        {activeTab === 'Business setup' && (
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 max-w-2xl space-y-3 mb-12">
            <h2 className="text-xl font-bold text-amber-900">💾 Backup & Restore</h2>
            <p className="text-xs text-slate-500">Your transactions are in the cloud database. Dues, bank accounts and business info are saved on this device only, so download a backup often and keep the file safe (for example in Google Drive). The backup includes your transactions too, but not your PIN.</p>
            {oldLocalCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
                <p className="text-xs text-amber-900 font-bold">You have {oldLocalCount} old entries saved only in this browser.</p>
                <button onClick={importOldLocal} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer">☁️ Move them to the database</button>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <button onClick={downloadBackup} className="bg-amber-800 hover:bg-amber-900 text-white text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer">⬇ Download Backup</button>
              <label className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold px-4 py-2.5 rounded-xl cursor-pointer">
                ⬆ Restore from Backup
                <input type="file" accept=".json,application/json" onChange={restoreBackup} className="hidden" />
              </label>
            </div>
          </div>
        )}

        <footer className="mt-12 py-4 border-t border-amber-200/60 text-center text-amber-900/60 text-sm signature-font">
          ArthVed • Designed & Developed by Chinmoy Suryakant Band
        </footer>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-100">
              <h3 className="text-lg font-bold text-amber-900">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button type="button" onClick={closeModal} className="text-slate-400 hover:text-rose-600 text-xl font-bold p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer">✕</button>
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
                <label className={labelCls}>Select Country (Auto-detects Currency)</label>
                <select
                  value={txData.country || 'India'}
                  onChange={(e) => {
                    const selectedC = GLOBAL_COUNTRIES.find(c => c.country === e.target.value);
                    setTxData({
                      ...txData,
                      country: e.target.value,
                      currency: selectedC ? selectedC.currency : 'INR',
                      symbol: selectedC ? selectedC.symbol : '₹'
                    });
                  }}
                  className={inputCls}
                >
                  {GLOBAL_COUNTRIES.map((c) => (
                    <option key={c.country} value={c.country}>
                      {c.country} ({c.currency} - {c.symbol})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-amber-700 mt-1 font-medium">
                  ℹ️ Saved in {txData.currency || 'INR'}. 1 {txData.currency || 'INR'} ≈ ₹{getRate(GLOBAL_COUNTRIES.find((x) => x.country === txData.country) || GLOBAL_COUNTRIES[0]).toFixed(4)} {liveRates ? '(daily rate)' : '(approximate)'} — used for your ₹ totals.
                </p>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <input type="text" required placeholder="Jaise: Yajna Samagri, Seva daan..." value={txData.text} onChange={(e) => setTxData({ ...txData, text: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>
                  Amount (in {txData.currency || 'INR'} [{txData.symbol || '₹'}])
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-amber-800 font-extrabold text-sm select-none">
                    {txData.symbol || '₹'}
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={txData.amount}
                    onChange={(e) => setTxData({ ...txData, amount: e.target.value })}
                    className={inputCls + ' pl-14 font-bold text-slate-900'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Type</label>
                  <select value={txData.type} onChange={(e) => setTxData({ ...txData, type: e.target.value })} className={inputCls}>
                    <option value="income">Income (Aagman)</option>
                    <option value="expense">Expense (Vyaya)</option>
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

              {txData.paymentMode === 'Credit Sales' && (
                <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2">
                  Credit sale goes to the "To collect" tab (in ₹). It becomes income when you press ✔ Mila.
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Bank / Account Tag</label>
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
                <button type="button" onClick={closeModal} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-amber-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer">{saving ? 'Saving...' : 'Save Entry'}</button>
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
