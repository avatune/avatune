import type { Config as SvgoConfig } from 'svgo'

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

export const getReplaceAttrValues = (colorPropName = 'color') => ({
  // skin base
  '#F2C094': `{${colorPropName}}`,
  // skin shadow (derived)
  '#D9A06B': `{colord(${colorPropName}).desaturate(0.06).darken(0.08).toHex()}`,
  // skin deep shadow (derived)
  '#C08850': `{colord(${colorPropName}).desaturate(0.1).darken(0.16).toHex()}`,
  // hair base
  '#FF2EC4': `{${colorPropName}}`,
  // hair shadow (derived)
  '#C217A0': `{colord(${colorPropName}).darken(0.12).toHex()}`,
  // hair highlight (derived)
  '#FF7AD9': `{colord(${colorPropName}).lighten(0.1).toHex()}`,
  // clothing base
  '#3A4366': `{${colorPropName}}`,
  // clothing shadow (derived)
  '#2A3050': `{colord(${colorPropName}).darken(0.08).toHex()}`,
  // clothing highlight (derived)
  '#5A6694': `{colord(${colorPropName}).lighten(0.08).toHex()}`,
  // eyes base
  '#19E6D2': `{${colorPropName}}`,
  // mouth base
  '#B03E67': `{${colorPropName}}`,
  // face hair base
  '#8A2BE2': `{${colorPropName}}`,
  // face hair shadow (derived)
  '#5E1D9E': `{colord(${colorPropName}).darken(0.12).toHex()}`,
  // face details (scars, warpaint) base
  '#39FF14': `{${colorPropName}}`,
  // accessories (masks) base
  '#7DF9FF': `{${colorPropName}}`,
  // accessories shadow (derived)
  '#4BB8C4': `{colord(${colorPropName}).darken(0.12).toHex()}`,
  // hats base
  '#FF8C00': `{${colorPropName}}`,
  // hats shadow (derived)
  '#C26400': `{colord(${colorPropName}).darken(0.1).toHex()}`,
  // hats highlight (derived)
  '#FFB04D': `{colord(${colorPropName}).lighten(0.08).toHex()}`,
})
