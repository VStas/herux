module.exports = {
  devtool: 'source-map',
  entry: {
    bundle: __dirname + '/first/first.js'
  },
//   module: {
//     loaders: [webpackChips.LOADER_BABEL]
//   },
  output: {
    path: __dirname + '/[name]',
    filename: '[name].js'
  }
};
