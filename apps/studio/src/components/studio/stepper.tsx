import { useNavigate } from 'react-router-dom'

type Step = 'head' | 'categories' | 'preview' | 'save'

interface StepperProps {
  currentStep: Step
  onStepClick: (step: Step) => void
  canNavigateToStep: (step: Step) => boolean
}

export const Stepper = ({
  currentStep,
  onStepClick,
  canNavigateToStep,
}: StepperProps) => {
  const navigate = useNavigate()

  return (
    <header className="border-b border-white/10 px-6 py-8 sm:px-12 lg:px-16">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="text-center text-4xl font-bold mb-8 text-white hover:opacity-80 transition-opacity cursor-pointer block mx-auto"
        aria-label="Go to home page"
      >
        <span className="text-pink-400">Avatune</span> Studio{' '}
        <span className="text-slate-400 text-2xl">Beta</span>
      </button>
      <div className="flex justify-center gap-8 flex-wrap">
        <button
          type="button"
          onClick={() => onStepClick('head')}
          className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canNavigateToStep('head')}
          aria-label="Navigate to Head step"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${
              currentStep === 'head'
                ? 'bg-pink-500 border-pink-400 text-white'
                : currentStep === 'categories' ||
                    currentStep === 'preview' ||
                    currentStep === 'save'
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            1
          </div>
          <span className="text-xs uppercase tracking-wider text-slate-400">
            Head
          </span>
        </button>
        <button
          type="button"
          onClick={() => onStepClick('categories')}
          className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canNavigateToStep('categories')}
          aria-label="Navigate to Categories step"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${
              currentStep === 'categories'
                ? 'bg-pink-500 border-pink-400 text-white'
                : currentStep === 'preview' || currentStep === 'save'
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            2
          </div>
          <span className="text-xs uppercase tracking-wider text-slate-400">
            Categories
          </span>
        </button>
        <button
          type="button"
          onClick={() => onStepClick('preview')}
          className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canNavigateToStep('preview')}
          aria-label="Navigate to Preview step"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${
              currentStep === 'preview'
                ? 'bg-pink-500 border-pink-400 text-white'
                : currentStep === 'save'
                  ? 'bg-green-500 border-green-400 text-white'
                  : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            3
          </div>
          <span className="text-xs uppercase tracking-wider text-slate-400">
            Preview
          </span>
        </button>
        <button
          type="button"
          onClick={() => onStepClick('save')}
          className="flex flex-col items-center gap-2 cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!canNavigateToStep('save')}
          aria-label="Navigate to Save step"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold border-2 transition-colors ${
              currentStep === 'save'
                ? 'bg-pink-500 border-pink-400 text-white'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
          >
            4
          </div>
          <span className="text-xs uppercase tracking-wider text-slate-400">
            Save
          </span>
        </button>
      </div>
    </header>
  )
}
