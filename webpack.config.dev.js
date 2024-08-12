"use strict";

const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "dev/main.tsx"),
    vendor: ["react", "react-dom"],
  },
  target: "web",
  mode: "development",
  devServer: {
    inline: false,
    contentBase: path.resolve(__dirname, "dist"),
    compress: false,
    host: "0.0.0.0",
    port: 4000,
    hot: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        enforce: "pre",
        test: /\.js$/,
        type: "javascript/auto",
        loader: "source-map-loader",
      },
      {
        type: "javascript/auto",
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
      {
        type: "javascript/auto",
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
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
              implementation: require("sass"),
              sassOptions: {
                includePaths: [path.resolve(__dirname, "src/scss/")],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "assets/",
            },
          },
        ],
        // type: "asset/inline",
      },
    ],
  },
  devtool: "inline-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: "./dev/index.html",
    }),
    new webpack.ProvidePlugin({
      React: "react",
    }),
  ],
  performance: {
    hints: false,
  },
};
