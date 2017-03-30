/* tslint:disable:max-line-length */
const path = require('path');
const loader = require('awesome-typescript-loader');
const CheckerPlugin = loader.CheckerPlugin;

const babelExcludes = [
  /node_modules/,
  /build/,
];

const NODE_MODULES_PATH = path.join(__dirname, 'node_modules');

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  entry: {
    index: [
      "babel-polyfill",
      './src/app.tsx',
    ],
    vendor: [
      'react',
      'react-dom',
    ],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss', '.css'],
    modules: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: babelExcludes,
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: babelExcludes,
        query: {
          useBabel: true,
          useCache: true,
        },
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      }
    ]
  },
  plugins: [
  ],
};
