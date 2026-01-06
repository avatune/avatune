import { Button, Card, CardSection } from './ui'

interface WelcomePageProps {
  onGetStarted: () => void
}

const WelcomePage = ({ onGetStarted }: WelcomePageProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      <header className="border-b border-white/10 px-6 py-8 sm:px-12 lg:px-16">
        <h1 className="text-center text-4xl font-bold text-white">
          <span className="text-pink-400">Avatune</span> Studio{' '}
          <span className="text-slate-400 text-2xl">Beta</span>
        </h1>
      </header>

      <main className="flex-1 px-6 py-8 sm:px-12 lg:px-16 max-w-4xl w-full mx-auto">
        <div className="space-y-6">
          {/* Main Welcome Card */}
          <Card>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">
                Create Your Custom Avatar Theme
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg">
                Whether you're a designer looking to contribute to open source
                or a company wanting to create a unique branding mascot, Avatune
                Studio makes it easy to build custom avatar themes with your own
                assets.
              </p>
            </div>
          </Card>

          {/* How It Works Card */}
          <Card>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white">
                How It Works
              </h3>

              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Upload Your Head Asset
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Start by uploading a head asset. This serves as the
                      foundation for your entire theme - all other assets will
                      be positioned and layered relative to this base.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Add Category Assets
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Upload assets for different categories like eyes, mouths,
                      hair, accessories, and more. Each category can have
                      multiple variations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Preview & Adjust
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Fine-tune positioning and layering to ensure all assets
                      align perfectly and create cohesive avatar combinations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      Export Your Theme
                    </h4>
                    <p className="text-slate-300 leading-relaxed">
                      Download your complete theme package, ready to integrate
                      into your application or contribute to the Avatune
                      project.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <CardSection className="mt-8">
                <div className="flex items-start gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-amber-400 mt-0.5 shrink-0"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <div>
                    <p className="text-amber-300 font-medium mb-2">
                      Important: Asset Consistency
                    </p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      All assets must maintain consistent proportions and
                      dimensions. This ensures proper alignment and layering
                      across different asset combinations. We recommend using
                      the same canvas size for all your assets.
                    </p>
                  </div>
                </div>
              </CardSection>
            </div>
          </Card>

          {/* Get Started Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={onGetStarted} className="px-12 py-4 text-lg">
              Get Started
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default WelcomePage
