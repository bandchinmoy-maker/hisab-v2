'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useLang } from './i18n'
import { getContent } from './content'
import { saveCheckIn, getCheckIns, saveReflection, getReflections, deleteAllJournalData } from './journal'

const card = 'bg-white rounded-2xl border border-[#E3D9B5] shadow-sm p-6'
const btn = 'bg-[#1B3B22] hover:bg-[#14301a] disabled:opacity-50 text-[#F4EEDC] font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer transition'
const ghost = 'bg-[#E3D9B5]/40 hover:bg-[#E3D9B5]/70 text-[#1E2923] font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer transition'
const field = 'w-full border border-[#E3D9B5] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3B22] bg-white'
const heading = 'text-xl font-black font-serif text-[#1B3B22]'
const dayKey = (d) => { const x = new Date(d); return `${x.getFullYear()}-${x.getMonth() + 1}-${x.getDate()}` }

export function SafetyNote() {
  const { t } = useLang()
  return <p className="text-xs text-[#4A5D50]">{t('safety')}</p>
}

function MoodPicker({ value, onChange, moods, big = false }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {moods.map((m) => (
        <button key={m.v} type="button" onClick={() => onChange(m.v)} className={`flex-1 min-w-[56px] ${big ? 'py-3' : 'py-2'} rounded-xl border text-center cursor-pointer ${value === m.v ? 'border-[#1B3B22] bg-[#1B3B22]/10' : 'border-[#E3D9B5] bg-white hover:bg-[#F4EEDC]'}`}>
          <div className={big ? 'text-2xl' : 'text-xl'}>{m.e}</div>
          <div className="text-[10px] font-bold text-[#4A5D50] mt-0.5">{m.l}</div>
        </button>
      ))}
    </div>
  )
}

