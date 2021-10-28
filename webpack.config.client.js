const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const dotenv = require("dotenv");
const WebpackBar = require("webpackbar");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
module.exports = {
  name: "client",
  entry: {
    client: path.resolve(__dirname, "client/index.tsx"),
  },
  mode: "production",
  output: {
    path: path.resolve(__dirname + "/dist/static"),
    filename: "[name].[contenthash].js",
    publicPath: "",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".mjs"],
  },
  target: "web",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
      },
      {
        test: /\.svg$/,
        use: ["svg-loader"],
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)([?]?.*)$/,
        use: ["file-loader"],
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, use: ["url-loader?limit=100000"] },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "esbuild-loader",
          options: {
            loader: "tsx",
            target: "es2015",
            tsconfigRaw: require("./tsconfig.client.json"),
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: "./tsconfig.client.json",
      },
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.config().parsed), // it will automatically pick up key values from .env file
    }),
    new CleanWebpackPlugin({
      verbose: false,
      cleanOnceBeforeBuildPatterns: ["**/*", "!manifest.json"],
    }),
    new WebpackManifestPlugin(),
    new WebpackBar({ name: "client" }),
  ],
};
