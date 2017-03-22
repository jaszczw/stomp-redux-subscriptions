const internalIp = require('internal-ip');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const path = require('path');
const config = require('./webpack.config');

const app = express();
const compiler = webpack(config);

const middleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  silent: false,
  stats: { color: true },
});

app.use(middleware);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './src/index.html'));
});

const port = Number(process.env.npm_config_port) || 8081;
const ip = internalIp.v4();

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(' --------------------------------------');
  console.log(`    Local: http://0.0.0.0:${port}`);
  console.log(` External: http://${ip}:${port}`);
  console.log(' --------------------------------------');
});

