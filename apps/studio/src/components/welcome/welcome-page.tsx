import { ExternalLink } from 'lucide-react'
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
                  looking to create unique avatar experiences.
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
                    Export Theme
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Download your complete theme package ready for React, Vue,
                    Svelte, or Vanilla JS.
                  </p>
                </div>
              </div>

              {/* Step 5 - Image Left, Text Right */}
              <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4">
                <div className="w-full lg:w-1/2 relative">
                  <div className="absolute -top-1 -left-1 z-10 w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center font-bold text-sm shadow-lg text-white">
                    5
                  </div>
                  <div
                    className="w-full bg-slate-800 rounded-lg overflow-hidden shadow-xl flex items-center justify-center"
                    style={{ aspectRatio: '4/3', minHeight: '125px' }}
                  >
                    <div className="text-center p-2">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-slate-700/50 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-labelledby="upload-icon-title"
                        >
                          <title id="upload-icon-title">Upload to GitHub</title>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-slate-400">Upload to GitHub</p>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-2">
                  <h4 className="text-lg lg:text-xl font-bold text-white">
                    Upload to Us
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Share your generated theme with the community by uploading
                    it to us via GitHub.
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
