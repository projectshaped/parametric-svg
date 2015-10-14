module.exports = {
  entry: './test/runner.js',

  output: {
    path: __dirname + '/.webpack',
    filename: 'runner.js',
  },

  module: {loaders: [{
    loader: 'babel-loader',
    test: /\.js$/,
    exclude: /\/node_modules\//,
  }]},

  resolve: {alias: {
    'isomorphic-ensure': 'isomorphic-ensure/mock',
    'raw-loader': 'isomorphic-ensure/mock',
    'jsdom': 'isomorphic-ensure/mock',
    'xmldom': 'isomorphic-ensure/mock',
  }},

  node: {
    fs: 'empty',
  },

  devtool: 'source-map',
};
