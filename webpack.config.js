const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
  entry: {
    app: './src/js/index.js',
    restaurant: './src/js/restaurant_info.js',
    config: './src/config.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader', options: { minimize: true } }]
      }
    ]
  },
  devServer: {
    contentBase: './dist',
    port: 8000
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
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
      // { from: './src/sw.js', to: 'sw.js' },
      { from: './src/data/', to: 'data/' }
    ]),
    new WebpackPwaManifest({
      name: 'Restaurant Reviews',
      short_name: 'R Reviews',
      description: 'Fork of MWS Restaurant Reviews App',
      background_color: '#3397db',
      theme_color: '#01579b',
      'theme-color': '#01579b',
      start_url: '/',
      icons: [
        {
          src: path.resolve('src/icon.svg'),
          sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
        }
      ]
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
      ignoreUrlParametersMatching: [/id/]
      /*  runtimeCaching: [
        {
          urlPattern: new RegExp('http://localhost:1337/restaurants'),
          handler: 'staleWhileRevalidate'
        }
      ] */
    })
  ]
};
