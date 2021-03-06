#!/usr/bin/env node

// Based on
// https://github.com/gaearon/react-transform-boilerplate/blob/master/devServer.js

var path = require('path')
var express = require('express')
var webpack = require('webpack')

var configFile = process.argv[2] || 'webpack.config.js'
var config
try {
  config = require(path.join(process.cwd(), configFile))
} catch (e) {
  console.error(e.stack)
  console.error(
    'Failed to load webpack config, please use like this\n' +
    'hjs-dev-server.js webpack.config.js\n'
  )
  process.exit(1)
}

var serverConfig = config.devServer
var app = express()
var compiler = webpack(config)

if (serverConfig.historyApiFallback) {
  app.use(require('connect-history-api-fallback')({
    verbose: false
  }))
}

app.use(require('webpack-dev-middleware')(compiler, config.devServer))

if (serverConfig.hot) {
  app.use(require('webpack-hot-middleware')(compiler))
}

if (serverConfig.contentBase) {
  app.use(express.static(serverConfig.contentBase))
}

app.listen(serverConfig.port, serverConfig.hostname, function (err) {
  if (err) {
    console.error(err)
    return
  }

  console.log('Listening at http://' + serverConfig.hostname + ':' + serverConfig.port)
})
