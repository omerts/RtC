import {Observable} from '@reactivex/rxjs'
import {actionDispatcher} from 'shared/dispatcher'
import {actions, send} from 'shared/actions'
import 'shared/consts' // for Observable.combineLatestObj

let ioServer = undefined

export const initServer = (server) => {
  ioServer = server
}

export const initClient = (socket) => {
  socket.on('client action', ({action}) => {
    const {type, data} = action

    if (type === actions.USER_JOINED) {
      data.socket = socket
    }

    send(type, data)
  })
}

export const specificClientDispatcher = actionDispatcher(actions.USER_REGISTERED,
                                                         actions.USER_REGISTRATION_FAILED, 
                                                         actions.USER_TIMEDOUT)
                                        .do((action) => {
                                          const {socket, ...other} = action.data

                                          // Make sure the socket isn't passed on
                                          action.data = other

                                          // Emit to specific client
                                          socket.emit('server action', {action})
                                        })
                                        .startWith(null)

export const clientDispatcher = actionDispatcher(actions.PATTERN_ACTIVATED, 
                                                 actions.STATS_UPDATED,
                                                 actions.GAME_STARTED)
                                  .do((action) => {
                                    // Make sure the socket isn't passed on
                                    if (action.data) {
                                      const {socket, ...other} = action.data
                                      action.data = other
                                    }

                                    // Emit to all clients
                                    ioServer.sockets.emit('server action', {action})
                                  })
                                  .startWith(null)

export default Observable.combineLatestObj({specificClientDispatcher, clientDispatcher})