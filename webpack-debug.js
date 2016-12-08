var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");

process.env.NODE_ENV = 'development';

var webpackConfig = require('./webpack.config.js');

webpackConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());

var compiler = webpack(webpackConfig); // load webpack
// run dev-server
var server = new WebpackDevServer(compiler, {
  contentBase: "src",
  hot: true,
  inline: true
});
server.listen(3000);
