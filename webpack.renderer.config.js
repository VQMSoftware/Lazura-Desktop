const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: isDev ? 'development' : 'production',
  target: 'web',
  entry: './src/renderer/views/app/entry/index.tsx',
  output: {
    filename: 'renderer.bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: './', // NOTE: Must be relative for Electron production to load scripts
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@icons': path.resolve(__dirname, 'src/renderer/resources/icons'),
    },
    fallback: {
      global: require.resolve('global'), // <- actual module
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
            plugins: isDev ? ['react-refresh/babel'] : [],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        oneOf: [
          {
            resourceQuery: /react/,
            use: ['@svgr/webpack'],
          },
          {
            type: 'asset/resource',
            generator: {
              filename: 'icons/[name].[contenthash][ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './static/pages/app.html',
      filename: 'app.html',
    }),
    new webpack.ProvidePlugin({
      global: require.resolve('global'),
    }),
    ...(isDev
      ? [
          new webpack.HotModuleReplacementPlugin(),
          new ReactRefreshWebpackPlugin(),
        ]
      : []),
  ],
  devServer: isDev
    ? {
        static: {
          directory: path.join(__dirname, 'build'),
        },
        port: 8080,
        hot: true,
        allowedHosts: 'all',
        historyApiFallback: {
          index: '/app.html',
        },
        devMiddleware: {
          publicPath: '/',
        },
      }
    : undefined,
};
