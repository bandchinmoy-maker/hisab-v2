'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { LangProvider, LangSwitch, useLang } from './i18n'
import { TodayView, ReflectView, WeekView } from './wellbeing'

// --- MOTIF CONTEXT ---
const MotifContext = createContext({ on: true, toggle: () => {} })

export function MotifProvider({ children }) {
  const [on, setOn] = useState(true)
  useEffect(() => {
    try { if (localStorage.getItem('arthveda_motif') === 'off') setOn(false) } catch (err) {}
  }, [])
  const toggle = () => {
    const next = !on
    setOn(next)
    try { localStorage.setItem('arthveda_motif', next ? 'on' : 'off') } catch (err) {}
  }
  return <MotifContext.Provider value={{ on, toggle }}>{children}</MotifContext.Provider>
}

export const useMotif = () => useContext(MotifContext)

// --- COSMIC DANCER (NATARAJA MOTIF) ---
export function CosmicDance({ size = 140, light = false, className = '' }) {
  const ink = light ? '#F4EEDC' : '#1B3B22'
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="82" fill="none" stroke="#E05A38" strokeWidth="2.5" strokeOpacity=".9" />
      {[...Array(32)].map((_, i) => (
        <line key={i} x1="100" y1="14" x2="100" y2={i % 2 ? 5 : 1} stroke="#E05A38" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${i * 11.25} 100 100)`} className={i % 2 ? 'av-flick-a' : 'av-flick-b'} />
      ))}
      <g className="av-sway" style={{ transformOrigin: '100px 120px' }}>
        <g stroke={ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M96 50Q78 44 70 57M104 50Q122 44 130 57" strokeWidth="3.5" />
          <path d="M100 64V110" strokeWidth="7" />
          <path d="M100 74L136 60M100 74L64 60M100 86L128 98M100 86L76 100" />
          <path d="M100 110L97 150L110 152" />
          <path d="M100 110L128 118L108 138" />
          <path d="M70 165H130" strokeWidth="4" />
        </g>
        <circle cx="100" cy="54" r="8.5" fill={ink} />
        <path d="M132 53H142L137 60L142 67H132L137 60Z" fill={ink} />
        <path d="M63 43C70 51 70 58 63 65C56 58 56 51 63 43Z" fill="#E05A38" />
      </g>
    </svg>
  )
}

const CosmosStyles = () => (
  <style>{`
    @keyframes av-orbit{to{transform:rotate(360deg)}}
    @keyframes av-twinkle{0%,100%{opacity:.35}50%{opacity:1}}
    @keyframes av-sway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
    .av-orbit{animation:av-orbit 40s linear infinite}
    .av-orbit-r{animation:av-orbit 60s linear infinite reverse}
    .av-sway{animation:av-sway 4s ease-in-out infinite}
    .av-stars{background-image:radial-gradient(1px 1px at 20px 30px,#fff,transparent),radial-gradient(1.5px 1.5px at 90px 80px,#F4EEDC,transparent),radial-gradient(1px 1px at 150px 40px,#fff,transparent),radial-gradient(1px 1px at 60px 140px,#fff,transparent),radial-gradient(1.5px 1.5px at 170px 150px,#E05A38,transparent);background-size:200px 200px;animation:av-twinkle 6s ease-in-out infinite}
    @media (prefers-reduced-motion:reduce){.av-orbit,.av-orbit-r,.av-stars,.av-sway{animation:none}}
  `}</style>
)

// --- WELCOME / LOGIN PAGE ---
function Welcome() {
  const { t } = useLang()
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0B1A10] via-[#142B1A] to-[#1B3B22] text-[#F4EEDC] flex flex-col items-center px-6 py-6">
      <CosmosStyles />
      <div className="av-stars absolute inset-0 pointer-events-none"></div>
      <div className="relative z-10 w-full max-w-3xl flex justify-end"><LangSwitch dark /></div>
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl mt-6 md:mt-10">
        
        {/* Integrated Cosmic Dance Nataraja Motif on Welcome Screen */}
        <div className="relative w-48 h-48 flex items-center justify-center mb-4">
          <div className="absolute inset-0 flex items-center justify-center opacity-90 scale-90">
            <CosmicDance size={170} light />
          </div>
        </div>

        <h1 className="text-5xl font-black font-serif tracking-tight">arthv<span className="text-[#E05A38]">e</span>da</h1>
        <p className="mt-2 text-xs tracking-[0.25em] uppercase text-[#F4EEDC]/70 font-bold">{t('tagline')}</p>
        <h2 className="mt-6 text-2xl md:text-3xl font-bold leading-snug">{t('welcomeHead')}</h2>
        <p className="mt-3 text-[#F4EEDC]/80">{t('welcomeSub')}</p>
        <div className="mt-8 flex gap-3 flex-wrap justify-center">
          <SignUpButton mode="modal"><button className="bg-[#E05A38] hover:bg-[#c94e2f] text-white font-bold px-7 py-3.5 rounded-xl cursor-pointer">{t('start')}</button></SignUpButton>
          <SignInButton mode="modal"><button className="border border-[#F4EEDC]/40 hover:bg-white/10 font-bold px-7 py-3.5 rounded-xl cursor-pointer">{t('login')}</button></SignInButton>
        </div>
      </div>
      <div className="relative z-10 grid sm:grid-cols-3 gap-3 w-full max-w-3xl mt-12">
        {[['pThinkT', 'pThinkD', '🧭'], ['pFeelT', 'pFeelD', '🌙'], ['pTalkT', 'pTalkD', '🪐']].map(([a, b, e]) => (
          <div key={a} className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="text-2xl">{e}</div>
            <p className="font-bold mt-1">{t(a)}</p>
            <p className="text-xs text-[#F4EEDC]/70 mt-1">{t(b)}</p>
          </div>
        ))}
      </div>
      <p className="relative z-10 text-xs text-[#F4EEDC]/60 mt-8 mb-4">{t('trust')}</p>
    </main>
  )
}

// --- MAIN APP SHELL (DASHBOARD) ---
function Shell() {
  const { t } = useLang()
  const { isLoaded, isSignedIn } = useAuth()
  const [tab, setTab] = useState('today')
  const [reflectionTopic, setReflectionTopic] = useState('')
  const { on: motifOn } = useMotif()

  if (!isLoaded) return <main className="min-h-screen bg-[#F4EEDC]"></main>
  if (!isSignedIn) return <Welcome />

  const tabs = [['today', 'tabToday'], ['reflect', 'tabReflect'], ['week', 'tabWeek']]

  return (
    <main className="min-h-screen bg-[#F4EEDC] text-[#1E2923] p-4 md:p-8 relative overflow-hidden">
      <CosmosStyles />
      
      {/* Background Subtle Watermark Motif */}
      {motifOn && (
        <div className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none">
          <CosmicDance size={380} />
        </div>
      )}

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="flex flex-wrap gap-3 justify-between items-center mb-6 border-b border-[#E3D9B5] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B3B22] flex items-center justify-center text-[#F4EEDC] shadow-md font-serif font-bold text-xl">अ</div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-serif">arthv<span className="text-[#E05A38]">e</span>da</h1>
              <p className="text-[10px] tracking-widest uppercase text-[#1B3B22] font-bold">{t('tagline')}</p>
            </div>
          </div>

          {/* Minimalist Header Cosmic Dancer Stamp */}
          <div className="hidden sm:flex items-center justify-center p-1 opacity-80">
            <CosmicDance size={45} />
          </div>

          <div className="flex items-center gap-3">
            <LangSwitch />
            <UserButton />
          </div>
        </header>

        <nav className="flex gap-2 mb-6 bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-[#E3D9B5] shadow-xs">
          {tabs.map(([id, key]) => (
            <button key={id} onClick={() => setTab(id)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition cursor-pointer ${tab === id ? 'bg-[#1B3B22] text-[#F4EEDC] shadow-md' : 'text-[#4A5D50] hover:bg-[#E3D9B5]/40'}`}>
              {t(key)}
            </button>
          ))}
        </nav>

        {tab === 'today' && <TodayView onReflect={(topic) => { setReflectionTopic(topic); setTab('reflect') }} />}
        {tab === 'reflect' && <ReflectView key={reflectionTopic} startTopic={reflectionTopic} />}
        {tab === 'week' && <WeekView />}
      </div>
    </main>
  )
}

export default function Home() {
  return (
    <LangProvider>
      <MotifProvider>
        <Shell />
      </MotifProvider>
    </LangProvider>
  )
}