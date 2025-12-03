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

const idReplacements = ['mask0_29_1163', 'path-3-inside-1_16_410']

export const getReplaceAttrValues = (
  colorPropName = 'color',
  uidPropName = 'uid',
) => {
  const replacements: Record<string, string> = {
    // Main colors
    '#FFE4C0': `{${colorPropName}}`, // main skin
    '#351700': `{${colorPropName}}`, // main hair (most common)
    '#71472D': `{${colorPropName}}`, // eyebrow/eye detail
    '#2A1200': `{${colorPropName}}`, // main eye color
    '#873C41': `{${colorPropName}}`, // main mouth/lip
    '#AA5A10': `{${colorPropName}}`, // secondary hair
    '#D56C0C': `{${colorPropName}}`, // secondary hair
    '#238D81': `{${colorPropName}}`, // teal hair
    '#272630': `{${colorPropName}}`, // dark gray/blue hair (hijab)
    '#5754D2': `{${colorPropName}}`, // purple hair
    '#000': `{${colorPropName}}`,

    // Skin variations (from #FFE4C0)
    '#FFE7E2': `{colord(${colorPropName}).lighten(0.08).saturate(0.02).toHex()}`, // lighter skin (blush)
    '#CBA284': `{colord(${colorPropName}).darken(0.18).desaturate(0.12).toHex()}`, // darker skin (shadow)
    '#E2BA87': `{colord(${colorPropName}).darken(0.08).desaturate(0.05).toHex()}`, // medium skin
    '#D9AC74': `{colord(${colorPropName}).darken(0.12).desaturate(0.08).toHex()}`, // darker skin
    '#D0BA9E': `{colord(${colorPropName}).lighten(0.02).desaturate(0.15).toHex()}`, // lighter skin

    // Hair variations (from #351700)
    '#451E00': `{colord(${colorPropName}).lighten(0.05).toHex()}`, // lighter hair
    '#240F00': `{colord(${colorPropName}).darken(0.08).toHex()}`, // darker hair
    '#220F01': `{colord(${colorPropName}).darken(0.09).toHex()}`, // darker hair
    '#220F00': `{colord(${colorPropName}).darken(0.09).toHex()}`, // darker hair
    '#2A1000': `{colord(${colorPropName}).lighten(0.03).toHex()}`, // slightly lighter hair
    '#2B1200': `{colord(${colorPropName}).lighten(0.02).toHex()}`, // slightly lighter hair
    '#3A1A00': `{colord(${colorPropName}).lighten(0.08).toHex()}`, // lighter hair
    '#5E351B': `{colord(${colorPropName}).lighten(0.25).desaturate(0.1).toHex()}`, // much lighter hair
    '#1B0C01': `{colord(${colorPropName}).darken(0.12).toHex()}`, // darker hair

    // Teal hair variations (from #238D81)
    '#21625A': `{colord(${colorPropName}).darken(0.15).desaturate(0.1).toHex()}`, // darker teal hair

    // Purple hair variations (from #5754D2)
    '#605DE4': `{colord(${colorPropName}).lighten(0.08).saturate(0.05).toHex()}`, // lighter purple
    '#7D7AFF': `{colord(${colorPropName}).lighten(0.15).saturate(0.1).toHex()}`, // lighter purple
    '#CDCCFF': `{colord(${colorPropName}).lighten(0.3).desaturate(0.2).toHex()}`, // very light purple

    // Mouth variations (from #873C41)
    '#EE7E8B': `{colord(${colorPropName}).lighten(0.25).saturate(0.1).toHex()}`, // lighter mouth (tongue)
    '#592125': `{colord(${colorPropName}).darken(0.35).desaturate(0.15).toHex()}`, // darker mouth

    // Eye/eyebrow variations (from #71472D or #2A1200)
    '#613D25': `{colord(${colorPropName}).darken(0.22).desaturate(0.1).toHex()}`, // darker eye detail
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
