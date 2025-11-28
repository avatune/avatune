import type { Config as SvgoConfig } from 'svgo'

const uid = () => Math.random().toString(36).slice(2, 9)

export const colordImport = "import { colord } from 'colord';"

export const svgoConfig: SvgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupIds: false,
        },
      },
    },
    {
      name: 'prefixIds',
      params: { prefix: false, prefixIds: false, prefixClassNames: false },
    },
  ],
}

const idReplacements = [
  'clip0_53_114',
  'mask0_48_80',
  'mask0_48_87',
  'mask0_53_114',
  'path-4-inside-1_53_114',
]

export const getReplaceAttrValues = (
  colorPropName = 'color',
  uidPropName = 'uid',
) => {
  const replacements: Record<string, string> = {
    '#F4D150': `{${colorPropName}}`,
    '#9287FF': `{${colorPropName}}`,
    '#E0DDFF': `{colord(${colorPropName}).desaturate(0.08).lighten(0.06).toHex()}`,
    '#AC6651': `{${colorPropName}}`,
    '#6BD9E9': `{${colorPropName}}`,
  }

  for (const id of idReplacements) {
    const uniqueId = uid()
    const replacement = `{${uidPropName} + '-' + '${uniqueId}'}`
    replacements[id] = replacement
    replacements[`url(#${id})`] =
      `{'url(#' + ${uidPropName} + '-' + '${uniqueId}' + ')'}`
  }

  return replacements
}
