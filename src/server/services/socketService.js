import {Observable} from '@reactivex/rxjs'
import {getAction} from 'shared/dispatcher'
import {Actions, dispatch} from 'shared/actions'
import 'shared/consts' // for Observable.combineLatestObj

let ioServer = undefined

const dispatchToSpecificClient =
  (action) => {
    const {socket, ...other} = action.payload

    // Make sure the socket isn't passed on
    action.payload = other

    // Emit to specific client
    socket.emit('server action', {action})
  }

const dispatchToAllClients =
  (action) => {
    // Make sure the socket isn't passed on
    if (action.payload) {
      const {socket, ...other} = action.payload
      action.payload = other
    }

    // Emit to all clients
    ioServer.sockets.emit('server action', {action})
  }

export const initServer = (server) => {
  ioServer = server
}

export const initClient = (socket) => {
  socket.on('client action', ({action}) => {
    const {type, payload} = action

    if (type === Actions.USER_JOINED) {
      payload.socket = socket
    }

    dispatch(type, payload)
  })
}

export const specificClientDispatcher =
  getAction(Actions.USER_REGISTERED,
            Actions.USER_REGISTRATION_FAILED,
            Actions.USER_TIMEDOUT)
            .do(dispatchToSpecificClient)
            .startWith(null)

export const clientDispatcher =
  getAction(Actions.PATTERN_ACTIVATED,
            Actions.STATS_UPDATED,
            Actions.GAME_STARTED)
  .do(dispatchToAllClients)
  .startWith(null)

export default Observable.combineLatestObj({specificClientDispatcher, clientDispatcher})