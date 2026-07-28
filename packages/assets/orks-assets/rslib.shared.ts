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
  '#b4896d23': `{colord(${colorPropName}).darken(0.1).toHex()}`,
  '#2517b090': `{colord(${colorPropName}).darken(0.2).toHex()}`,
  '#7eac48f2': `{colord(${colorPropName}).darken(0.15).toHex()}`,
  '#0a0f364b': `{colord(${colorPropName}).lighten(0.1).toHex()}`,
  filter0_d_144_233: `{${uidPropName} + '-' + '${uid()}'}`,
  filter0_d_144_264: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_134_151: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_89_489: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_91_509: `{${uidPropName} + '-' + '${uid()}'}`,
  mask0_91_558: `{${uidPropName} + '-' + '${uid()}'}`,
  mask1_134_151: `{${uidPropName} + '-' + '${uid()}'}`,
  mask1_91_558: `{${uidPropName} + '-' + '${uid()}'}`,
})
