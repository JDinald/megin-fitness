module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // Uncomment below when react-native-reanimated is added
    // plugins: ['react-native-reanimated/plugin'],
  };
};
