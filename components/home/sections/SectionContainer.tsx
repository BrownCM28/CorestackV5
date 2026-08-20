interface Props {
  children: React.ReactNode
  className?: string
}

export default function SectionContainer({ children, className = '' }: Props) {
  return (
    <div className={`max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 ${className}`}>{children}</div>
  )
}
