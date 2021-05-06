module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset'],
    plugins: [
      'module:react-native-dotenv',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '~': './src',
            '~package': './package.json',
            '~assets': './assets',
            test: './test',
            underscore: 'lodash',
          },
        },
      ],
    ],
  };
};
