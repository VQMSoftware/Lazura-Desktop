const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  target: 'electron-main',
  entry: './src/app/window/app.ts',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader',
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};