export function TodayView({ onReflect }) {
  const { user } = useUser()
  const { t, lang } = useLang()
  const C = getContent(lang)
  const [mood, setMood] = useState(null)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(null)
  const [lastNote, setLastNote] = useState('')
  const thought = C.THOUGHTS[new Date().getDay() % C.THOUGHTS.length]

  const submit = async () => {
    if (!mood || saving) return
    setSaving(true)
    try {
      const res = await saveCheckIn({ mood, note })
      if (!res.success) throw new Error(res.error)
      setDone(mood)
      setLastNote(note)
      setNote('')
    } catch (err) {
      console.error(err)
      alert(t('saveFail'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 mb-8">
      <div className={card}>
        <h2 className={heading}>{t('hello')}{user && user.firstName ? `, ${user.firstName}` : ''} 🙏</h2>
        <p className="text-sm text-[#4A5D50] mt-1">{t('moodQ')}</p>
        <div className="mt-4"><MoodPicker value={mood} onChange={setMood} moods={C.MOODS} big /></div>
        <input type="text" maxLength={280} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('notePh')} className={field + ' mt-4'} />
        <button onClick={submit} disabled={!mood || saving} className={btn + ' mt-4'}>{saving ? t('saving') : t('saveCheck')}</button>
        {done && (
          <div className="mt-4 bg-[#1B3B22]/5 border border-[#1B3B22]/20 rounded-xl p-3 text-sm text-[#1B3B22]">
            {t('checkSaved')}
            {done <= 2 && <span className="block mt-1">{t('lowMsg')}</span>}
            <button onClick={() => onReflect(lastNote)} className={ghost + ' mt-3 block'}>{t('reflectNow')}</button>
          </div>
        )}
      </div>
      <div className={card}>
        <p className="text-xs font-bold text-[#E05A38] uppercase tracking-wider">{t('thoughtLbl')}</p>
        <p className="text-lg font-bold text-[#1E2923] mt-2">{thought}</p>
        <button onClick={() => onReflect(thought)} className={ghost + ' mt-4'}>{t('thinkOn')}</button>
      </div>
      <SafetyNote />
    </div>
  )
}

export function ReflectView({ startTopic }) {
  const { t, lang } = useLang()
  const C = getContent(lang)
  const [step, setStep] = useState(1)
  const [topic, setTopic] = useState(startTopic || '')
  const [lensId, setLensId] = useState(null)
  const [answers, setAnswers] = useState([])
  const [moodBefore, setMoodBefore] = useState(null)
  const [moodAfter, setMoodAfter] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [past, setPast] = useState([])
  const lens = C.LENSES.find((l) => l.id === lensId)

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
      const res = await saveReflection({ topic, lens: lensId, answers, moodBefore, moodAfter })
      if (!res.success) throw new Error(res.error)
      setSaved(true)
      loadPast()
    } catch (err) {
      console.error(err)
      alert(t('saveFail'))
    } finally {
      setSaving(false)
    }
  }

  const restart = () => { setStep(1); setTopic(''); setLensId(null); setAnswers([]); setMoodBefore(null); setMoodAfter(null); setSaved(false) }
  const face = (v) => (C.MOODS.find((m) => m.v === v) || {}).e

  return (
    <div className="space-y-6 mb-8">
      {step === 1 && (
        <div className={card}>
          <h2 className={heading}>{t('topicQ')}</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {C.TOPIC_CHIPS.map((c) => (
              <button key={c} onClick={() => setTopic(c)} className={`px-3 py-2 rounded-full text-xs font-bold border cursor-pointer ${topic === c ? 'bg-[#1B3B22] text-[#F4EEDC] border-[#1B3B22]' : 'bg-white border-[#E3D9B5] text-[#1E2923] hover:bg-[#F4EEDC]'}`}>{c}</button>
            ))}
          </div>
          <textarea rows={3} maxLength={300} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t('topicPh')} className={field + ' mt-4'}></textarea>
          <button onClick={() => setStep(2)} disabled={!topic.trim()} className={btn + ' mt-4'}>{t('next')}</button>
        </div>
      )}
      {step === 2 && (
        <div className={card}>
          <h2 className={heading}>{t('lensQ')}</h2>
          <p className="text-sm text-[#4A5D50] mt-1">“{topic}”</p>
          <div className="grid gap-3 mt-4">
            {C.LENSES.map((l) => (
              <button key={l.id} onClick={() => pickLens(l)} className="text-left border border-[#E3D9B5] hover:bg-[#F4EEDC] rounded-xl p-4 cursor-pointer">
                <p className="font-bold text-[#1E2923]">{l.name}</p>
                <p className="text-xs text-[#4A5D50] mt-1">{l.tagline}</p>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className={ghost + ' mt-4'}>{t('back')}</button>
        </div>
      )}
      {step === 3 && lens && (
        <div className={card}>
          <p className="text-xs font-bold text-[#E05A38] uppercase tracking-wider">{lens.name}</p>
          <h2 className="text-lg font-black font-serif text-[#1B3B22] mt-1">“{topic}”</h2>
          <div className="mt-4">
            <p className="text-sm font-bold text-[#1E2923] mb-2">{t('moodBefore')}</p>
            <MoodPicker value={moodBefore} onChange={setMoodBefore} moods={C.MOODS} />
          </div>
          <div className="space-y-4 mt-5">
            {lens.questions.map((q, i) => (
              <div key={i}>
                <label className="block text-sm font-bold text-[#1E2923] mb-1">{i + 1}. {q}</label>
                <textarea rows={2} maxLength={1000} value={answers[i] || ''} onChange={(e) => setAnswers(answers.map((a, j) => (j === i ? e.target.value : a)))} className={field}></textarea>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <p className="text-sm font-bold text-[#1E2923] mb-2">{t('moodAfter')}</p>
            <MoodPicker value={moodAfter} onChange={setMoodAfter} moods={C.MOODS} />
          </div>
          {saved ? (
            <div className="mt-4 bg-[#1B3B22]/5 border border-[#1B3B22]/20 rounded-xl p-3 text-sm text-[#1B3B22]">
              {t('reflSaved')}
              <button onClick={restart} className={ghost + ' mt-3 block'}>{t('newRefl')}</button>
            </div>
          ) : (
            <div className="flex gap-3 mt-5">
              <button onClick={() => setStep(2)} className={ghost}>{t('back')}</button>
              <button onClick={save} disabled={saving} className={btn}>{saving ? t('saving') : t('saveRefl')}</button>
            </div>
          )}
        </div>
      )}
      {past.length > 0 && (
        <div className={card}>
          <h3 className="font-bold font-serif text-[#1B3B22] mb-3">{t('pastRefl')}</h3>
          <div className="space-y-2">
            {past.map((r) => (
              <details key={r.id} className="border border-[#E3D9B5] rounded-xl p-3">
                <summary className="text-sm font-bold text-[#1E2923] cursor-pointer">
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {r.topic}
                  {r.moodBefore && r.moodAfter ? ` · ${face(r.moodBefore)}→${face(r.moodAfter)}` : ''}
                </summary>
                <ul className="mt-2 space-y-1 text-sm text-[#4A5D50] list-disc pl-5">
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
  const { t, lang } = useLang()
  const [checks, setChecks] = useState([])
  const [refl, setRefl] = useState([])
  const [loaded, setLoaded] = useState(false)
  const locale = lang === 'hi' ? 'hi-IN' : 'en-IN'

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
    return { label: d.toLocaleDateString(locale, { weekday: 'short' }), full: d.toLocaleDateString(locale, { weekday: 'long' }), avg }
  })
  const withData = days.filter((d) => d.avg !== null)
  const lowest = withData.length > 1 ? withData.reduce((a, b) => (b.avg < a.avg ? b : a)) : null
  const weekRefl = refl.filter((r) => new Date(r.createdAt).getTime() >= Date.now() - 7 * 86400000).length
  const both = refl.filter((r) => r.moodBefore && r.moodAfter && new Date(r.createdAt).getTime() >= Date.now() - 30 * 86400000)
  const shift = both.length >= 3 ? both.reduce((a, r) => a + (r.moodAfter - r.moodBefore), 0) / both.length : null

  const exportData = async () => {
    const [c, r] = await Promise.all([getCheckIns(365), getReflections(500)])
    const data = { app: 'arthveda', exportedAt: new Date().toISOString(), checkIns: c.success ? c.data : [], reflections: r.success ? r.data : [] }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = 'arthveda-my-data.json'
    a.click()
  }

  const wipe = async () => {
    if (!window.confirm(t('wipeConfirm'))) return
    const res = await deleteAllJournalData()
    if (res.success) { setChecks([]); setRefl([]); alert(t('wipeDone')) } else alert(t('wipeFail'))
  }

  return (
    <div className="space-y-6 mb-8">
      <div className={card}>
        <h2 className={heading}>{t('weekTitle')}</h2>
        {!loaded ? <p className="text-sm text-[#4A5D50] mt-3">{t('loading')}</p> : (
          <>
            <div className="flex items-end gap-3 h-40 mt-4">
              {days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-[#1B3B22] rounded-t-lg transition-all" style={{ height: d.avg ? `${(d.avg / 5) * 100}%` : '4px', opacity: d.avg ? 1 : 0.2 }}></div>
                  <span className="text-[11px] font-bold text-[#4A5D50] mt-1">{d.label}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-[#4A5D50] mt-4">{t('weekCounts', { c: checks.length, r: weekRefl })}</p>
            {lowest && <p className="text-sm text-[#1E2923] mt-2">{t('lowestDay', { d: lowest.full })}</p>}
            {shift !== null && <p className="text-sm text-[#1E2923] mt-2">{t('shift', { d: (shift > 0 ? '+' : '') + shift.toFixed(1) })}</p>}
            {withData.length === 0 && <p className="text-sm text-[#4A5D50] mt-2">{t('weekEmpty')}</p>}
          </>
        )}
      </div>
      <div className={card}>
        <h3 className="font-bold font-serif text-[#1B3B22]">{t('dataTitle')}</h3>
        <p className="text-xs text-[#4A5D50] mt-1">{t('dataDesc')}</p>
        <div className="flex gap-3 mt-3 flex-wrap">
          <button onClick={exportData} className={ghost}>{t('download')}</button>
          <button onClick={wipe} className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-sm px-5 py-2.5 rounded-xl cursor-pointer">{t('wipe')}</button>
        </div>
      </div>
      <SafetyNote />
    </div>
  )
}
