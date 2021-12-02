const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sass = require('sass');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const { mode } = argv;
  const additionalPlugins =
    mode === 'production' ? [] : [];

  const additionalEntries = mode === 'production' ? [] : [];

  return {
    mode,
    performance: {
      hints: mode === 'production' ? 'warning' : false,
      maxEntrypointSize: 244000,
      maxAssetSize: 244000,
    },
    entry: [
      '@babel/polyfill', // so we don't need to import it anywhere
      './client',
      ...additionalEntries,
    ],
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'index_bundle.js',
    },
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      compress: true,
      port: 3000,
      proxy: {
        '/api': 'http://localhost:4000',
      },
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          // Load JS files
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }            
          },
        },
        {
          test: /\.(woff|woff2|ttf|eot)$/,
          use: 'file-loader',
        },
        {
          // Load CSS SCSS & SASS files
          test: /\.s?[ac]ss$/i,
          use: [
            // Injects the style element
            'style-loader',
            {
              loader: MiniCssExtractPlugin.loader,
              options: { esModule: false },
            },
            // Translates CSS into CommonJS
            'css-loader',
            // Compiles Sass to CSS
            {
              loader: 'sass-loader',
              options: {
                // Prefer `dart-sass`
                implementation: sass,
              },
            },
          ],
        },
        {
          // Load other files
          test: /\.(png|jpg|gif|svg|eot|ttf)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.BUILT_AT': JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      // Skip the part where we would make a html template
      new HtmlWebpackPlugin({
        template: './client/assets/index.html',
        favicon: path.resolve(__dirname, 'client/assets/favicon.ico'),
      }),
      new MiniCssExtractPlugin(),
      ...additionalPlugins,
    ],
  };
};
