'use client'

import React, { useState, useEffect } from 'react'
import { addTransaction, getTransactions } from '../app/actions'

const ramayanaCharacters = [
  {
    name: "Shri Ram (श्री राम)",
    title: "Maryada Purushottam",
    deed: "Pita ke vachan hetu 14 varsh ka vanvas sweekar kiya aur asatya par satya ki vijay sthapit ki.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Lord_Rama_drawing.jpg/440px-Lord_Rama_drawing.jpg",
    badge: "The Supreme Ideal"
  },
  {
    name: "Mata Sita (माता सीता)",
    title: "Pavitrata & Tyag ki Moorti",
    deed: "Rajya ke sabhi sukhon ka tyag karke vanvas mein sahayatri bani aur atulya dhairya ka parichay diya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Sita_Ram_Lakshman_Hanuman.jpg/500px-Sita_Ram_Lakshman_Hanuman.jpg",
    badge: "Devotion & Grace"
  },
  {
    name: "Lakshman ji (लक्ष्मण जी)",
    title: "Bhratruprem & Nishtha",
    deed: "Bina ek pal soche bade bhai Shri Ram aur bhabhi ke sath vanvas gaye aur din-raat adig pehra diya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lakshmana_in_Ramayana.jpg/400px-Lakshmana_in_Ramayana.jpg",
    badge: "Eternal Loyalty"
  },
  {
    name: "Jatayu (जटायु)",
    title: "Param Pakshiraj & Yoddha",
    deed: "Mata Sita ki raksha ke liye akash mein Ravan se bhayanak yuddh kiya aur apna jeevan samarpit kiya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Jatayu_Fights_Ravana.jpg/500px-Jatayu_Fights_Ravana.jpg",
    badge: "The Brave Protector"
  },
  {
    name: "Hanuman ji (हनुमान जी)",
    title: "Pawanputra & Sankat Mochan",
    deed: "Samudra langh kar Lanka mein Mata Sita ki khoj ki, Lanka dahan kiya aur Sanjeevani se pran bachaye.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Lord_Hanuman.jpg/440px-Lord_Hanuman.jpg",
    badge: "Supreme Devotee"
  },
  {
    name: "Sugriva & Angada (सुग्रीव व अंगद)",
    title: "Kishkindha Allies & Leaders",
    deed: "Shri Ram ke sath sachha mitrata ka vachan nibhaya aur mahan Vanara sena ka netritva kiya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Sugriva_fighting_Vali.jpg/500px-Sugriva_fighting_Vali.jpg",
    badge: "The Vanara Strength"
  },
  {
    name: "Jambavan (जाम्बवान जी)",
    title: "Riksharaj & Wise Elder",
    deed: "Apni agya aur gyan se Hanuman ji ko unki alaukik shaktiyon ka smaran karaya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Jambavan.jpg/400px-Jambavan.jpg",
    badge: "Divine Wisdom"
  },
  {
    name: "Nala & Nila (नल और नीलकंठ)",
    title: "Divine Architects",
    deed: "Vishwakarma ke aashirwad aur gyan se samudra par mahan 'Ram Setu' ka nirmaan kiya.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Rama_Setu_Construction.jpg/500px-Rama_Setu_Construction.jpg",
    badge: "Master Engineers"
  }
];

