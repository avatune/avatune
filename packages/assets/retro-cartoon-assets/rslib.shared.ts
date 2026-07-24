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
          convertColors: false,
        },
      },
    },
    {
      name: 'prefixIds',
      params: { prefix: false, prefixIds: false, prefixClassNames: false },
    },
  ],
}

export const getReplaceAttrValues = (
  colorPropName = 'color',
  uidPropName = 'uid',
) => ({
  currentColor: `{${colorPropName}}`,
  '#476eab9a': `{colord(${colorPropName}).rotate(180).saturate(0.16).lighten(0.2).toHex()}`,
  '#69724e62': `{colord(${colorPropName}).rotate(20).saturate(0.36).lighten(0.1).toHex()}`,
  '#7eac48f2': `{colord(${colorPropName}).darken(0.15).toHex()}`,
  '#4b9e5107': `{colord(${colorPropName}).darken(0.07).toHex()}`,
  '#7cb2bb65': `{colord(${colorPropName}).darken(0.05).toHex()}`,
  '#31256e81': `{colord(${colorPropName}).rotate(-158).saturate(0.26).lighten(0.24).toHex()}`,
  filter0_d_144_233: `{${uidPropName} + '-' + '${uid()}'}`,
  filter0_d_144_264: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_134_151: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_89_489: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_91_509: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_91_558: `{${uidPropName} + '-' + '${uid()}'}`,
  mask1_134_151: `{${uidPropName} + '-' + '${uid()}'}`,
  mask1_91_558: `{${uidPropName} + '-' + '${uid()}'}`,
})
