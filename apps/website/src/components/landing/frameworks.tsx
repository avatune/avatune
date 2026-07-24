import { getFrameworkShowcaseEntries } from '@/lib/framework-showcase'
import { FrameworksTabs } from '../client/frameworks-tabs'

export async function Frameworks() {
  const entries = await getFrameworkShowcaseEntries()

  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-8 py-24">
        <div className="mb-16 grid grid-cols-1 items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2.5 font-code text-[11px] tracking-[0.18em] uppercase text-ink-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-mark shadow-[0_0_0_3px_rgba(25,179,133,0.18)]" />
              Framework adapters
            </div>
            <h2 className="mt-[18px] font-display text-[clamp(38px,4.6vw,64px)] leading-[1.02] font-[380] tracking-[-0.028em] [&_.soft]:text-ink-3">
              Seven frameworks,
              <br />
              one <span className="soft">API surface.</span>
            </h2>
          </div>
          <p className="max-w-[56ch] font-body text-[18px] leading-[1.55] text-ink-2">
            Each adapter exposes idiomatic primitives for its host framework.
            Theme tokens, deterministic seeds, and SSR behavior stay consistent
            across frameworks.
          </p>
        </div>

        <FrameworksTabs entries={entries} />
      </div>
    </section>
  )
}
