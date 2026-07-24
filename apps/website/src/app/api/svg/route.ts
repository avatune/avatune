import {
  getTheme,
  imageHeaders,
  renderAvatarSvg,
  themeNames,
} from '@/lib/avatar-api'

export function GET(request: Request): Response {
  const searchParams = new URL(request.url).searchParams
  const themeName = searchParams.get('theme') || 'yanliu'
  const theme = getTheme(themeName)

  if (!theme) {
    return Response.json(
      {
        error: 'Invalid theme',
        availableThemes: themeNames,
      },
      {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }

  return new Response(renderAvatarSvg(theme, searchParams), {
    headers: {
      ...imageHeaders,
      'Content-Type': 'image/svg+xml',
    },
  })
}
