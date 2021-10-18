const fs = require("fs");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const path = require("path");
const DotEnv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const baseConfig = require("./base.config.js");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
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
      template: resolveApp("client/public/index.html"),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
