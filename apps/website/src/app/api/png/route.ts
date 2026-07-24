import sharp from 'sharp'
import {
  getTheme,
  imageHeaders,
  renderAvatarSvg,
  themeNames,
} from '@/lib/avatar-api'

export const runtime = 'nodejs'

export async function GET(request: Request): Promise<Response> {
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
  const svg = renderAvatarSvg(theme, searchParams)
  const png = await sharp(Buffer.from(svg)).png().toBuffer()
  const body: Uint8Array<ArrayBuffer> =
    png.buffer instanceof ArrayBuffer
      ? new Uint8Array(png.buffer, png.byteOffset, png.byteLength)
      : Uint8Array.from(png)

  return new Response(body, {
    headers: {
      ...imageHeaders,
      'Content-Type': 'image/png',
    },
  })
}
