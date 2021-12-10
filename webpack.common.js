const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup.jsx',
    youtube: './src/scripts/youtube.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './public', to: path.resolve(__dirname, 'dist') },
        { from: './src/scripts/youtube.css', to: path.resolve(__dirname, 'dist') },
        { from: './src/assets/img', to: path.resolve(__dirname, 'dist') },
      ],
    }),
  ],
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json'],
  },
};
