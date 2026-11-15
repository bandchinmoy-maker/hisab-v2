'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { MOODS, LENSES, TOPIC_CHIPS, THOUGHTS } from './content'
import { saveCheckIn, getCheckIns, saveReflection, getReflections, deleteAllJournalData } from './journal'

const card = 'bg-white rounded-2xl border border-amber-200 shadow-sm p-6'
const btn = 'bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer transition'
const ghost = 'bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer transition'
const field = 'w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white'
const dayKey = (d) => { const x = new Date(d); return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}` }
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })

export function SafetyNote() {
  return (
    <p className="text-xs text-slate-500">
      Arthveda reflection ka ek saadhan hai, therapy ya medical salah nahi. Agar aap khud ko unsafe ya crisis mein mehsoos karein, to apne shehar ki emergency service ya kisi helpline se turant sampark karein. India mein Tele-MANAS: 14416 (kripya check karein ki number abhi bhi sahi hai).
    </p>
  )
}

export function TodayView({ onReflect }) {
  const { user } = useUser()
  const [mood, setMood] = useState(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(null)
  const thought = THOUGHTS[new Date().getDay() % THOUGHTS.length]

  const submit = async () => {
    if (!mood || saving) return
    setSaving(true)
    try {
      const res = await saveCheckIn({ mood, note })
      if (!res.success) throw new Error(res.error)
      setDone(mood)
      setNote('')
    } catch (err) {
      console.error(err)
      alert('Save nahi ho paya. Kripya dobara try karein.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 mb-8 max-w-3xl">
      <div className={card}>
        <h2 className="text-xl font-black text-amber-900">Namaste{user && user.firstName ? `, ${user.firstName}` : ''} 🙏</h2>
        <p className="text-sm text-slate-600 mt-1">Abhi aapka mann kaisa hai?</p>
        <div className="flex gap-2 mt-4 flex-wrap">
          {MOODS.map((m) => (
            <button key={m.v} onClick={() => setMood(m.v)} className={`flex-1 min-w-[64px] py-3 rounded-xl border text-center cursor-pointer ${mood === m.v ? 'border-amber-700 bg-amber-100' : 'border-amber-200 bg-white hover:bg-amber-50'}`}>
              <div className="text-2xl">{m.e}</div>
              <div className="text-[11px] font-bold text-slate-600 mt-1">{m.l}</div>
            </button>
          ))}
        </div>
        <input type="text" maxLength={280} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ek line likhein (zaroori nahi)" className={field + ' mt-4'} />
        <button onClick={submit} disabled={!mood || saving} className={btn + ' mt-4'}>{saving ? 'Saving...' : 'Check-in save karein'}</button>
        {done && (
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-900">
            Check-in save ho gaya ✔
            {done <= 2 && <span className="block mt-1">Aaj bhaari din lag raha hai. Kisi apne se baat karna madad kar sakta hai. Zarurat ho to helpline ya doctor se sampark karein.</span>}
          </div>
        )}
      </div>
      <div className={card}>
        <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Aaj ka vichaar</p>
        <p className="text-lg font-bold text-slate-800 mt-2">{thought}</p>
        <button onClick={() => onReflect(thought)} className={ghost + ' mt-4'}>🧭 Is par soch kar dekhein</button>
      </div>
      <SafetyNote />
    </div>
  )
}

export function ReflectView({ startTopic }) {
  const [step, setStep] = useState(1)
  const [topic, setTopic] = useState(startTopic || '')
  const [lensId, setLensId] = useState(null)
  const [answers, setAnswers] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [past, setPast] = useState([])
  const lens = LENSES.find((l) => l.id === lensId)

  const loadPast = async () => {
    try {
      const res = await getReflections(5)
      if (res.success) setPast(res.data)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => { loadPast() }, [])

  const pickLens = (l) => { setLensId(l.id); setAnswers(l.questions.map(() => '')); setStep(3) }

  const save = async () => {
    if (saving) return
    setSaving(true)
    try {
      const res = await saveReflection({ topic, lens: lensId, answers })
      if (!res.success) throw new Error(res.error)
      setSaved(true)
      loadPast()
    } catch (err) {
      console.error(err)
      alert('Save nahi ho paya. Kripya dobara try karein.')
    } finally {
      setSaving(false)
    }
  }

  const restart = () => { setStep(1); setTopic(''); setLensId(null); setAnswers([]); setSaved(false) }

  return (
    <div className="space-y-6 mb-8 max-w-3xl">
      {step === 1 && (
        <div className={card}>
          <h2 className="text-xl font-black text-amber-900">Aaj aapko kya pareshan kar raha hai?</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {TOPIC_CHIPS.map((c) => (
              <button key={c} onClick={() => setTopic(c)} className={`px-3 py-2 rounded-full text-xs font-bold border cursor-pointer ${topic === c ? 'bg-amber-800 text-white border-amber-800' : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-50'}`}>{c}</button>
            ))}
          </div>
          <textarea rows={3} maxLength={300} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Ya apne shabdon mein likhein..." className={field + ' mt-4'}></textarea>
          <button onClick={() => setStep(2)} disabled={!topic.trim()} className={btn + ' mt-4'}>Aage badhein →</button>
        </div>
      )}
      {step === 2 && (
        <div className={card}>
          <h2 className="text-xl font-black text-amber-900">Kis nazariye se dekhna chahenge?</h2>
          <p className="text-sm text-slate-600 mt-1">“{topic}”</p>
          <div className="grid gap-3 mt-4">
            {LENSES.map((l) => (
              <button key={l.id} onClick={() => pickLens(l)} className="text-left border border-amber-200 hover:bg-amber-50 rounded-xl p-4 cursor-pointer">
                <p className="font-bold text-slate-800">{l.name}</p>
                <p className="text-xs text-slate-500 mt-1">{l.tagline}</p>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className={ghost + ' mt-4'}>← Wapas</button>
        </div>
      )}
      {step === 3 && lens && (
        <div className={card}>
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">{lens.name}</p>
          <h2 className="text-lg font-black text-slate-800 mt-1">“{topic}”</h2>
          <div className="space-y-4 mt-4">
            {lens.questions.map((q, i) => (
              <div key={i}>
                <label className="block text-sm font-bold text-slate-700 mb-1">{i + 1}. {q}</label>
                <textarea rows={2} maxLength={1000} value={answers[i] || ''} onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))} className={field}></textarea>
              </div>
            ))}
          </div>
          {saved ? (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-900">
              Reflection save ho gaya ✔ Aaj ka ek chhota kadam zaroor uthayein.
              <button onClick={restart} className={ghost + ' mt-3 block'}>Nayi reflection</button>
            </div>
          ) : (
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(2)} className={ghost}>← Wapas</button>
              <button onClick={save} disabled={saving} className={btn}>{saving ? 'Saving...' : 'Save karein'}</button>
            </div>
          )}
        </div>
      )}
      {past.length > 0 && (
        <div className={card}>
          <h3 className="font-bold text-amber-900 mb-3">Pichli reflections</h3>
          <div className="space-y-2">
            {past.map((r) => (
              <details key={r.id} className="border border-amber-100 rounded-xl p-3">
                <summary className="text-sm font-bold text-slate-700 cursor-pointer">{fmtDate(r.createdAt)} · {r.topic}</summary>
                <ul className="mt-2 space-y-1 text-sm text-slate-600 list-disc pl-5">
                  {r.answers.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </details>
            ))}
          </div>
        </div>
      )}
      <SafetyNote />
    </div>
  )
}

