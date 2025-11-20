const { resolve } = require('node:path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { withStorybook } = require('@storybook/react-native/metro/withStorybook')

const { makeMetroConfig } = require('@rnx-kit/metro-config')

const defaultConfig = getDefaultConfig(__dirname)

const projectRoot = __dirname
const workspaceRoot = resolve(projectRoot, '../../')

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    nodeModulesPaths: [
      resolve(projectRoot, 'node_modules'),
      resolve(workspaceRoot, 'node_modules'),
    ],
    // Avoid accidentally loading a second copy of react-native
    // or resolving from inside the workspace package
    extraNodeModules: {
      'react-native': resolve(workspaceRoot, 'node_modules/react-native'),
      react: resolve(workspaceRoot, 'node_modules/react'),
      'react-native-svg': resolve(
        workspaceRoot,
        'node_modules/react-native-svg',
      ),
      'react/jsx-runtime': resolve(
        workspaceRoot,
        'node_modules/react/jsx-runtime',
      ),
    },
    // Use source extensions for workspace packages
    sourceExts: [...(defaultConfig.resolver?.sourceExts || []), 'cjs'],
  },
  watchFolders: [workspaceRoot],
}

const finalConfig = mergeConfig(defaultConfig, config)

module.exports = withStorybook(makeMetroConfig(finalConfig), { enabled: true })
