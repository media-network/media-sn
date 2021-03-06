import connectSlashes from 'connect-slashes'
import express from 'express'
import errorHandler from 'errorhandler'
import morgan from 'morgan'
import path from 'path'

import config from 'infrastructure/config'
import loadSetting from 'middlewares/setting'

const server = express()

if (config.debug) {
  server.use(morgan('tiny'))
}

if (!config.production) {
  server.use('/favicon.ico', (req, res) => res.sendStatus(404))

  const libDir = path.resolve(__dirname, '../node_modules')
  server.use('/libs', express.static(libDir))
}

server.use(connectSlashes(false))

// always load setting
server.use(loadSetting)

// load modules
server.use('/api', require('./api').default)
server.use('/admin', require('./admin').default)
server.use('/', require('./app').default)

if (!config.production) {
  server.use(errorHandler())
}

if (config.production) {
  server.use((error, req, res, next) => res.redirect('/'))
}

export default server
