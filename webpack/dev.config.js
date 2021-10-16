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
    contentBase: false,
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
    new webpack.DefinePlugin({
      "process.env.FIREBASE_API_KEY": JSON.stringify(process.env.FIREBASE_API_KEY),
      "process.env.FIREBASE_AUTH_DOMAIN": JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      "process.env.FIREBASE_DB_URL": JSON.stringify(process.env.FIREBASE_DB_URL),
      "process.env.FIREBASE_PROJECT_ID": JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      "process.env.FIREBASE_STORAGE_BUCKET": JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      "process.env.FIREBASE_MSG_SENDER_ID": JSON.stringify(process.env.FIREBASE_MSG_SENDER_ID),
      "process.env.FIREBASE_APP_ID": JSON.stringify(process.env.FIREBASE_APP_ID),
    }),
  ],
});
