import flatDesignTheme from '@avatune/flat-design-theme/vanilla'
import kawaiiDesignTheme from '@avatune/kawaii-design-theme/vanilla'
import micahDesignTheme from '@avatune/micah-design-theme/vanilla'
import miniavsTheme from '@avatune/miniavs-theme/vanilla'
import type {
  AvatarConfig,
  VanillaAvatarItem,
  VanillaTheme,
} from '@avatune/types'
import { avatar } from '@avatune/vanilla'

const THEMES = {
  'kawaii-design': kawaiiDesignTheme,
  'flat-design': flatDesignTheme,
  miniavs: miniavsTheme,
  'micah-design': micahDesignTheme,
} as const

type ThemeName = keyof typeof THEMES

const EXCLUDED_THEME_KEYS = new Set([
  'style',
  'predictorMappings',
  'colorPalettes',
  'connectedColors',
])

function parseAvatarConfig(
  url: URL,
  theme: VanillaTheme,
): Partial<AvatarConfig<VanillaAvatarItem, VanillaTheme>> {
  const config: Record<string, string | number> = {}

  const seed = url.searchParams.get('seed')
  if (seed) config.seed = seed

  const partCategories = Object.keys(theme).filter(
    (key) => !EXCLUDED_THEME_KEYS.has(key),
  )

  for (const category of partCategories) {
    const value = url.searchParams.get(category)
    if (value) {
      config[category] = value
    }

    const colorKey = `${category}Color`
    const colorValue = url.searchParams.get(colorKey)
    if (colorValue) {
      config[colorKey] = colorValue
    }
  }

  const backgroundColor = url.searchParams.get('backgroundColor')
  if (backgroundColor) {
    config.backgroundColor = backgroundColor
  }

  return config
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/') {
      const themeName = (url.searchParams.get('theme') ||
        'kawaii-design') as ThemeName
      const theme = THEMES[themeName]

      if (!theme) {
        return new Response(
          JSON.stringify({
            error: 'Invalid theme',
            availableThemes: Object.keys(THEMES),
          }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          },
        )
      }

      const size =
        Number.parseInt(url.searchParams.get('size') || '0', 10) ||
        theme.style.size
      const config = parseAvatarConfig(url, theme)

      const svg = avatar({
        theme,
        size,
        ...config,
      } as Parameters<typeof avatar>[0])

      return new Response(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }

    return new Response('Not Found', { status: 404 })
  },
} satisfies ExportedHandler<Env>
