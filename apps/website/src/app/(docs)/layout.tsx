import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { Instrument_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { docsTree } from '@/lib/docs-tree'
import { baseOptions } from '@/lib/layout.shared'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-docs',
})

export default function DocumentationLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={docsTree}
      containerProps={{
        className: `${instrumentSans.variable} docs-font`,
      }}
    >
      {children}
    </DocsLayout>
  )
}
