import socketIO from 'socket.io-client'
import {actions, send} from 'shared/actions'
import {actionDispatcher} from 'shared/dispatcher'

const io = socketIO(process.env.SOCKET_ADDRESS)

io.on('server action', ({action}) => {
  send(action.type, action.data)
})

const serverDispatcher = actionDispatcher(actions.USER_JOINED, 
                                          actions.USER_FAILED, 
                                          actions.USER_SUCCEEDED, 
                                          actions.PATTERN_ADDED,
                                          actions.PATTERN_TIMEDOUT,
                                          actions.GAME_RESTARTED)
                          .do((action) => {                            
                            io.emit('client action', {action})
                          })
                          .startWith(null)

export default serverDispatcher