const { resolve } = require('node:path')
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { withStorybook } = require('@storybook/react-native/metro/withStorybook')

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
      resolve(projectRoot, './node_modules'),
      resolve(workspaceRoot, 'node_modules'),
    ],
  },
  watchFolders: [workspaceRoot],
}

const finalConfig = mergeConfig(defaultConfig, config)

module.exports = withStorybook(finalConfig, { enabled: true })
