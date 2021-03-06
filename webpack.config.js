"use strict";
const path = require("path");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const isProd = true;

module.exports = {
  entry: {
    app: ["scripts/app.ts", "styles/app.scss"]
  },

  context: path.join(process.cwd(), "src"),

  output: {
    publicPath: isProd ? "/" : "http://localhost:8080/",
    path: path.join(process.cwd(), "dist"),
    filename: "scripts/[name].[hash].js"
  },

  mode: "production",

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      },
      {
        enforce: "pre",
        test: /\.ts$/,
        loader: "tslint-loader"
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true,
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      chunksSortMode: "dependency"
    }),

    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: "css/[id].[hash].css"
    }),

    new CopyWebpackPlugin([{ from: "public" }])
  ],

  resolve: {
    modules: ["node_modules", path.resolve(process.cwd(), "src")],
    extensions: [".ts", ".js", "scss"]
  },

  devServer: {
    contentBase: path.resolve(process.cwd(), "dist"),
    clientLogLevel: "info",
    port: 8080,
    inline: true,
    historyApiFallback: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 500
    }
  },

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "all"
        }
      }
    }
  },

  devtool: "source-map"
};
