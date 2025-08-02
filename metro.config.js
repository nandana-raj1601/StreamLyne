/**
 * Metro configuration for React Native
 * https://facebook.github.io/metro/docs/configuration
 */
const { getDefaultConfig } = require('expo/metro-config');

// Retrieve the default configuration
const config = getDefaultConfig(__dirname);

// Add support for GeoJSON files
config.resolver.assetExts.push('geojson');
config.resolver.assetExts.push('csv');


// Export the updated configuration
module.exports = config;
