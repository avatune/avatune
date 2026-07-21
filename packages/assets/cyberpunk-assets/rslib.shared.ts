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
  '#318a1cf8': `{colord(${colorPropName}).rotate(-34).saturate(0.13).lighten(0.37).toHex()}`,
  '#6a4e69c9': `{colord(${colorPropName}).rotate(90).desaturate(0.13).lighten(0.34).toHex()}`,
  '#7a6aedfc': `{colord(${colorPropName}).rotate(43).saturate(0.14).lighten(0.44).toHex()}`,
  filter0_d_144_233: `{${uidPropName} + '-' + '${uid()}'}`,
  filter0_d_144_264: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_134_151: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_89_489: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_91_509: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_91_558: `{${uidPropName} + '-' + '${uid()}'}`,
  mask1_134_151: `{${uidPropName} + '-' + '${uid()}'}`,
  mask1_91_558: `{${uidPropName} + '-' + '${uid()}'}`,
})
