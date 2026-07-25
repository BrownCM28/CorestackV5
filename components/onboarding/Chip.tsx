'use client'

interface Props {
  label: string
  selected: boolean
  onClick: () => void
}

export default function Chip({ label, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`border border-black px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none ${
        selected ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
      }`}
    >
      {label}
    </button>
  )
}
