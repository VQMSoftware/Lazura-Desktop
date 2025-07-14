const path = require('path');

module.exports = {
  mode: 'production',
  target: 'electron-preload',
  entry: path.resolve(__dirname, 'src/preloads/window-preload.ts'),
  output: {
    filename: 'window-preload.bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
