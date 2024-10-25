const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode:'production',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              'corejs': '3',
              'useBuiltIns': 'usage'
            }]
          ],
          plugins: ['@babel/plugin-transform-runtime']
        }
      }
    }]
  }
})
