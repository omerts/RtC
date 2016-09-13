import socketIO from 'socket.io-client'
import {Actions, dispatch} from 'shared/actions'
import {getAction} from 'shared/dispatcher'

const io = socketIO(process.env.SOCKET_ADDRESS)

const emit =
  (action) => {
    io.emit('client action', {action})
  }

io.on('server action', ({action}) => {
  dispatch(action.type, action.payload)
})

const serverDispatcher = getAction(Actions.USER_JOINED,
                                   Actions.USER_FAILED,
                                   Actions.USER_SUCCEEDED,
                                   Actions.PATTERN_ADDED,
                                   Actions.PATTERN_TIMEDOUT,
                                   Actions.GAME_RESTARTED)
                          .do(emit)
                          .startWith(null)

export default serverDispatcher