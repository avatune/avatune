const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const withStorybook = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

const finalConfig = mergeConfig(defaultConfig, config);

module.exports = withStorybook(finalConfig, {
    enabled: process.env.STORYBOOK_ENABLED === 'true',
    onDisabledRemoveStorybook: true,
});
