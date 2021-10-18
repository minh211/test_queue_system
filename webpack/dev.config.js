const webpack = require("webpack");
const { merge } = require("webpack-merge");
const path = require("path");
const DotEnv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const paths = require("../config/paths");
const baseConfig = require("./base.config.js");

DotEnv.config({ path: ".env.dev" });

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    watchContentBase: true,
    publicPath: "/",
    historyApiFallback: true,
    clientLogLevel: "warning",
    compress: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
