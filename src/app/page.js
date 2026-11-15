'use client'

import { useState } from 'react'
import { TodayView, ReflectView, WeekView, SafetyNote } from './wellbeing'
import { UserButton } from '@clerk/nextjs'

export default function Home() {
  const [tab, setTab] = useState('today')
  const [reflectionTopic, setReflectionTopic] = useState('')

  return (
    <main className="min-h-screen bg-[#F7F3EE] text-[#2C241D] p-4 md:p-8 selection:bg-amber-700 selection:text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header with Deep Saffron/Terracotta Branding */}
        <header className="flex justify-between items-center mb-8 border-b border-[#E6DCD0] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-white shadow-md font-serif font-bold text-xl">
              अ
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight font-serif text-[#2C241D]">
                arthv<span className="text-amber-700">e</span>da
              </h1>
              <p className="text-[10px] tracking-widest uppercase text-amber-800 font-semibold">Mindfulness & Reflection</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-amber-100 text-amber-900 font-medium px-2.5 py-1 rounded-full border border-amber-200 shadow-2xs">Prototype v2</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 mb-6 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-[#E6DCD0] shadow-xs">
          <button 
            onClick={() => setTab('today')} 
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition cursor-pointer ${tab === 'today' ? 'bg-[#2C241D] text-[#F7F3EE] shadow-sm' : 'text-[#6B5E53] hover:bg-amber-50/50'}`}
          >
            Aaj (Today)
          </button>
          <button 
            onClick={() => setTab('reflect')} 
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition cursor-pointer ${tab === 'reflect' ? 'bg-[#2C241D] text-[#F7F3EE] shadow-sm' : 'text-[#6B5E53] hover:bg-amber-50/50'}`}
          >
            Scenario Engine
          </button>
          <button 
            onClick={() => setTab('week')} 
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition cursor-pointer ${tab === 'week' ? 'bg-[#2C241D] text-[#F7F3EE] shadow-sm' : 'text-[#6B5E53] hover:bg-amber-50/50'}`}
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