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
  'filter0_d_144_233',
  'filter0_d_144_264',
  'mask0_134_151',
  'mask0_89_489',
  'mask0_91_509',
  'mask0_91_558',
  'mask1_134_151',
  'mask1_91_558',
]

export const getReplaceAttrValues = (
  colorPropName = 'color',
  uidPropName = 'uid',
) => {
  const replacements: Record<string, string> = {
    currentColor: `{${colorPropName}}`,
    '#FCBE93': `{${colorPropName}}`,
    '#FF7A93': `{${colorPropName}}`,
    '#FFA882': `{colord(${colorPropName}).darken(0.05).toHex()}`,
    '#272424': `{colord(${colorPropName}).darken(0.2).toHex()}`,
    '#A4C856': `{${colorPropName}}`,
    '#8DA853': `{colord(${colorPropName}).darken(0.05).toHex()}`,
    '#4F8558': `{colord(${colorPropName}).darken(0.1).toHex()}`,
    '#F06E82': `{${colorPropName}}`,
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