export function WeekView() {
  const [checks, setChecks] = useState([])
  const [refl, setRefl] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [c, r] = await Promise.all([getCheckIns(7), getReflections(200)])
        if (c.success) setChecks(c.data)
        if (r.success) setRefl(r.data)
      } catch (err) {
        console.error(err)
      }
      setLoaded(true)
    }
    load()
  }, [])

  const days = [...Array(7)].map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000)
    const key = dayKey(d)
    const list = checks.filter((c) => dayKey(c.createdAt) === key)
    const avg = list.length ? list.reduce((a, c) => a + c.mood, 0) / list.length : null
    return { label: d.toLocaleDateString('en-IN', { weekday: 'short' }), full: d.toLocaleDateString('en-IN', { weekday: 'long' }), avg }
  })
  const withData = days.filter((d) => d.avg !== null)
  const lowest = withData.length > 1 ? withData.reduce((a, b) => (b.avg < a.avg ? b : a)) : null
  const weekCut = Date.now() - 7 * 86400000
  const weekRefl = refl.filter((r) => new Date(r.createdAt).getTime() >= weekCut).length

  const exportData = async () => {
    const [c, r] = await Promise.all([getCheckIns(365), getReflections(500)])
    const data = { app: 'arthveda', exportedAt: new Date().toISOString(), checkIns: c.success ? c.data : [], reflections: r.success ? r.data : [] }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = 'arthveda-my-data.json'
    a.click()
  }

  const wipe = async () => {
    if (!window.confirm('Aapke saare check-ins aur reflections hamesha ke liye delete ho jayenge. Continue?')) return
    const res = await deleteAllJournalData()
    if (res.success) { setChecks([]); setRefl([]); alert('Delete ho gaya.') } else alert('Delete nahi ho paya.')
  }

  return (
    <div className="space-y-6 mb-8 max-w-3xl">
      <div className={card}>
        <h2 className="text-xl font-black text-amber-900">Is hafte ka mann</h2>
        {!loaded ? <p className="text-sm text-slate-500 mt-3">Loading...</p> : (
          <>
            <div className="flex items-end gap-3 h-40 mt-4">
              {days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-amber-500 rounded-t-lg transition-all" style={{ height: d.avg ? `${(d.avg / 5) * 100}%` : '4px', opacity: d.avg ? 1 : 0.25 }}></div>
                  <span className="text-[11px] font-bold text-slate-500 mt-1">{d.label}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 mt-4">{checks.length} check-ins aur {weekRefl} reflections is hafte.</p>
            {lowest && <p className="text-sm text-slate-700 mt-2">Sabse bhaari din <b>{lowest.full}</b> raha. Us din kya alag tha?</p>}
            {withData.length === 0 && <p className="text-sm text-slate-500 mt-2">Pehla check-in “Aaj” mein karein, phir yahan dikhega.</p>}
          </>
        )}
      </div>
      <div className={card}>
        <h3 className="font-bold text-amber-900">Aapka data</h3>
        <p className="text-xs text-slate-500 mt-1">Aapke check-ins aur reflections sirf aapke account se jude hain. Aap kabhi bhi unhe download ya hamesha ke liye delete kar sakte hain.</p>
        <div className="flex gap-3 mt-3 flex-wrap">
          <button onClick={exportData} className={ghost}>⬇ Mera data download</button>
          <button onClick={wipe} className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer">🗑 Sab delete karein</button>
        </div>
      </div>
      <SafetyNote />
    </div>
  )
}
