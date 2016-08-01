import {Observable} from '@reactivex/rxjs'
import keyMirror from 'key-mirror'

export const Colors = {
  RED: '#FF0000',
  ORANGE: '#FF7F00',
  YELLOW: '#FFFF00',
  GREEN: '#00FF00',
  CYAN: '#00FFFF',
  BLUE: '#0000FF',
  VIOLET: '#7F00FF',
  MAGENTA: '#FF00FF'  
}

export const GameSpeedMS = 1000

export const DefaultLevel = 3

export const GameIsInProgressErrorCode = -999

export const UserStatus = keyMirror({
  CANTJOIN: null,
  IDEAL: null,
  SUCCESS: null,
  FAILED: null,
  TIMEDOUT: null,
  NA: null
})

Observable.combineLatestObj = function (obsObj) {  
  let observables = []
  const keys = Object.keys(obsObj)

  keys.map((key) => {
    observables.push(obsObj[key])
  })

  return Observable.combineLatest(observables, (...args) => {    
    return args.reduce((output, current, i) => {
      return Object.assign(output, {[keys[i]]: current})
    }, {})
  })
}