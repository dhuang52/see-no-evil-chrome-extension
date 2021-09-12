var path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = env => {
  const mode = env.NODE_ENV || 'development'
  return {
    mode,
    entry: {
      popup: './src/popup.js',
      background: './src/scripts/background.js',
      youtube: './src/scripts/youtube.js',
    },
    output: {
      path: path.resolve(__dirname , 'dist'),
      filename: '[name].bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          loader:'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader','css-loader']
        }
      ]
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: './public', to: path.resolve(__dirname, 'dist') }
        ],
      }),
      new CleanWebpackPlugin(),
    ],
    devtool: mode === 'development' ? 'cheap-module-source-map' : false,
    resolve: {
      extensions: ['.wasm', '.mjs', '.js', '.jsx', '.json']
    }
  }
}