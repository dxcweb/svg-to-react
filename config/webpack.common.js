const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// webpack-manifest-plugin 生成文件清单 manifest.json
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const dotenv = require("dotenv");
dotenv.config("./env");

const devMode = process.env.NODE_ENV !== "production";
module.exports = {
  entry: {
    index: "./src/index.js",
  },
  target: ["web", "es5"],
  output: {
    filename: "[name].[contenthash:8].js",
    publicPath: devMode ? "/" : "./",
    environment: {
      // 是否使用箭头函数
      arrowFunction: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          plugins: [devMode && require.resolve("react-refresh/babel")].filter(Boolean),
        },
      },
      {
        test: /\.(le|c)ss$/,
        exclude: /node_modules/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                auto: /^((?!global).)*$/,
                localIdentName: "[local]--[hash:base64:5]",
              },
            },
          },
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(le|c)ss$/,
        include: /node_modules/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|mp3)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 1024,
            name: "static/[name].[hash:8].[ext]",
            esModule: false,
          },
        },
        type: "javascript/auto",
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    extensions: [".web.js", ".js", ".jsx"],
  },
  performance: {
    hints: false,
  },
  stats: {
    colors: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": { ENV: `"${process.env.ENV}"` },
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: "./src/index.html",
      scriptLoading: "blocking",
      //   filename: path.join(DIST_DIR, 'index.html'),
      //   favicon: './src/assets/favicon.ico',
    }),
    // new LodashModuleReplacementPlugin(),
    new webpack.ProgressPlugin(),
  ],
};
