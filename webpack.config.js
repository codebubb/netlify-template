const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isLocal = !!process.env.production || true;

const config = {
  entry: path.join(__dirname, 'src','index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          (isLocal ? 'style-loader' : MiniCssExtractPlugin.loader),
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              minimize: !isLocal,
              sourceMap: isLocal,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [autoprefixer()],
            },
          },
          'sass-loader',
        ],
      },
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // Provide environment vars to the app
      project_name: 'netlify-template'
    }),
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      chunkFilename: 'styles.css',
    }),
    new OptimizeCssAssetsPlugin(),
  ],
};

if (isLocal) {
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html')
    })
  );
}

module.exports = config;
