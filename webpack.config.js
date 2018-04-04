const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    app: './src/js/index.js',
    restaurant: './src/js/restaurant_info.js',
    config: './src/config.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  /* module: {
  rules: [
    {
      test: /\.html$/,
      use: [{ loader: "html-loader", options: { minimize: true } }]
    }
  ]
}, */
  plugins: [
    new HtmlWebpackPlugin({
      hash: false,
      title: 'Restaurant Reviews',
      myPageHeader: 'Restaurant Reviews',
      template: './src/index.html',
      chunks: ['app', 'config'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      hash: false,
      title: 'Restaurant Reviews',
      myPageHeader: 'Restaurant Details',
      template: './src/restaurant.html',
      chunks: ['restaurant', 'config'],
      filename: 'restaurant.html'
    }),
    new CopyWebpackPlugin([
      { from: './src/css/', to: 'css/' },
      { from: './src/img/', to: 'img/' },
      { from: './src/data/', to: 'data/' },
      { from: './src/sw.js', to: 'sw.js' }
    ])
  ]
};
