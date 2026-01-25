import {
  IconBook,
  IconBrandGithub,
  IconExternalLink,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui'

const themes = [
  {
    name: 'Yanliu',
    url: 'https://www.avatune.dev/packages/yanliu-theme/',
  },
  {
    name: 'Fatin Verse',
    url: 'https://www.avatune.dev/packages/fatin-verse-theme/',
  },
  {
    name: 'Miniavs',
    url: 'https://www.avatune.dev/packages/miniavs-theme/',
  },
  {
    name: 'Nevmstas',
    url: 'https://www.avatune.dev/packages/nevmstas-theme/',
  },
  {
    name: 'Ashley Seo',
    url: 'https://www.avatune.dev/packages/ashley-seo-theme/',
  },
  {
    name: 'Micah',
    url: 'https://www.avatune.dev/packages/micah-theme/',
  },
  {
    name: 'Kyute',
    url: 'https://www.avatune.dev/packages/kyute-theme/',
  },
  {
    name: 'Pacovqzz',
    url: 'https://www.avatune.dev/packages/pacovqzz-theme/',
  },
  {
    name: 'Pawel Olek',
    url: 'https://www.avatune.dev/packages/pawel-olek-man-theme/',
  },
]

const WelcomePage = () => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate('/studio')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      {/* Header */}
      <header className="bg-slate-950/80 backdrop-blur-md px-6 py-4 sm:px-10 lg:px-16 sticky top-0 z-20 shadow-sm shadow-black/20">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight flex items-center gap-2">
            <span>
              <span className="text-white">Avatune</span>{' '}
              <span className="text-slate-300">Studio</span>
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-200">
              Beta
            </span>
          </h1>
          <nav className="flex items-center gap-3 sm:gap-5 text-sm">
            <a
              href="https://www.avatune.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-transparent bg-white/0 px-3 py-1.5 text-slate-300 hover:text-white hover:border-white/10 hover:bg-white/5 transition-all"
              title="Visit Avatune.dev"
            >
              <img src="/favicon.png" alt="Avatune" className="w-5 h-5" />
              <span className="hidden sm:inline">Avatune</span>
            </a>
            <a
              href="https://www.avatune.dev/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-transparent bg-white/0 px-3 py-1.5 text-slate-300 hover:text-white hover:border-white/10 hover:bg-white/5 transition-all"
              title="Documentation"
            >
              <IconBook size={20} />
              <span className="hidden sm:inline">Docs</span>
            </a>
            <a
              href="https://github.com/avatune/avatune"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-100 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
              title="GitHub Repository"
            >
              <IconBrandGithub size={20} />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-14 sm:px-10 lg:px-16 sm:py-24 overflow-hidden">
          {/* Background accents */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-pink-500/20 blur-3xl" />
            <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute inset-x-0 -bottom-48 h-80 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent" />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-100">
                <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-pulse" />
                Designed for product teams & creators
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
                Design avatar themes
                <br className="hidden sm:block" />{' '}
                <span className="bg-linear-to-tr from-pink-400 via-fuchsia-300 to-sky-300 bg-clip-text text-transparent">
                  without touching code
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed">
                Avatune Studio helps you turn your illustrations into reusable
                avatar themes in minutes. Upload your art, position elements
                visually, and let the code be generated for you.
              </p>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
                Made for{' '}
                <span className="text-slate-200 font-semibold">designers</span>,{' '}
                <span className="text-slate-200 font-semibold">
                  product owners
                </span>
                , front-end teams, and the{' '}
                <span className="text-slate-200 font-semibold">
                  open source community
                </span>{' '}
                to create consistent avatar systems together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleGetStarted}
                  className="cursor-pointer px-8 py-4 text-base sm:text-lg font-semibold rounded-full bg-linear-to-tr from-pink-500 via-fuchsia-500 to-sky-400 text-slate-950 hover:brightness-110 transition-all"
                >
                  Start creating a theme
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                No signup required during beta. Works with React, Vue, Svelte,
                and Vanilla projects.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 py-16 sm:px-10 lg:px-16 bg-slate-950">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-semibold text-white mb-4 text-center">
              How it works
            </h3>
            <p className="text-sm sm:text-base text-slate-400 text-center max-w-2xl mx-auto mb-10">
              A simple visual flow that feels familiar if you use design tools
              like Figma, Sketch, or Illustrator.
            </p>

            {/* Grid for Steps 1, 2, & 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Step 1 Card */}
              <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-pink-500/20 border border-pink-400/70 flex items-center justify-center font-semibold text-sm text-pink-200">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">
                      Upload your base head art
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Start with a single head illustration from your existing
                      design system. This will be the canvas where all other
                      pieces (eyes, hair, accessories) will snap into place.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 Card */}
              <div className="bg-slate-900/70 border border-white/5 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-pink-500/20 border border-pink-400/70 flex items-center justify-center font-semibold text-sm text-pink-200">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">
                      Add categories & variations
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Drag in assets for eyes, mouths, hair, accessories, and
                      more. Group them into clear categories so your team can
                      mix and match options later with a single click.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 - Full Width Card with GIF */}
            <div className="bg-slate-900/80 border border-white/5 rounded-2xl overflow-hidden pb-0 mb-6">
              <div className="p-6 pb-4">
                <div className="flex items-start gap-4 mb-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-pink-500/20 border border-pink-400/70 flex items-center justify-center font-semibold text-sm text-pink-200">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">
                      Preview & adjust visually
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Move, resize, and reorder elements directly on the canvas.
                      See how combinations look in real time so you can catch
                      spacing or layering issues before they ship.
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6">
                <img
                  src="/preview-step.gif"
                  alt="Avatune Studio preview and adjustment interface"
                  className="w-full h-auto rounded-t-3xl"
                />
              </div>
            </div>

            {/* Step 4 Card - Full Width */}
            <div className="bg-slate-900/80 border border-emerald-400/30 rounded-2xl p-6 mt-2">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-emerald-500/15 border border-emerald-400/70 flex items-center justify-center font-semibold text-sm text-emerald-200">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">
                    Export & share with your team and the community
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Download a ready‑to‑use theme package for your React, Vue,
                    Svelte, or Vanilla app. Want to give back to the design and
                    open source community? <br />
                    Share your work by opening a pull request to the{' '}
                    <a
                      href="https://github.com/avatune/avatune"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 underline transition-colors"
                    >
                      Avatune GitHub repository
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Available Themes Section */}
        <section className="px-6 py-16 sm:px-10 lg:px-16 bg-slate-950">
          <div className="max-w-6xl mx-auto border border-white/5 rounded-3xl bg-linear-to-tr from-slate-900 via-slate-900/80 to-slate-900/40 px-6 sm:px-10 py-10 shadow-[0_26px_80px_rgba(15,23,42,0.95)]">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-semibold text-white mb-3">
                Explore existing themes
              </h3>
              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
                See how other designers and teams are using Avatune to build
                avatar systems. Use them as inspiration or as a starting point
                for your own style.
                <br />
                Browse themes on{' '}
                <a
                  href="https://www.avatune.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-300 hover:text-pink-200 underline underline-offset-4 decoration-pink-400/70"
                >
                  avatune.dev
                </a>{' '}
                to see what&apos;s possible.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {themes.map((theme) => (
                <a
                  key={theme.name}
                  href={theme.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/70 border border-white/10 hover:border-pink-400/70 hover:bg-slate-800/80 transition-all text-slate-200 hover:text-white shadow-[0_14px_45px_rgba(15,23,42,0.9)]"
                >
                  <span className="font-medium">{theme.name}</span>
                  <IconExternalLink
                    size={14}
                    className="text-slate-400 group-hover:text-pink-200 transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default WelcomePage
