'use client'

interface Props {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
}

export default function SelectCard({ label, description, selected, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`text-left border border-black px-6 py-8 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none ${
        selected ? 'bg-black text-white' : 'bg-white text-black hover:bg-black/5'
      }`}
    >
      <span className="block text-lg font-semibold">{label}</span>
      {description && (
        <span className={`block text-sm mt-1 ${selected ? 'text-white/70' : 'text-black/50'}`}>
          {description}
        </span>
      )}
    </button>
  )
}
