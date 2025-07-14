const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  target: 'electron-renderer',
  entry: './src/renderer/app/entry/index.tsx',
  output: {
    filename: 'renderer.bundle.js',
    path: path.resolve(__dirname, 'build'), // Output to build/
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './static/pages/app.html',
      filename: 'app.html',
    }),
  ],
  devServer: {
    port: 8080,
    hot: true,
    static: './static/pages',
  },
};
