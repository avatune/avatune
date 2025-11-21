import micahTheme from '@avatune/micah-theme/vanilla'
import miniavsTheme from '@avatune/miniavs-theme/vanilla'
import nevmstasTheme from '@avatune/nevmstas-theme/vanilla'
import type {
  AvatarConfig,
  VanillaAvatarItem,
  VanillaTheme,
} from '@avatune/types'
import { avatar } from '@avatune/vanilla'
import yanliuTheme from '@avatune/yanliu-theme/vanilla'

const THEMES = {
  yanliu: yanliuTheme,
  nevmstas: nevmstasTheme,
  miniavs: miniavsTheme,
  micah: micahTheme,
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

interface Env {
  RATE_LIMIT: KVNamespace
}

const RATE_LIMITS = {
  PER_HOUR: 100,
  PER_DAY: 1000,
} as const

async function checkRateLimit(
  kv: KVNamespace,
  clientId: string,
): Promise<{ allowed: boolean; reason?: string }> {
  const now = Date.now()
  const hourKey = `hour:${clientId}:${Math.floor(now / (60 * 60 * 1000))}`
  const dayKey = `day:${clientId}:${Math.floor(now / (24 * 60 * 60 * 1000))}`

  const [hourCount, dayCount] = await Promise.all([
    kv.get(hourKey),
    kv.get(dayKey),
  ])

  const hourRequests = Number.parseInt(hourCount || '0', 10)
  const dayRequests = Number.parseInt(dayCount || '0', 10)

  if (hourRequests >= RATE_LIMITS.PER_HOUR) {
    return {
      allowed: false,
      reason: `Hourly limit exceeded (${RATE_LIMITS.PER_HOUR} requests/hour)`,
    }
  }

  if (dayRequests >= RATE_LIMITS.PER_DAY) {
    return {
      allowed: false,
      reason: `Daily limit exceeded (${RATE_LIMITS.PER_DAY} requests/day)`,
    }
  }

  await Promise.all([
    kv.put(hourKey, String(hourRequests + 1), { expirationTtl: 3600 }),
    kv.put(dayKey, String(dayRequests + 1), { expirationTtl: 86400 }),
  ])

  return { allowed: true }
}

function getClientId(request: Request): string {
  const ip = request.headers.get('CF-Connecting-IP')
  const userAgent = request.headers.get('User-Agent') || ''
  return `${ip}:${userAgent.slice(0, 50)}`
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const clientId = getClientId(request)
    const rateLimitResult = await checkRateLimit(env.RATE_LIMIT, clientId)

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: rateLimitResult.reason,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Retry-After': '3600',
          },
        },
      )
    }

    const url = new URL(request.url)

    if (url.pathname === '/') {
      const themeName = (url.searchParams.get('theme') || 'yanliu') as ThemeName
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
