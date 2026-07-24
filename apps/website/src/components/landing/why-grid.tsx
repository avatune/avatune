const cells = [
  {
    num: '01',
    title: (
      <>
        SSR-first, <span className="font-normal text-ink-3">by default</span>
      </>
    ),
    desc: 'Every avatar renders to deterministic SVG on the server. No hydration jank, no layout shift, no flicker on cold cache.',
    icon: 'ssr',
  },
  {
    num: '02',
    title: (
      <>
        Seeded & <span className="font-normal text-ink-3">deterministic</span>
      </>
    ),
    desc: 'The same seed produces the same avatar across renders, processes, and CDN edges. Cache the SVG or generate it at request time.',
    icon: 'seed',
  },
  {
    num: '03',
    title: 'Tree-shakeable themes',
    desc: 'Each theme is its own package. Ship only the styles you import. Average bundle: 4.1kb gzipped per theme.',
    icon: 'tree',
  },
  {
    num: '04',
    title: (
      <>
        Typed <span className="font-normal text-ink-3">end-to-end</span>
      </>
    ),
    desc: 'Theme tokens, part names, and configuration all flow through TypeScript. Autocomplete every hair style and skin tone.',
    icon: 'ts',
  },
  {
    num: '05',
    title: 'Framework-native APIs',
    desc: (
      <>
        Not a wrapper. <code>@avatune/react</code>, <code>@avatune/svelte</code>
        , and friends each compile to idiomatic primitives.
      </>
    ),
    icon: 'fw',
  },
  {
    num: '06',
    title: (
      <>
        Compose, don’t <span className="font-normal text-ink-3">configure</span>
      </>
    ),
    desc: 'Every part is a slot. Swap eyebrows from one theme into another, or drop in your own SVG. The system stays consistent.',
    icon: 'compose',
  },
] as const

type CellIconName = (typeof cells)[number]['icon']

function CellIcon({ icon }: { icon: CellIconName }) {
  const iconProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  if (icon === 'ssr') {
    return (
      <svg aria-hidden="true" {...iconProps}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M7 20h10" />
        <path d="M12 16v4" />
      </svg>
    )
  }

  if (icon === 'seed') {
    return (
      <svg aria-hidden="true" {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M3 12h18" />
      </svg>
    )
  }

  if (icon === 'tree') {
    return (
      <svg aria-hidden="true" {...iconProps}>
        <path d="M12 3v18" />
        <path d="M5 9h14" />
        <path d="M8 15h8" />
      </svg>
    )
  }

  if (icon === 'ts') {
    return (
      <svg aria-hidden="true" {...iconProps}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 10h6" />
        <path d="M12 10v8" />
        <path d="M16 14c0-1 1-2 2-2" />
      </svg>
    )
  }

  if (icon === 'fw') {
    return (
      <svg aria-hidden="true" {...iconProps}>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="9" strokeDasharray="2 3" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" {...iconProps}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

export function WhyGrid() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-[1280px] px-8 py-24">
        <div className="mb-16 grid grid-cols-1 items-end gap-6 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2.5 font-code text-[11px] tracking-[0.18em] uppercase text-ink-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-mark shadow-[0_0_0_3px_rgba(25,179,133,0.18)]" />
              Why Avatune
            </div>
            <h2 className="mt-[18px] font-display text-[clamp(38px,4.6vw,64px)] leading-[1.02] font-[380] tracking-[-0.028em] [&_.soft]:text-ink-3">
              An avatar primitive,
              <br />
              not a <span className="soft">vibe pack.</span>
            </h2>
          </div>
          <p className="max-w-[56ch] font-body text-[18px] leading-[1.55] text-ink-2">
            Avatune provides fast, typed, and themable avatar generation with
            deterministic output for production use.
          </p>
        </div>

        <div className="grid grid-cols-1 border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((cell) => (
            <div
              key={cell.num}
              className="flex min-h-[240px] flex-col gap-3.5 border-r border-b border-line p-9"
            >
              <div className="flex items-start justify-between">
                <span className="font-code text-[11px] tracking-[0.12em] text-ink-4">
                  {cell.num}
                </span>
                <span className="text-ink-3">
                  <CellIcon icon={cell.icon} />
                </span>
              </div>
              <div className="font-display text-[26px] leading-[1.1] tracking-[-0.02em]">
                {cell.title}
              </div>
              <p className="text-[14.5px] leading-[1.55] text-ink-2">
                {cell.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
