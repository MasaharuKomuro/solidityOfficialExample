module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    micro_payment_channel: [
      './src/micro_payment_channel.js',
    ],
    simple_payment_channel: [
      './src/simple_payment_channel.js',
    ],
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};