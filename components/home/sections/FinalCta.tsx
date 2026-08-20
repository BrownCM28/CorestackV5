import Link from 'next/link'
import SectionContainer from './SectionContainer'

export default function FinalCta() {
  return (
    <section className="border-t border-black bg-black text-white py-24 sm:py-32">
      <SectionContainer className="text-center flex flex-col items-center">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95] max-w-4xl">
          The Infrastructure Is Being Built Now.
        </h2>
        <p className="mt-6 text-base sm:text-lg text-white/60">Find the people building it.</p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#jobs"
            className="bg-white text-black px-8 py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            Explore Jobs →
          </Link>
          <Link
            href="/post"
            className="border border-white text-white px-8 py-3.5 text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-[#3ecf8e] hover:text-black hover:border-[#3ecf8e] focus-visible:ring-2 focus-visible:ring-[#3ecf8e] outline-none"
          >
            Post a Job →
          </Link>
        </div>
      </SectionContainer>
    </section>
  )
}
