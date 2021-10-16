const webpack = require("webpack");
const { merge } = require("webpack-merge");
const DotEnv = require("dotenv");
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const workboxPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require("path");
const paths = require("../config/paths");
DotEnv.config({ path: ".env.prod" });

const baseConfig = require("./base.config.js");

module.exports = merge(baseConfig, {
  output: {
    filename: "js/[name].[chunkhash].js",
    chunkFilename: "js/[id].[chunkhash].js",
  },
  mode: "production",
  devtool: "source-map",
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true,
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all",
        },
      },
    },
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      // in case you got a minified error #307, just remove uglify js
      // problems may occur when using react hooks
      // new UglifyJsPlugin()
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: "auto",
    }),
  ],
});
