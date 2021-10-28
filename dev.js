const spawn = require("cross-spawn");
const path = require("path");
const webpack = require("webpack");
const webpackConfigClient = require("./webpack.config.client");
const webpackConfigServer = require("./webpack.config.server");

const compiler = webpack([
  {
    ...webpackConfigClient,
    mode: "development",
    devtool: "source-map",
    output: {
      ...webpackConfigClient.output,
      filename: "[name].js",
    },
  },
  {
    ...webpackConfigServer,
    mode: "development",
    devtool: "source-map",
  },
]);

let node;

compiler.hooks.watchRun.tap("Dev", (compiler) => {
  if (compiler.name === "server" && node) {
    node.kill();
    node = undefined;
  }
});

compiler.watch({}, (err, stats) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const compiledSuccessfully = !stats?.hasErrors();
  if (compiledSuccessfully && !node) {
    node = spawn("node", ["--inspect", path.join(__dirname, "dist/server.js")], {
      stdio: "inherit",
    });
  }
});
