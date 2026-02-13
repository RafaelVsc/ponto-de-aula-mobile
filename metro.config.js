const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Inclui extensões customizadas usadas como assets (Quill CSS/JS)
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'cssasset',
  'jsbundle',
];

module.exports = withNativeWind(config, { input: './global.css' });
