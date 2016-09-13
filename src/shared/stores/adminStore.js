import {Observable} from '@reactivex/rxjs'
import {Actions, dispatch} from 'shared/actions'
import {UserStatus} from 'shared/consts'
import {Colors} from 'shared/consts'

const colorKeys = Object.keys(Colors)

export const restartGame = 
  Observable.of(() => {
    dispatch(Actions.GAME_RESTARTED)
  })

export const generateNewPattern =
  Observable.of(() => {
    // dispatch data so it isn't mixed with restarts
    dispatch(Actions.PATTERN_ADDED, {time: new Date()})
  })

export const timeoutPattern = 
  Observable.of(() => {
    dispatch(Actions.PATTERN_TIMEDOUT)
  })

export default Observable.combineLatestObj({restartGame, 
                                            generateNewPattern, 
                                            timeoutPattern})