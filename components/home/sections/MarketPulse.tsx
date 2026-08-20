'use client'

import { useEffect, useRef, useState } from 'react'
import SectionContainer from './SectionContainer'
import { MARKET_PULSE_METRICS, MARKET_PULSE_UPDATED, type MarketPulseMetric } from '@/lib/market-pulse'

// Animates the numeric portion of a mixed-format value ("34,200", "104 wks",
// "$312B", "2,847") from 0 up to its target, preserving whatever
// prefix/suffix surrounds the number.
function useCountUp(target: string, run: boolean, durationMs = 900) {
  const [display, setDisplay] = useState(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return reduced ? target : target.replace(/[\d,]+/, '0')
  })
  const startedRef = useRef(false)

  useEffect(() => {
    if (!run || startedRef.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Initial state above already resolved to the final target in this case.
      return
    }
    startedRef.current = true

    const match = target.match(/[\d,]+/)
    if (!match) {
      // No digits to animate -- initial state above already equals target
      // (a no-op .replace() when there's nothing to match).
      return
    }
    const raw = match[0]
    const targetNum = parseInt(raw.replace(/,/g, ''), 10)
    const prefix = target.slice(0, match.index)
    const suffix = target.slice((match.index ?? 0) + raw.length)
    const hasComma = raw.includes(',')

    const start = performance.now()
    let frame: number

    function tick(now: number) {
      const progress = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(targetNum * eased)
      const formatted = hasComma ? current.toLocaleString('en-US') : String(current)
      setDisplay(`${prefix}${formatted}${suffix}`)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [run, target, durationMs])

  return display
}

function MetricCell({ metric, run }: { metric: MarketPulseMetric; run: boolean }) {
  const display = useCountUp(metric.value, run)
  return (
    <div className="border-r border-b border-black p-6 sm:p-8">
      <p className="text-4xl sm:text-5xl lg:text-6xl font-black tabular-nums leading-none">
        {display}
      </p>
      <p className="text-[11px] uppercase tracking-widest text-black/40 mt-4">{metric.label}</p>
      <p className="text-xs text-[#3ecf8e] mt-1.5 tabular-nums">{metric.delta}</p>
    </div>
  )
}

export default function MarketPulse() {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="border-t border-black">
      <div
        className="px-6 sm:px-8 lg:px-12 py-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.07) 1.2px, transparent 1.2px)',
          backgroundSize: '22px 22px',
          backgroundColor: '#ffffff',
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
            Market Pulse
          </p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
            The Infrastructure Buildout
          </h2>
          <p className="mt-3 text-sm text-black/50 max-w-md leading-relaxed">
            The physical infrastructure behind AI is being built at unprecedented scale.
          </p>
        </div>
      </div>

      <SectionContainer>
        <div className="grid grid-cols-2 lg:grid-cols-4 border-l border-t border-black">
          {MARKET_PULSE_METRICS.map((metric) => (
            <MetricCell key={metric.label} metric={metric} run={inView} />
          ))}
        </div>
      </SectionContainer>

      <div className="border-t border-black/10 mt-0">
        <SectionContainer className="py-4 flex justify-end">
          <p className="text-[10px] text-black/40 uppercase tracking-wide">
            {MARKET_PULSE_UPDATED} · Corestack Market Intelligence
          </p>
        </SectionContainer>
      </div>
    </section>
  )
}