export default function DashboardUI({ onLock, onLogout, user }) {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    text: '',
    amount: '',
    type: 'income',
    category: 'General',
    paymentMode: 'Cash'
  });

  useEffect(() => {
    async function loadData() {
      const res = await getTransactions();
      if (res.success) {
        setTransactions(res.data);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text || !formData.amount) return;

    setLoading(true);
    const res = await addTransaction({
      text: formData.text,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      paymentMode: formData.paymentMode,
      date: new Date().toISOString()
    });

    if (res.success) {
      setTransactions([res.data, ...transactions]);
      setIsModalOpen(false);
      setFormData({ text: '', amount: '', type: 'income', category: 'General', paymentMode: 'Cash' });
    }
    setLoading(false);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-[#fefcf6] text-slate-800 p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-amber-200 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-900 tracking-tight flex items-center gap-2">
            <span>🪷</span> ArthVed Ledger <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full border border-amber-300">Ayodhya Edition</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">Dharmik Niti aur Vanara Sena ke prabandh par aadharit financial vault.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <span>➕</span> Add Sale
          </button>
          <button
            onClick={onLock}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-xl font-bold text-xs"
          >
            Lock Vault 🔒
          </button>
        </div>
      </header>

      {/* Main Stats Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Balance (Kosh)</p>
          <h3 className={`text-2xl font-black mt-2 ${netBalance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
            ₹ {netBalance.toLocaleString()}
          </h3>
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

      {/* Transactions List */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-amber-200 shadow-sm p-6 mb-12">
        <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
          <span>📜</span> Karma Lekha (Recent Transactions)
        </h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">Abhi tak koi bhi len-den darj nahi kiya gaya hai.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-amber-100 text-xs text-amber-900 uppercase">
                  <th className="py-3 px-4">Vivaran (Description)</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">Rashi (Amount)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50 text-sm">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-amber-50/50">
                    <td className="py-3 px-4 font-semibold text-slate-800">{tx.text}</td>
                    <td className="py-3 px-4 text-slate-600">{tx.category || 'General'}</td>
                    <td className="py-3 px-4">
                      <span className="bg-amber-100 text-amber-900 text-xs px-2 py-1 rounded-md font-bold">
                        {tx.paymentMode || 'Cash'}
                      </span>
                    </td>
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

      {/* Valmiki Ramayana & Kishkindha Chronicle Section */}
      <div className="max-w-6xl mx-auto bg-[#fefcf6] border-2 border-amber-300 rounded-2xl p-6 md:p-8 my-8 shadow-xl text-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-3xl">🏹🪷</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-amber-900 mt-2 tracking-wide">
            Valmiki Ramayana & Kishkindha Chronicle
          </h2>
          <p className="text-sm text-slate-700 mt-2 font-medium">
            The immortal legacy of Shri Ram, Mata Sita, Lakshman ji, Jatayu, and the mighty Vanara Army who established eternal righteousness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ramayanaCharacters.map((char, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden border border-amber-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-48 w-full overflow-hidden bg-amber-50">
                <img 
                  src={char.image} 
                  alt={char.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <div className="absolute top-2 right-2 bg-amber-900/80 backdrop-blur-sm text-amber-100 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  {char.badge}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-bold text-amber-900 text-base leading-snug">{char.name}</h3>
                  <p className="text-xs font-semibold text-amber-600 mt-0.5">{char.title}</p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{char.deed}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] font-bold text-amber-800">
                  <span>Valmiki Ramayana</span>
                  <span>✦ 🪔 ✦</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Modal with Cancel (Close) Button & Payment Options */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-200 relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-amber-100">
              <h3 className="text-lg font-bold text-amber-900">Naya Karma Lekha Jodein</h3>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-rose-600 text-xl font-bold p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                title="Cancel"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vivaran (Description)</label>
                <input 
                  type="text" 
                  required
                  placeholder="Jaise: Yajna Samagri, Seva daan..."
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rashi (Amount in ₹)</label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Prakar (Type)</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="income">Aagman (Income)</option>
                    <option value="expense">Vyaya (Expense)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payment Mode</label>
                  <select 
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Online">Online</option>
                    <option value="Credit Sales">Credit Sales</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                <input 
                  type="text" 
                  placeholder="Jaise: Samagri, Bhent, Nivesh..."
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-amber-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-amber-800 hover:bg-amber-900 text-amber-50 px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all cursor-pointer"
                >
                  {loading ? 'Surakshit ho raha hai...' : 'Surakshit Karein'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}