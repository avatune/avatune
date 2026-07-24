import Image from 'next/image'

const navLinks = [
  { href: '/docs', label: 'Docs' },
  { href: '/playground', label: 'Examples' },
  { href: '/docs#themes', label: 'Themes' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper/70 backdrop-blur-md [-webkit-backdrop-filter:blur(10px)_saturate(140%)] [backdrop-filter:blur(10px)_saturate(140%)]">
      <div className="mx-auto flex h-[60px] max-w-[1280px] items-center justify-between px-8">
        <a href="/" className="flex items-center gap-3 text-ink">
          <Image
            src="/favicon.png"
            alt="Avatune"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-display text-[22px] font-medium tracking-[-0.025em]">
            Avatune
          </span>
          <span className="ml-1 rounded-full border border-line-2 px-[7px] py-[2px] font-code text-[10.5px] tracking-[0.08em] text-ink-3">
            v3.1
          </span>
        </a>

        <nav className="hidden items-center gap-1.5 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm text-ink-2 hover:bg-paper-3 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/avatune/avatune"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-line-2 px-3 py-1.5 font-code text-xs text-ink-2 hover:border-line-strong hover:text-ink"
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.8 10.9.6.1.8-.2.8-.6v-2.2c-3.2.7-3.8-1.5-3.8-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.5-1.5 7.8-5.8 7.8-10.9C23.5 5.7 18.3.5 12 .5z" />
            </svg>
            <b className="font-semibold text-ink">GitHub</b>
          </a>
        </div>
      </div>
    </header>
  )
}
