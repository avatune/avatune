import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'
import { GitFork } from 'lucide-react'
import Image from 'next/image'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span className="inline-flex items-center gap-2 font-semibold">
          <Image src="/favicon.png" alt="" width={24} height={24} />
          Avatune
        </span>
      ),
      url: '/',
    },
    links: [
      {
        text: 'GitHub',
        url: 'https://github.com/avatune/avatune',
        icon: <GitFork />,
        secondary: true,
      },
    ],
  }
}
