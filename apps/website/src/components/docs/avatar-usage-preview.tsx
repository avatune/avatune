'use client'

import dynamic from 'next/dynamic'
import { themeMapBySlug } from '@/lib/theme-registry.generated'

const Avatar = dynamic(
  () => import('@avatune/react').then((module) => module.Avatar),
  { ssr: false },
)

export interface AvatarUsagePreviewProps {
  seed: string
  size?: number
  themeId?: string
}

export function AvatarUsagePreview({
  seed,
  size = 200,
  themeId = 'nevmstas',
}: AvatarUsagePreviewProps) {
  const fallbackTheme = themeMapBySlug.nevmstas
  if (!fallbackTheme) throw new Error('Missing theme: nevmstas')
  const selectedTheme = themeMapBySlug[themeId] ?? fallbackTheme

  return (
    <div className="flex items-center justify-center py-6">
      <Avatar theme={selectedTheme} seed={seed} size={size} />
    </div>
  )
}
