const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const dotenv = require("dotenv");

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
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.client.json",
        },
      },
      {
        test: /\.m?js$/,
        use: {
          loader: "babel-loader",
          options: { presets: ["@babel/preset-env"], plugins: ["babel-plugin-styled-components"] },
        },
      },
      { test: /\.js$/, loader: "webpack-remove-debug" },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.config().parsed), // it will automatically pick up key values from .env file
    }),
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: ["**/*", "!manifest.json"],
    }),
    new WebpackManifestPlugin(),
  ],
};
