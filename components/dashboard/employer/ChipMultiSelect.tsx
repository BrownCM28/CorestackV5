'use client'

interface Props {
  options: readonly string[]
  selected: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
}

export default function ChipMultiSelect({ options, selected, onChange, disabled }: Props) {
  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option))
    } else {
      onChange([...selected, option])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = selected.includes(option)
        return (
          <button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => toggle(option)}
            aria-pressed={isSelected}
            className={`border px-2.5 py-1 text-xs font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none ${
              isSelected ? 'bg-black text-white border-black' : 'bg-white text-black border-black'
            }`}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
