'use client'

import { useState } from 'react'
import { TodayView, ReflectView, WeekView, SafetyNote } from './wellbeing'
import { UserButton } from '@clerk/nextjs'

export default function Home() {
  const [tab, setTab] = useState('today')
  const [reflectionTopic, setReflectionTopic] = useState('')

  return (
    <main className="min-h-screen bg-[#F4EEDC] text-[#1E2923] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Header with Minimalist Reference Geometry Stamp */}
        <header className="flex justify-between items-center mb-8 border-b border-[#E3D9B5] pb-4 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B3B22] flex items-center justify-center text-[#F4EEDC] shadow-md font-serif font-bold text-xl tracking-wider">
              अ
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight font-serif text-[#1E2923]">
                arthv<span className="text-[#E05A38]">e</span>da
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-[#1B3B22] font-bold">Every thought, on purpose.</p>
            </div>
          </div>

          {/* Minimalist Circular Geometry Stamp (Inspired by reference image) */}
          <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full border border-dashed border-[#1B3B22]/30 p-1 relative animate-spin-slow">
            <div className="w-full h-full rounded-full bg-[#1B3B22]/5 flex items-center justify-center text-[8px] font-mono tracking-tighter text-[#1B3B22] text-center uppercase">
              <span>★ V2.0 </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 mb-6 bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-[#E3D9B5] shadow-xs">
          <button 
            onClick={() => setTab('today')} 
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition cursor-pointer ${tab === 'today' ? 'bg-[#1B3B22] text-[#F4EEDC] shadow-md' : 'text-[#4A5D50] hover:bg-[#E3D9B5]/40'}`}
          >
            Aaj (Today)
          </button>
          <button 
            onClick={() => setTab('reflect')} 
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition cursor-pointer ${tab === 'reflect' ? 'bg-[#1B3B22] text-[#F4EEDC] shadow-md' : 'text-[#4A5D50] hover:bg-[#E3D9B5]/40'}`}
          >
            Scenario Engine
          </button>
          <button 
            onClick={() => setTab('week')} 
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition cursor-pointer ${tab === 'week' ? 'bg-[#1B3B22] text-[#F4EEDC] shadow-md' : 'text-[#4A5D50] hover:bg-[#E3D9B5]/40'}`}
          >
            Vichaar & Data
          </button>
        </nav>

        {/* Active View Render */}
        {tab === 'today' && <TodayView onReflect={(thought) => { setReflectionTopic(thought); setTab('reflect'); }} />}
        {tab === 'reflect' && <ReflectView startTopic={reflectionTopic} />}
        {tab === 'week' && <WeekView />}
      </div>
    </main>
  )
}