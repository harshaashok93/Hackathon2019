const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const publicPath = process.env.PUBLIC_PATH || '/';
const outputPath = path.join(process.cwd(), `dist_${process.env.SITE_ENV}`);

const config = {
  entry: {
    // app: ['babel-polyfill', path.join(process.cwd(), './single-spa-config.js')],
    // vendor: [
    //   'babel-polyfill',
    //   'url-polyfill',
    //   'react',
    //   'react-addons-perf',
    //   'react-date-picker',
    //   'react-dom',
    //   'react-helmet',
    //   'react-highcharts',
    //   'react-image-gallery',
    //   'react-redux',
    //   'react-router',
    //   'react-router-dom',
    //   'react-router-redux',
    //   'react-slick',
    //   'react-slider',
    //   'redux',
    //   'redux-thunk',
    //   'md5',
    //   'moment',
    //   'unchained-ui-react',
    //   'whatwg-fetch',
    // ],
    'single-spa.config': './single-spa-config.js',
  },
  output: {
    path: `${outputPath}`,
    filename: 'js/[name].[hash].js',
    publicPath,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.json', '.scss', '.vue'],
    modules: [
      path.join(process.cwd(), 'client'),
      path.join(process.cwd(), 'node_modules'),
    ],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx?$/,
        exclude: new RegExp('/node_modules/(?!(unchained-ui-react))'),
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              prefix: 'images/',
              limit: 8000,
              mimetype: 'image/png',
              name: 'images/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /(\.jpg|\.jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              prefix: 'images/',
              limit: 8000,
              mimetype: 'image/jpeg',
              name: 'images/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              prefix: 'fonts/',
              limit: 8000,
              mimetype: 'image/svg+xml',
              name: 'fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.woff$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              prefix: 'fonts/',
              limit: 8000,
              mimetype: 'application/font-woff',
              name: 'fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.woff2$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              prefix: 'fonts/',
              limit: 8000,
              mimetype: 'application/font-woff2',
              name: 'fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.ttf$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              prefix: 'fonts/',
              limit: 8000,
              mimetype: 'application/font-ttf',
              name: 'fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.eot$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              prefix: 'fonts/',
              limit: 8000,
              mimetype: 'application/font-eot',
              name: 'fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.HOST_ENV': JSON.stringify(process.env.HOST_ENV),
      'process.env.SITE_ENV': JSON.stringify(process.env.SITE_ENV),
      'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js/vendor.[hash].js',
      minChunks: Infinity
    }),
    new ExtractTextPlugin('css/[name].[chunkhash:8].css'),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en|es|fr/),
    new VueLoaderPlugin(),
  ],
};

module.exports = config;
