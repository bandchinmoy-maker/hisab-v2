'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export const LANGS = [
  { id: 'en', label: 'English' },
  { id: 'hl', label: 'Hinglish' },
  { id: 'hi', label: 'हिन्दी' },
]
const IDX = { en: 0, hl: 1, hi: 2 }

// Every text in the app: [English, Hinglish, Hindi]
export const S = {
  tagline: ['Every thought, on purpose.', 'Har vichaar, ek maksad ke saath.', 'हर विचार, एक मक़सद के साथ।'],
  tabToday: ['Today', 'Aaj', 'आज'],
  tabReflect: ['Reflect', 'Soch', 'सोच'],
  tabWeek: ['My Week', 'Mera Hafta', 'मेरा हफ़्ता'],
  welcomeHead: ['Your thoughts, your feelings, your voice — all in one place.', 'Apni soch, apne ehsaas, apni baat — sab ek jagah.', 'अपनी सोच, अपने एहसास, अपनी बात — सब एक जगह।'],
  welcomeSub: ['A 3-minute daily practice to think clearly and feel steady.', 'Roz 3 minute ka abhyaas — saaf soch aur steady mann ke liye.', 'रोज़ 3 मिनट का अभ्यास — साफ़ सोच और स्थिर मन के लिए।'],
  start: ['Get started', 'Shuru karein', 'शुरू करें'],
  login: ['Log in', 'Log in', 'लॉग इन'],
  trust: ['Private. Not therapy. For adults (18+).', 'Aapka apna. Therapy nahi. 18+ ke liye.', 'आपका अपना। थेरेपी नहीं। 18+ के लिए।'],
  pThinkT: ['Think', 'Soch', 'सोच'],
  pThinkD: ['Look at a problem through a lens', 'Kisi pareshani ko ek nazariye se dekhein', 'किसी परेशानी को एक नज़रिये से देखें'],
  pFeelT: ['Feel', 'Mann', 'मन'],
  pFeelD: ['Check in with your mind', 'Apne mann ka haal dekhein', 'अपने मन का हाल देखें'],
  pTalkT: ['Connect', 'Samvaad', 'संवाद'],
  pTalkD: ['Small private circles — coming soon', 'Chhote nijee groups — jaldi aa rahe hain', 'छोटे निजी समूह — जल्द आ रहे हैं'],
  hello: ['Hello', 'Namaste', 'नमस्ते'],
  moodQ: ['How is your mind right now?', 'Abhi aapka mann kaisa hai?', 'अभी आपका मन कैसा है?'],
  notePh: ['Write one line (optional)', 'Ek line likhein (zaroori nahi)', 'एक पंक्ति लिखें (ज़रूरी नहीं)'],
  saveCheck: ['Save check-in', 'Check-in save karein', 'चेक-इन सेव करें'],
  saving: ['Saving...', 'Saving...', 'सेव हो रहा है...'],
  checkSaved: ['Check-in saved ✔', 'Check-in save ho gaya ✔', 'चेक-इन सेव हो गया ✔'],
  lowMsg: ['Today feels heavy. Talking to someone you trust can help. If you need support, please contact a helpline or a doctor.', 'Aaj bhaari din lag raha hai. Kisi apne se baat karna madad kar sakta hai. Zarurat ho to helpline ya doctor se sampark karein.', 'आज का दिन भारी लग रहा है। किसी अपने से बात करना मदद कर सकता है। ज़रूरत हो तो हेल्पलाइन या डॉक्टर से संपर्क करें।'],
  thoughtLbl: ['Thought for today', 'Aaj ka vichaar', 'आज का विचार'],
  thinkOn: ['🧭 Think this through', '🧭 Is par soch kar dekhein', '🧭 इस पर सोचकर देखें'],
  reflectNow: ['🧭 Reflect on how you feel', '🧭 Apne mann par soch karein', '🧭 अपने मन पर सोचें'],
  saveFail: ['Could not save. Please try again.', 'Save nahi ho paya. Kripya dobara try karein.', 'सेव नहीं हो पाया। कृपया दोबारा कोशिश करें।'],
  topicQ: ['What is bothering you today?', 'Aaj aapko kya pareshan kar raha hai?', 'आज आपको क्या परेशान कर रहा है?'],
  topicPh: ['Or write in your own words...', 'Ya apne shabdon mein likhein...', 'या अपने शब्दों में लिखें...'],
  next: ['Next →', 'Aage badhein →', 'आगे बढ़ें →'],
  lensQ: ['Which lens would you like to use?', 'Kis nazariye se dekhna chahenge?', 'किस नज़रिये से देखना चाहेंगे?'],
  back: ['← Back', '← Wapas', '← वापस'],
  moodBefore: ['How do you feel right now?', 'Abhi aap kaisa mehsoos kar rahe hain?', 'अभी आप कैसा महसूस कर रहे हैं?'],
  moodAfter: ['And how do you feel after thinking this through?', 'Ab soch ke baad aap kaisa mehsoos kar rahe hain?', 'अब सोचने के बाद आप कैसा महसूस कर रहे हैं?'],
  saveRefl: ['Save', 'Save karein', 'सेव करें'],
  reflSaved: ['Reflection saved ✔ Try one small step today.', 'Reflection save ho gaya ✔ Aaj ka ek chhota kadam zaroor uthayein.', 'रिफ़्लेक्शन सेव हो गया ✔ आज एक छोटा कदम ज़रूर उठाइए।'],
  newRefl: ['New reflection', 'Nayi reflection', 'नया रिफ़्लेक्शन'],
  pastRefl: ['Past reflections', 'Pichli reflections', 'पिछले रिफ़्लेक्शन'],
  weekTitle: ['Your mind this week', 'Is hafte ka mann', 'इस हफ़्ते का मन'],
  loading: ['Loading...', 'Loading...', 'लोड हो रहा है...'],
  weekCounts: ['{c} check-ins and {r} reflections this week.', '{c} check-ins aur {r} reflections is hafte.', 'इस हफ़्ते {c} चेक-इन और {r} रिफ़्लेक्शन।'],
  lowestDay: ['Your heaviest day was {d}. What was different that day?', 'Sabse bhaari din {d} raha. Us din kya alag tha?', 'सबसे भारी दिन {d} रहा। उस दिन क्या अलग था?'],
  weekEmpty: ['Do your first check-in in “Today” and it will show up here.', 'Pehla check-in “Aaj” mein karein, phir yahan dikhega.', 'पहला चेक-इन “आज” में करें, फिर यहाँ दिखेगा।'],
  shift: ['After your reflections, your mood changed by {d} on average (a small sample, just a gentle pointer).', 'Reflection ke baad aapka mood average {d} badla (chhote sample par, bas ek halka sanket).', 'रिफ़्लेक्शन के बाद आपका मूड औसतन {d} बदला (छोटे नमूने पर, बस एक हल्का संकेत)।'],
  dataTitle: ['Your data', 'Aapka data', 'आपका डेटा'],
  dataDesc: ['Your check-ins and reflections are tied only to your account. You can download or permanently delete them at any time.', 'Aapke check-ins aur reflections sirf aapke account se jude hain. Aap kabhi bhi unhe download ya hamesha ke liye delete kar sakte hain.', 'आपके चेक-इन और रिफ़्लेक्शन सिर्फ़ आपके अकाउंट से जुड़े हैं। आप कभी भी उन्हें डाउनलोड या हमेशा के लिए डिलीट कर सकते हैं।'],
  download: ['⬇ Download my data', '⬇ Mera data download', '⬇ मेरा डेटा डाउनलोड'],
  wipe: ['🗑 Delete everything', '🗑 Sab delete karein', '🗑 सब डिलीट करें'],
  wipeConfirm: ['All your check-ins and reflections will be deleted forever. Continue?', 'Aapke saare check-ins aur reflections hamesha ke liye delete ho jayenge. Continue?', 'आपके सारे चेक-इन और रिफ़्लेक्शन हमेशा के लिए डिलीट हो जाएँगे। जारी रखें?'],
  wipeDone: ['Deleted.', 'Delete ho gaya.', 'डिलीट हो गया।'],
  wipeFail: ['Could not delete.', 'Delete nahi ho paya.', 'डिलीट नहीं हो पाया।'],
  safety: [
    'Arthveda is a reflection tool, not therapy or medical advice. If you feel unsafe or in crisis, please contact local emergency services or a helpline right away. In India, Tele-MANAS: 14416 (please check the number is still current).',
    'Arthveda reflection ka ek saadhan hai, therapy ya medical salah nahi. Agar aap khud ko unsafe ya crisis mein mehsoos karein, to apne shehar ki emergency service ya kisi helpline se turant sampark karein. India mein Tele-MANAS: 14416 (kripya check karein ki number abhi bhi sahi hai).',
    'अर्थवेदा आत्म-चिंतन का एक साधन है, थेरेपी या चिकित्सा सलाह नहीं। अगर आप खुद को असुरक्षित या संकट में महसूस करें, तो अपने शहर की आपातकालीन सेवा या किसी हेल्पलाइन से तुरंत संपर्क करें। भारत में Tele-MANAS: 14416 (कृपया जाँच लें कि नंबर अभी भी सही है)।',
  ],
}

