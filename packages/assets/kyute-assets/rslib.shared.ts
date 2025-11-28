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
  'path-2-inside-1_13_1672',
  'clip0_13_1632',
  'path-1-inside-1_13_548',
  'path-1-inside-1_0_1',
  'path-1-inside-1_26_815',
  'path-1-inside-1_1_68',
  'path-1-outside-1_6_96',
  'path-3-outside-2_6_96',
  'path-1-inside-1_1_894',
  'path-1-outside-1_6_95',
  'path-1-inside-1_1_929',
  'path-1-outside-1_2_211',
  'path-1-outside-1_6_54',
  'path-7-outside-2_6_54',
  'path-9-outside-3_6_54',
  'path-1-outside-1_6_53',
  'path-2-outside-1_6_97',
  'path-1-outside-1_6_70',
  'path-1-inside-1_1_849',
  'path-2-outside-1_2_14',
  'path-1-inside-1_28_1',
]

export const getReplaceAttrValues = (
  colorPropName = 'color',
  uidPropName = 'uid',
) => {
  const replacements: Record<string, string> = {
    '#9A9A9A': `{${colorPropName}}`,
    '#334B71': `{${colorPropName}}`,
    '#537C1E': `{${colorPropName}}`,
    '#901A3E': `{${colorPropName}}`,
    '#C8D3E6': `{colord(${colorPropName}).lighten(0.53).desaturate(0.27).toHex()}`,
    '#4D8FAB': `{${colorPropName}}`,
    '#B78276': `{${colorPropName}}`,
    '#CF7621': `{${colorPropName}}`,
    '#9C6458': `{${colorPropName}}`,
    '#4B301C': `{${colorPropName}}`,
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
