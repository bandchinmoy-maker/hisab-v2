'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

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

// A stylised, abstract "cosmic dancer" inside a ring of flames (inspired by the Nataraja idea of
// balance and cosmic rhythm). Drawn as simple lines on purpose. Not a sculpture.
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
