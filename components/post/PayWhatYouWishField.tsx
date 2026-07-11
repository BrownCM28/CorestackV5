'use client'

import { useState } from 'react'
import { PRICE_MIN, PRICE_MAX, PRICE_DEFAULT } from '@/lib/constants'

interface Props {
  name?: string
  onChange?: (cents: number) => void
}

export default function PayWhatYouWishField({ name = 'price', onChange }: Props) {
  const [value, setValue] = useState(PRICE_DEFAULT)

  function update(raw: number) {
    const clamped = Math.max(PRICE_MIN, Math.min(PRICE_MAX, raw))
    setValue(clamped)
    onChange?.(clamped * 100)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Listing price</span>
        <span className="text-sm tabular-nums font-bold">${value}</span>
      </div>

      <input
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        value={value}
        onChange={(e) => update(Number(e.target.value))}
        className="w-full accent-[#3ecf8e] cursor-pointer"
        aria-label={`Listing price slider, currently $${value}`}
      />

      <div className="flex items-center gap-2">
        <label htmlFor="price-number" className="text-sm text-black/60 whitespace-nowrap">
          Enter amount ($):
        </label>
        <input
          id="price-number"
          name={name}
          type="number"
          inputMode="numeric"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={value}
          onChange={(e) => update(Number(e.target.value))}
          className="w-24 border border-black px-3 py-1.5 text-sm tabular-nums focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          aria-label="Listing price in dollars"
        />
      </div>

      <p className="text-xs text-black/50">
        Pay what you think is fair — between ${PRICE_MIN} and ${PRICE_MAX}.
        Suggested: $99.
      </p>
    </div>
  )
}
