'use client'

import { useState } from 'react'
import { TodayView, ReflectView, WeekView, SafetyNote } from './wellbeing'
import { UserButton } from '@clerk/nextjs'

export default function Home() {
  const [tab, setTab] = useState('today')
  const [reflectionTopic, setReflectionTopic] = useState('')

  return (
    <main className="min-h-screen bg-[#FBF3E4] text-[#1B1F3B] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with Logo and Profile */}
        <header className="flex justify-between items-center mb-8 border-b border-amber-200 pb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight">
              arthv<span className="text-amber-600">e</span>da
            </h1>
            <span className="text-xs bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">Prototype</span>
          </div>
          <UserButton afterSignOutUrl="/" />
        </header>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl border border-amber-200 shadow-sm">
          <button 
            onClick={() => setTab('today')} 
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${tab === 'today' ? 'bg-amber-800 text-white shadow-sm' : 'text-slate-700 hover:bg-amber-50'}`}
          >
            Aaj (Today)
          </button>
          <button 
            onClick={() => setTab('reflect')} 
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${tab === 'reflect' ? 'bg-amber-800 text-white shadow-sm' : 'text-slate-700 hover:bg-amber-50'}`}
          >
            Scenario Engine
          </button>
          <button 
            onClick={() => setTab('week')} 
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${tab === 'week' ? 'bg-amber-800 text-white shadow-sm' : 'text-slate-700 hover:bg-amber-50'}`}
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