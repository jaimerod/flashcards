const webpack = require('webpack');

module.exports = {
  entry: __dirname + '/src/js/app.jsx',
  output: {
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    }]
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    /*
    new webpack.optimize.UglifyJsPlugin({
      compress: {

      }
    })
    */
  ]
};
