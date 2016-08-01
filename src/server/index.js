// This grants us source map support, which is handy as our webpack bundling
// for the server will include source maps.  Therefore we will have nice stack
// traces again for our server.
import 'source-map-support/register'

import express from 'express'
import http from 'http'
import socketIO from 'socket.io'
import compression from 'compression'
import hpp from 'hpp'
import helmet from 'helmet'
import universalReactAppMiddleware from './middleware/universalReactApp'
import clientConfigBuilder from '../../webpack.client.config.js'
import services from './services'
import stores from './stores'
import {initServer, initClient} from './services/socketService'

// Create our express based server.
const app = express()
const server = http.Server(app)
const io = socketIO(server)

// Don't expose any software information to hackers.
app.disable('x-powered-by');

// Prevent HTTP Parameter pollution.
app.use(hpp());

// Content Security Policy
app.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'"],
  styleSrc: ["'self'"],
  imgSrc: ["'self'"],
  connectSrc: ["'self'", 'ws:'],
  fontSrc: ["'self'"],
  objectSrc: ["'none'"],
  mediaSrc: ["'none'"],
  frameSrc: ["'none'"],
}));
app.use(helmet.xssFilter());
app.use(helmet.frameguard('deny'));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());

// Response compression.
app.use(compression());

// Configure static serving of our webpack bundled client files.
const webpackClientConfig = clientConfigBuilder({ mode: process.env.NODE_ENV });
app.use(
  webpackClientConfig.output.publicPath,
  express.static(webpackClientConfig.output.path));

// Bind our universal react app middleware as the handler for all get requests.
app.get('*', universalReactAppMiddleware);

// Create an http listener for our express app.
const listener = server.listen(parseInt(process.env.SERVER_PORT, 10));

initServer(io)

io.on('connection', (socket) => {
  initClient(socket)
})

stores.subscribe(() => {}, ::console.log, ::console.log)
services.subscribe(() => {}, ::console.log, ::console.log)

if (process.env.NODE_ENV === 'development') {
  console.log(`==> 💚  HTTP Listener is running on port ${process.env.SERVER_PORT}`); // eslint-disable-line no-console,max-len
}

// We export the listener as it will be handy for our development hot reloader.
export default listener;
