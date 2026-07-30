'use client'

interface Props {
  label: string
  editing: boolean
  saving: boolean
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
}

export default function ProfileSectionHeader({
  label,
  editing,
  saving,
  onEdit,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#888' }}>
        {label}
      </p>
      {editing ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="border border-black px-3 py-1 text-xs font-medium bg-white text-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="border border-black px-3 py-1 text-xs font-medium bg-black text-white hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className="border border-black px-3 py-1 text-xs font-medium bg-white text-black hover:bg-black hover:text-white transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[#3ecf8e] focus-visible:ring-offset-0 outline-none"
        >
          Edit
        </button>
      )}
    </div>
  )
}
