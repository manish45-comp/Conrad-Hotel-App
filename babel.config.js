module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // Removed NativeWind
    env: {
      production: {
        plugins: ["react-native-paper/babel", "react-native-reanimated/plugin"],
      },
    },
  };
};
