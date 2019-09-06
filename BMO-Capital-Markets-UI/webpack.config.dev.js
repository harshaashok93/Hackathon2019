const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.config.js');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const packageJson = require(path.join(process.cwd(), 'package.json'));
const siteEnvConfig = packageJson.webpackHtml[process.env.SITE_ENV];
const pageTitle = siteEnvConfig.title;
const devPublicPath = siteEnvConfig[process.env.HOST_ENV].devPublicPath;
const gtmID = siteEnvConfig.gtmID;
const cmsFilePath = siteEnvConfig.cmsFilePath;

const publicPath = process.env.PUBLIC_PATH || '/';
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

const plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
  new FriendlyErrors(),
  new webpack.NamedModulesPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.join(process.cwd(), 'public/index.html'),
    title: pageTitle,
    version: packageJson.version,
    devPublicPath,
    gtmid: gtmID,
    cmsFilePath
  }),
  new HtmlWebpackPlugin({
    filename: 'preview.html',
    template: path.join(process.cwd(), 'public/preview.html'),
    title: pageTitle,
    version: packageJson.version,
    devPublicPath,
    gtmid: gtmID,
    cmsFilePath
  })
];
if (process.env.BUNDLE_ANALYZE === 'true') {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackMerge(commonConfig, {
  devtool: 'eval-source-map',
  module: {
    rules: [
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?sourceMap=true', 'resolve-url-loader'],
      }),
    },
    {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader?sourceMap=true', 'resolve-url-loader', 'sass-loader?sourceMap=true&precision=8'],
      }),
    }]
  },
  plugins,
  devServer: {
    contentBase: 'public',
    stats: 'errors-only',
    hot: true,
    inline: true,
    historyApiFallback: { index: publicPath },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    host,
    port,
  }
});
