import SectionContainer from './SectionContainer'
import PlaceholderImage from './PlaceholderImage'

const STACK_LAYERS = ['Data Centers', 'Power', 'Cooling', 'Networking', 'Construction', 'Energy']

export default function InfrastructureEconomy() {
  return (
    <section className="border-t border-black py-16 sm:py-20">
      <SectionContainer>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-black/40 mb-2">
              Why Corestack Exists
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-none">
              The Infrastructure Economy
            </h2>
            <div className="mt-5 text-base sm:text-lg text-black/60 leading-relaxed space-y-4 max-w-lg">
              <p>AI is being built on physical infrastructure.</p>
              <p>Data centers. Power. Cooling. Fiber. Construction. Energy.</p>
              <p>
                And every gigawatt of new capacity requires people to build, operate, and
                maintain it.
              </p>
            </div>
          </div>

          <PlaceholderImage caption="Data center interior — photo pending" />
        </div>

        <div className="mt-16 border-t border-black/10">
          <ul className="flex flex-col lg:flex-row lg:divide-x divide-black/10">
            {STACK_LAYERS.map((layer, i) => (
              <li
                key={layer}
                className="flex-1 flex items-baseline gap-4 lg:flex-col lg:items-center lg:gap-2 py-5 lg:py-8 border-b lg:border-b-0 border-black/10 last:border-b-0 lg:text-center"
              >
                <span className="text-xs text-black/30 tabular-nums flex-shrink-0">
                  0{i + 1}
                </span>
                <span className="text-lg sm:text-xl font-bold uppercase tracking-tight">
                  {layer}
                </span>
                {i < STACK_LAYERS.length - 1 && (
                  <span className="text-black/20 lg:hidden ml-auto" aria-hidden="true">
                    ↓
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </SectionContainer>
    </section>
  )
}
