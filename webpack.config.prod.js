"use strict";

const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    path: path.join(__dirname, "/lib"),
    filename: "index.js",
    library: "react-chat-widget",
    libraryTarget: "umd",
    // clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      react: path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": require.resolve("./node_modules/react/jsx-runtime"),
    },
  },
  target: "web",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: [/node_modules/, /dev/],
        use: ["babel-loader", "ts-loader"],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["postcss-preset-env"],
              },
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require("node-sass"),
              sassOptions: {
                includePaths: [path.resolve(__dirname, "src/scss/")],
              },
            },
          },
        ],
      },
      // Updated rule for handling image assets
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "[id].css",
    }),
    new webpack.ProvidePlugin({
      react: "React",
    }),
  ],
  externals: {
    react: {
      root: "React",
      commonjs2: "react",
      commonjs: "react",
      amd: "react",
    },
    "react-dom": {
      root: "ReactDOM",
      commonjs2: "react-dom",
      commonjs: "react-dom",
      amd: "react-dom",
    },
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
};
