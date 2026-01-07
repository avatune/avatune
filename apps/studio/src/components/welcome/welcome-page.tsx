import { ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from '../ui'

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
            >
              <span>Visit Avatune.dev</span>
              <ExternalLink size={16} />
            </a>
            <a
              href="https://www.avatune.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
            >
              <span>Documentation</span>
              <ExternalLink size={14} />
            </a>
            <a
              href="https://github.com/avatune/avatune"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors text-sm sm:text-base"
            >
              <span>GitHub</span>
              <ExternalLink size={14} />
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
                <p className="text-xl sm:text-2xl text-slate-300 leading-relaxed mb-8">
                  Build beautiful, composable avatar themes with your own design
                  assets. Perfect for{' '}
                  <span className="text-pink-400 font-semibold">designers</span>
                  ,{' '}
                  <span className="text-pink-400 font-semibold">
                    developers
                  </span>
                  , and{' '}
                  <span className="text-pink-400 font-semibold">brands</span>.
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
                    src="/studio.png"
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
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center font-bold text-xl">
                    1
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    Upload Head Asset
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Start with your base head asset. This serves as the
                    foundation for positioning all other elements.
                  </p>
                </div>
              </Card>

              <Card>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center font-bold text-xl">
                    2
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    Add Categories
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Upload assets for eyes, mouths, hair, accessories, and more.
                    Each category supports multiple variations.
                  </p>
                </div>
              </Card>

              <Card>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center font-bold text-xl">
                    3
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    Preview & Adjust
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Fine-tune positioning, layering, and sizing to create
                    perfect avatar combinations.
                  </p>
                </div>
              </Card>

              <Card>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center font-bold text-xl">
                    4
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    Export Theme
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Download your complete theme package ready for React, Vue,
                    Svelte, or Vanilla JS.
                  </p>
                </div>
              </Card>

              <Card>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center font-bold text-xl">
                    5
                  </div>
                  <h4 className="text-xl font-semibold text-white">
                    Upload to Us
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Share your generated theme with the community by uploading
                    it to us via GitHub.
                  </p>
                </div>
              </Card>
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
                  className="text-pink-400 hover:text-pink-300 underline"
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
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-white/10 hover:border-pink-400/50 hover:bg-slate-700/60 transition-all text-slate-300 hover:text-white"
                >
                  <span className="font-medium">{theme.name}</span>
                  <ExternalLink
                    size={14}
                    className="text-slate-400 group-hover:text-pink-400 transition-colors"
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
