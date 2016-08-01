import {Observable} from '@reactivex/rxjs'
import dispatcher, {actionDispatcher} from 'shared/dispatcher'
import {actions, send} from 'shared/actions'
import {UserStatus} from 'shared/consts'
import {Colors} from 'shared/consts'

const colorKeys = Object.keys(Colors)

export const restartGame = 
  Observable.of(() => {
    send(actions.GAME_RESTARTED)
  })

export const generateNewPattern =
  Observable.of(() => {
    // Send data so it isn't mixed with restarts
    send(actions.PATTERN_ADDED, {time: new Date()})
  })

export const timeoutPattern = 
  Observable.of(() => {
    send(actions.PATTERN_TIMEDOUT)
  })

export default Observable.combineLatestObj({restartGame, generateNewPattern, timeoutPattern})