import { themeInfos } from '@/lib/theme-registry.generated'
import { HeroPlayground } from '../client/hero-playground'
import { InstallCopy } from '../client/install-copy'

const stats = [
  { num: themeInfos.length, label: 'Themes' },
  { num: 7, label: 'Frameworks' },
  { num: 0, label: 'Dependencies' },
]

export function Hero({ docsLink = '/docs' }: { docsLink?: string }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-8 pt-20 pb-30">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <h1 className="mb-7 font-display text-[clamp(56px,7.2vw,104px)] leading-[0.96] font-[380] tracking-[-0.035em] [&_.soft]:font-normal [&_.soft]:text-ink-3">
              Avatars that <span className="soft">feel</span>
              <br />
              like people.
            </h1>

            <p className="mt-6 max-w-[56ch] font-body text-[18px] leading-[1.55] text-ink-2">
              Typed, SSR-first avatars for seven frameworks with a growing theme
              library and no runtime dependencies. Build avatars manually or
              draft one from a photo.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={docsLink}
                className="inline-flex items-center gap-2 rounded-lg border border-ink bg-ink px-4 py-2.5 text-sm font-medium whitespace-nowrap text-paper transition hover:border-white hover:bg-white active:translate-y-px"
              >
                <span>Get started</span>
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </a>
              <InstallCopy />
            </div>

            <div className="mt-12 flex items-stretch gap-0 border-t border-line pt-6">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`pr-8 ${index < stats.length - 1 ? 'mr-8 border-r border-line' : ''}`}
                >
                  <div className="font-display text-[36px] leading-none font-normal tracking-[-0.02em]">
                    {stat.num}
                  </div>
                  <div className="mt-2 font-code text-[11px] tracking-[0.16em] uppercase text-ink-3">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0">
            <HeroPlayground />
          </div>
        </div>
      </div>
    </section>
  )
}
