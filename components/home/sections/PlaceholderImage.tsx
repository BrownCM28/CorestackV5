interface Props {
  caption: string
  aspect?: string
}

export default function PlaceholderImage({ caption, aspect = 'aspect-[4/3]' }: Props) {
  return (
    <div className={`${aspect} w-full border border-black/20 bg-black/[0.03] flex items-end p-4`}>
      <p className="text-[11px] text-black/35 uppercase tracking-wide">{caption}</p>
    </div>
  )
}
