const webpack = require("webpack");
const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const common = require("./webpack.common");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  stats: "minimal",
  //   devtool: 'source-map',
  devtool: "cheap-module-source-map",
  // devtool: "eval-cheap-source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "../src/public"),
    },
    hot: true,
    historyApiFallback: true,
    allowedHosts: "all",
    port: 8888,
    proxy: {
      "/api": {
        target: "https://xxxx.com",
        changeOrigin: true,
        pathRewrite: { "^/api": "" },
        headers: {
          Referer: "https://xxxx.com",
        },
      },
    },
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
});
