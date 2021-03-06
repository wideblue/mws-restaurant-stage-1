const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const glob = require('glob');

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
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  devServer: {
    contentBase: './dist',
    port: 8000
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      // note that styles.css is bundled only through index.js
      filename: 'styles.css'
    }),
    new HtmlWebpackPlugin({
      hash: false,
      title: 'Restaurant Reviews',
      myPageHeader: 'Restaurant Reviews',
      template: './src/index.html',
      chunks: ['app'],
      filename: 'index.html'
    }),
    new HtmlWebpackPlugin({
      hash: false,
      title: 'Restaurant Reviews',
      myPageHeader: 'Restaurant Details',
      template: './src/restaurant.html',
      chunks: ['restaurant'],
      filename: 'restaurant.html'
    }),
    new ImageminPlugin({
      // test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [
        imageminMozjpeg({
          quality: 5,
          progressive: true
        })
      ],
      externalImages: {
        context: 'src/img', // Important! This tells the plugin where to "base" the paths at
        sources: glob.sync('src/img/*.jpg'),
        destination: 'dist/img/placeholders'
      }
    }),
    new CopyWebpackPlugin([
      // { from: './src/css/', to: 'css/' },
      { from: './src/img/', to: 'img/' },
      // { from: './src/sw.js', to: 'sw.js' },
      // { from: './src/data/', to: 'data/' },
      { from: 'GzipSimpleHTTPServer.py', to: 'GzipSimpleHTTPServer.py' }
    ]),
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      plugins: [
        imageminMozjpeg({
          quality: 60,
          progressive: true
        })
      ]
    }),
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
    new WorkboxPlugin.InjectManifest({
      swSrc: './src/service-worker.js'
    })
  ]
};
