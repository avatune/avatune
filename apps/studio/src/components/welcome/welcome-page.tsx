import { BookOpen, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui'

const themes = [
  { name: 'Yanliu', url: 'https://www.avatune.dev/packages/yanliu-theme/' },
  {
    name: 'Fatin Verse',
    url: 'https://www.avatune.dev/packages/fatin-verse-theme/',
  },
  { name: 'Miniavs', url: 'https://www.avatune.dev/packages/miniavs-theme/' },
  { name: 'Nevmstas', url: 'https://www.avatune.dev/packages/nevmstas-theme/' },
  {
    name: 'Ashley Seo',
    url: 'https://www.avatune.dev/packages/ashley-seo-theme/',
  },
  { name: 'Micah', url: 'https://www.avatune.dev/packages/micah-theme/' },
  { name: 'Kyute', url: 'https://www.avatune.dev/packages/kyute-theme/' },
  { name: 'Pacovqzz', url: 'https://www.avatune.dev/packages/pacovqzz-theme/' },
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
      <header className="border-b border-white/10 px-6 py-6 sm:px-12 lg:px-16">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            <span className="text-pink-400">Avatune</span> Studio{' '}
            <span className="text-slate-400 text-lg sm:text-xl">Beta</span>
          </h1>
          <nav className="flex items-center gap-4 sm:gap-6">
            <a
              href="https://www.avatune.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
              title="Visit Avatune.dev"
            >
              <img src="/favicon.png" alt="Avatune" className="w-5 h-5" />
              <span className="hidden sm:inline">Avatune</span>
            </a>
            <a
              href="https://www.avatune.dev/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
              title="Documentation"
            >
              <BookOpen size={20} />
              <span className="hidden sm:inline">Docs</span>
            </a>
            <a
              href="https://github.com/avatune/avatune"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
              title="GitHub Repository"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-16 sm:px-12 lg:px-16 sm:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Side - Text Content */}
              <div className="text-center lg:text-left">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Create Your Custom{' '}
                  <span className="text-pink-400">Avatar Theme</span>
                </h2>
                <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed mb-6">
                  Create custom avatar themes for the{' '}
                  <span className="text-white font-semibold">
                    Avatune library
                  </span>{' '}
                  with your own design assets. Build beautiful, composable
                  themes that work seamlessly across React, Vue, Svelte, and
                  Vanilla JS.
                </p>
                <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-8">
                  Perfect for{' '}
                  <span className="text-slate-300 font-semibold">
                    designers
                  </span>
                  ,{' '}
                  <span className="text-slate-300 font-semibold">
                    developers
                  </span>
                  , and{' '}
                  <span className="text-slate-300 font-semibold">brands</span>{' '}
                  looking to create unique avatar experience and contribute to
                  the open source community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    onClick={handleGetStarted}
                    className="px-8 py-4 text-lg font-semibold"
                  >
                    Start Creating
                  </Button>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-2xl">
                  <img
                    src="/preview-step.gif"
                    alt="Avatune Studio interface preview"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 py-16 sm:px-12 lg:px-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
              How It Works
            </h3>
            <div className="space-y-5 lg:space-y-6">
              {/* Step 1 - Image Left, Text Right */}
              <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4">
                <div className="w-full lg:w-1/2 relative">
                  <div className="absolute -top-1 -left-1 z-10 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center font-bold text-sm shadow-lg text-white">
                    1
                  </div>
                  <div
                    className="w-full bg-slate-800 rounded-lg overflow-hidden shadow-xl"
                    style={{ aspectRatio: '4/3', minHeight: '125px' }}
                  >
                    <img
                      src="/head-upload-step.png"
                      alt="Upload Head Asset step"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-2">
                  <h4 className="text-lg lg:text-xl font-bold text-white">
                    Upload Head Asset
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Start with your base head asset. This serves as the
                    foundation for positioning all other elements.
                  </p>
                </div>
              </div>

              {/* Step 2 - Image Right, Text Left */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-3 lg:gap-4">
                <div className="w-full lg:w-1/2 relative">
                  <div className="absolute -top-1 -right-1 z-10 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center font-bold text-sm shadow-lg text-white">
                    2
                  </div>
                  <div
                    className="w-full bg-slate-800 rounded-lg overflow-hidden shadow-xl"
                    style={{ aspectRatio: '4/3', minHeight: '125px' }}
                  >
                    <img
                      src="/category-upload-step.png"
                      alt="Add Categories step"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-2">
                  <h4 className="text-lg lg:text-xl font-bold text-white">
                    Add Categories
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Upload assets for eyes, mouths, hair, accessories, and more.
                    Each category supports multiple variations.
                  </p>
                </div>
              </div>

              {/* Step 3 - Image Left, Text Right */}
              <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4">
                <div className="w-full lg:w-1/2 relative">
                  <div className="absolute -top-1 -left-1 z-10 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center font-bold text-sm shadow-lg text-white">
                    3
                  </div>
                  <div
                    className="w-full bg-slate-800 rounded-lg overflow-hidden shadow-xl"
                    style={{ aspectRatio: '4/3', minHeight: '125px' }}
                  >
                    <img
                      src="/preview-step-img.png"
                      alt="Preview & Adjust step"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-2">
                  <h4 className="text-lg lg:text-xl font-bold text-white">
                    Preview & Adjust
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Fine-tune positioning, layering, and sizing to create
                    perfect avatar combinations.
                  </p>
                </div>
              </div>

              {/* Step 4 - Image Right, Text Left */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-3 lg:gap-4">
                <div className="w-full lg:w-1/2 relative">
                  <div className="absolute -top-1 -right-1 z-10 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center font-bold text-sm shadow-lg text-white">
                    4
                  </div>
                  <div
                    className="w-full bg-slate-800 rounded-lg overflow-hidden shadow-xl"
                    style={{ aspectRatio: '4/3', minHeight: '125px' }}
                  >
                    <img
                      src="/export-and-upload-step.png"
                      alt="Export Theme step"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-2">
                  <h4 className="text-lg lg:text-xl font-bold text-white">
                    Export & Share Your Theme
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Download your complete theme package ready for React, Vue,
                    Svelte, or Vanilla JS. Want to share it with the community?
                    Submit a pull request to the{' '}
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
        <section className="px-6 py-16 sm:px-12 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Explore Existing Themes
              </h3>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Check out existing themes on{' '}
                <a
                  href="https://www.avatune.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-slate-300 underline"
                >
                  avatune.dev
                </a>{' '}
                to see what's possible with Avatune
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {themes.map((theme) => (
                <a
                  key={theme.name}
                  href={theme.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-white/10 hover:border-white/30 hover:bg-slate-700/60 transition-all text-slate-300 hover:text-white"
                >
                  <span className="font-medium">{theme.name}</span>
                  <ExternalLink
                    size={14}
                    className="text-slate-400 group-hover:text-white transition-colors"
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
