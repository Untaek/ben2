const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

module.exports = {
  mode: 'development',
  entry: {
    app: ['babel-polyfill', path.join(__dirname, 'game', 'js', 'main.js')]
    //vendor: ['pixi', 'p2', 'phaser']
  },
  output: {
    pathinfo: true,
    publicPath: './public/dist/',
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public', 'dist')
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'game')
  },
  watch: true,
  devtool: 'cheap-source-map',

  module: {
    rules: [
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2'] }
    ]
  },
  plugins: [],
  devtool: 'source-map',
  devServer: {
    publicPath: path.join('/dist/')
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      phaser: phaser,
      pixi: pixi,
      p2: p2
    },
    extensions: ['.js']
  }
}
