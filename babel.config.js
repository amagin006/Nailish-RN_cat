module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
    root: ['./src'],
    plugins: [
      'module:react-native-dotenv',
      'module-resolver',
      {
        alias: {
          test: './test',
          underscore: 'lodash',
          '~': './src',
          '~package': './package.json',
        },
      },
    ],
  };
};
