const nodeExternals = require("webpack-node-externals");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const WebpackBar = require("webpackbar");
const webpack = require("webpack");
module.exports = {
  name: "server",
  entry: {
    server: path.resolve(__dirname, "server/server.tsx"),
  },
  mode: "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  externals: [nodeExternals()],
  target: "node",
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre",
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "esbuild-loader",
          options: {
            loader: "tsx",
            target: "es2015",
            tsconfigRaw: require("./tsconfig.server.json"),
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: "./tsconfig.server.json",
      },
    }),
    new CopyPlugin({
      patterns: [{ context: "server", from: "views", to: "views" }],
    }),
    new WebpackBar({ name: "server", color: "blue" }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
