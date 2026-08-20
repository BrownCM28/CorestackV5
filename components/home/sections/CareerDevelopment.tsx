import SectionContainer from './SectionContainer'
import { PATHWAY_STEPS } from '@/lib/career-pathway'

export default function CareerDevelopment() {
  return (
    <section className="border-t border-black py-16 sm:py-20">
      <SectionContainer>
        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
          Career Development
        </p>
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
          Build Your Way In.
        </h2>
        <p className="mt-3 text-sm text-black/50 max-w-md leading-relaxed">
          The infrastructure industry needs people at every level — from technicians
          entering the field to executives running massive campuses.
        </p>

        {/* Desktop: horizontal zigzag timeline */}
        <div className="hidden md:block relative mt-20 mb-10">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-black/15" aria-hidden="true" />
          <div className="grid grid-cols-5 relative">
            {PATHWAY_STEPS.map((step, i) => {
              const above = i % 2 === 0
              return (
                <div key={step.role} className="relative flex flex-col items-center">
                  {above && (
                    <div className="absolute bottom-[calc(50%+14px)] flex flex-col items-center text-center px-2">
                      <p className="font-bold text-sm leading-snug">{step.role}</p>
                      <p className="text-xs text-black/40 mt-1">{step.timeframe}</p>
                      <p className="text-xs font-semibold mt-1 tabular-nums" style={{ color: step.color }}>
                        {step.salary}
                      </p>
                    </div>
                  )}
                  <span
                    className="w-3 h-3 flex-shrink-0 z-10"
                    style={{ backgroundColor: step.color }}
                    aria-hidden="true"
                  />
                  {!above && (
                    <div className="absolute top-[calc(50%+14px)] flex flex-col items-center text-center px-2">
                      <p className="font-bold text-sm leading-snug">{step.role}</p>
                      <p className="text-xs text-black/40 mt-1">{step.timeframe}</p>
                      <p className="text-xs font-semibold mt-1 tabular-nums" style={{ color: step.color }}>
                        {step.salary}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <ol className="md:hidden mt-10 border-l-2 border-black/15 ml-1.5">
          {PATHWAY_STEPS.map((step) => (
            <li key={step.role} className="relative pl-8 pb-10 last:pb-0">
              <span
                className="absolute -left-[7px] top-1 w-3 h-3 flex-shrink-0"
                style={{ backgroundColor: step.color }}
                aria-hidden="true"
              />
              <p className="font-bold text-sm leading-snug">{step.role}</p>
              <p className="text-xs text-black/40 mt-1">{step.timeframe}</p>
              <p className="text-xs font-semibold mt-1 tabular-nums" style={{ color: step.color }}>
                {step.salary}
              </p>
            </li>
          ))}
        </ol>
      </SectionContainer>
    </section>
  )
}