const LangContext = createContext({ lang: 'hl', setLang: () => {}, t: (k) => k })

export function LangProvider({ children }) {
  const [lang, setLangState] = useState('hl')
  useEffect(() => {
    try {
      const saved = localStorage.getItem('arthveda_lang')
      if (saved && IDX[saved] !== undefined) setLangState(saved)
    } catch (err) {}
  }, [])
  const setLang = (l) => {
    setLangState(l)
    try { localStorage.setItem('arthveda_lang', l) } catch (err) {}
  }
  const t = (key, vars = {}) => {
    const row = S[key]
    if (!row) return key
    let s = row[IDX[lang]] || row[1]
    Object.keys(vars).forEach((k) => { s = s.split(`{${k}}`).join(String(vars[k])) })
    return s
  }
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)

export function LangSwitch({ dark = false }) {
  const { lang, setLang } = useLang()
  return (
    <div className={`inline-flex rounded-full border overflow-hidden text-xs font-bold ${dark ? 'border-white/30' : 'border-[#E3D9B5]'}`} role="group" aria-label="Language">
      {LANGS.map((l) => (
        <button
          key={l.id}
          onClick={() => setLang(l.id)}
          className={`px-3 py-1.5 cursor-pointer transition ${lang === l.id ? (dark ? 'bg-[#E05A38] text-white' : 'bg-[#1B3B22] text-[#F4EEDC]') : (dark ? 'text-white/80 hover:bg-white/10' : 'text-[#4A5D50] hover:bg-[#E3D9B5]/40')}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
