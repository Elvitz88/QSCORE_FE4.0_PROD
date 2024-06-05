const webpack = require('webpack');

module.exports = {
  // Your other webpack config here...
  plugins: [
    // Your other plugins...
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL),
    }),
  ],
};


