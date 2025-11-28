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

export const getReplaceAttrValues = (
  colorPropName = 'color',
  uidPropName = 'uid',
) => ({
  '#F5C09B': `{${colorPropName}}`,
  '#E7B431': `{${colorPropName}}`,
  '#DAB797': `{${colorPropName}}`,
  '#3A486B': `{${colorPropName}}`,
  '#273D32': `{${colorPropName}}`,
  '#34483E': `{colord(${colorPropName}).desaturate(0.06).lighten(0.04).toHex()}`,
  '#B77131': `{colord(${colorPropName}).rotate(190).desaturate(0.29).darken(0.14).toHex()}`,
  '#AEA08B': `{${colorPropName}}`,
  '#827165': `{colord(${colorPropName}).rotate(-16).desaturate(0.06).darken(0.16).toHex()}`,
  '#1C2845': `{${colorPropName}}`,
  '#31333A': `{${colorPropName}}`,
  '#715B53': `{colord(${colorPropName}).rotate(-14).desaturate(0.37).darken(0.34).toHex()}`,
  '#483832': `{colord(${colorPropName}).rotate(-14).desaturate(0.34).darken(0.49).toHex()}`,
  clip0_11_8796: `{${uidPropName} + '-' + '${uid()}'}`,
  clip0_8_7470: `{${uidPropName} + '-' + '${uid()}'}`,
  clip0_8_7473: `{${uidPropName} + '-' + '${uid()}'}`,
  clip0_9_7761: `{${uidPropName} + '-' + '${uid()}'}`,
  clip0_9_7783: `{${uidPropName} + '-' + '${uid()}'}`,
  clip0_9_7796: `{${uidPropName} + '-' + '${uid()}'}`,
  clip0_9_7826: `{${uidPropName} + '-' + '${uid()}'}`,
  clip0_9_7841: `{${uidPropName} + '-' + '${uid()}'}`,
})
