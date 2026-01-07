import { CardSection } from '../ui'

interface GitHubContributionGuideProps {
  themeName: string
}

export const GitHubContributionGuide = ({
  themeName,
}: GitHubContributionGuideProps) => {
  return (
    <CardSection className="mb-6">
      <h4 className="text-lg font-semibold text-white mb-4">
        How to Contribute Your Theme
      </h4>

      {/* GitHub Account Requirement */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-400/30 rounded-lg">
        <p className="text-sm text-blue-200">
          <span className="font-semibold text-blue-100">Note:</span> You need to{' '}
          <a
            href="https://github.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline"
          >
            sign up
          </a>{' '}
          or{' '}
          <a
            href="https://github.com/login"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 underline"
          >
            sign in
          </a>{' '}
          to GitHub to contribute your theme.
        </p>
      </div>

      {/* Option 1: Create Issue */}
      <div className="mb-4">
        <h5 className="text-md font-medium text-pink-400 mb-2">
          Option 1: Create a GitHub Issue (Easiest)
        </h5>
        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300 ml-2">
          <li>
            Sign in to GitHub (or{' '}
            <a
              href="https://github.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 underline"
            >
              sign up
            </a>{' '}
            if you don't have an account)
          </li>
          <li>
            Go to{' '}
            <a
              href="https://github.com/avatune/avatune/issues/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 underline"
            >
              Create New Issue
            </a>
          </li>
          <li>
            Title:{' '}
            <code className="bg-black/30 px-1 rounded text-xs">
              [Theme Submission] {themeName}
            </code>
          </li>
          <li>Drag & drop the ZIP file into the issue description</li>
          <li>Add a preview image of your theme (optional)</li>
          <li>Submit the issue</li>
        </ol>
      </div>

      {/* Option 2: Create PR */}
      <div className="mb-4">
        <h5 className="text-md font-medium text-pink-400 mb-2">
          Option 2: Create a Pull Request
        </h5>
        <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300 ml-2">
          <li>
            Sign in to GitHub (or{' '}
            <a
              href="https://github.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 underline"
            >
              sign up
            </a>{' '}
            if you don't have an account)
          </li>
          <li>
            <a
              href="https://github.com/avatune/avatune/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 underline"
            >
              Fork the repository
            </a>
          </li>
          <li>
            Clone your fork:{' '}
            <code className="bg-black/30 px-1 rounded text-xs">
              git clone https://github.com/YOUR_USERNAME/avatune.git
            </code>
          </li>
          <li>
            Create a branch:{' '}
            <code className="bg-black/30 px-1 rounded text-xs">
              git checkout -b theme/{themeName}
            </code>
          </li>
          <li>Extract ZIP and copy folders:</li>
        </ol>
        <div className="ml-6 mt-2 space-y-1">
          <p className="text-slate-300 text-sm">
            <code className="bg-black/30 px-2 py-1 rounded font-mono text-xs">
              {themeName}-assets/
            </code>{' '}
            →{' '}
            <code className="bg-black/30 px-2 py-1 rounded font-mono text-xs">
              packages/assets/{themeName}-assets/
            </code>
          </p>
          <p className="text-slate-300 text-sm">
            <code className="bg-black/30 px-2 py-1 rounded font-mono text-xs">
              {themeName}-theme/
            </code>{' '}
            →{' '}
            <code className="bg-black/30 px-2 py-1 rounded font-mono text-xs">
              packages/themes/{themeName}-theme/
            </code>
          </p>
        </div>
        <ol
          className="list-decimal list-inside space-y-1 text-sm text-slate-300 ml-2 mt-2"
          start={6}
        >
          <li>
            Commit:{' '}
            <code className="bg-black/30 px-1 rounded text-xs">
              git add . && git commit -m "feat: add {themeName} theme"
            </code>
          </li>
          <li>
            Push:{' '}
            <code className="bg-black/30 px-1 rounded text-xs">
              git push origin theme/{themeName}
            </code>
          </li>
          <li>
            <a
              href="https://github.com/avatune/avatune/compare"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 underline"
            >
              Create Pull Request
            </a>
          </li>
        </ol>
      </div>
    </CardSection>
  )
}
