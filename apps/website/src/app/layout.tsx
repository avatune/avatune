import type { Metadata } from 'next'
import { Geist, Geist_Mono, Newsreader } from 'next/font/google'
import type { ReactNode } from 'react'
import { Provider } from '@/components/provider'
import '@/styles/global.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
})
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const description =
  'Typed, SSR-first avatars for seven frameworks with a growing theme library and no runtime dependencies. Build avatars manually or draft one from a photo.'

export const metadata: Metadata = {
  title: {
    default: 'Avatune',
    template: '%s | Avatune',
  },
  description,
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${geist.variable} ${geistMono.variable} ${geist.className}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
