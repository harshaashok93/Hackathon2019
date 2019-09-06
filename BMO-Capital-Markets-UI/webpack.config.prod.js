const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const packageJson = require(path.join(process.cwd(), 'package.json'));
const siteEnvConfig = packageJson.webpackHtml[process.env.SITE_ENV];
const pageTitle = siteEnvConfig.title;
const devPublicPath = siteEnvConfig[process.env.HOST_ENV].devPublicPath;
const gtmID = siteEnvConfig.gtmID;
const cmsFilePath = siteEnvConfig.cmsFilePath;

module.exports = webpackMerge(commonConfig, {
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader',
      }),
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader'],
      }),
    }]
  },
  performance: {
    hints:'warning',
  },
  plugins:[
    new ProgressPlugin(),
    new OptimizeCssAssetsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: 'public/assets/images/favicon.ico',
      minify: {
        collapseactivityBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        html5: true,
        minifyJS: true,
        processConditionalComments: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
      template: path.join(process.cwd(), 'public/index.html'),
      title: pageTitle,
      version: packageJson.version,
      gtmid: gtmID,
      devPublicPath,
      cmsFilePath
    }),
    new HtmlWebpackPlugin({
      filename: 'preview.html',
      minify: {
        collapseactivityBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        html5: true,
        minifyJS: true,
        processConditionalComments: true,
        removeAttributeQuotes: false,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
      },
      template: path.join(process.cwd(), 'public/preview.html'),
      title: pageTitle,
      version: packageJson.version,
      gtmid: gtmID,
      devPublicPath,
      cmsFilePath
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    })
  ],
  stats: {
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    modules: false,
  }
});
