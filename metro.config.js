const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push("cjs");

// Tắt experimental package export nếu cần
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
