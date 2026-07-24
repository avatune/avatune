'use client'

const installCommand = 'npm i @avatune/react'

export function InstallCopy() {
  async function copyInstallCommand() {
    try {
      await navigator.clipboard.writeText(installCommand)
      window.dispatchEvent(
        new CustomEvent('avatune:toast', {
          detail: `Copied ${installCommand}`,
        }),
      )
    } catch {
      return
    }
  }

  return (
    <button
      type="button"
      onClick={copyInstallCommand}
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line-2 bg-paper-3 px-4 py-2.5 text-sm font-medium whitespace-nowrap text-ink transition hover:border-line-strong hover:bg-paper-card active:translate-y-px"
    >
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
        <path d="m4 17 6-6-6-6" />
        <path d="M12 19h8" />
      </svg>
      <code className="font-code text-[12px]">{installCommand}</code>
      <svg
        aria-hidden="true"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15V5a2 2 0 0 1 2-2h10" />
      </svg>
    </button>
  )
}
