import {Observable} from '@reactivex/rxjs'
import dispatcher from 'shared/dispatcher'
import {actions} from 'shared/actions'
import {Colors, GameSpeedMS, DefaultLevel} from 'shared/consts'

const colorKeys = Object.keys(Colors)

function getRandomColor() {
  // Generate a random key to get a random color
  const randomIndex = Math.floor(Math.random() * colorKeys.length)
  const colorKey = colorKeys[randomIndex]
  return Colors[colorKey]
}

export const newPattern = 
  dispatcher(actions.PATTERN_ADDED, actions.GAME_RESTARTED)
    .scan((pattern, data) => {
      // If not data restarted
      if (!data) {
        return {colors: []}
      }

      const patternObj = {
        id: pattern.colors.length + 1,
        colors: pattern.colors.slice()
      }

      if (!patternObj.colors.length) {
        // Start from the default level (-1 bcs will add another color after for)
        for (let i = 0; i < DefaultLevel - 1; i++) {
          patternObj.colors.push(getRandomColor())
          patternObj.colors.push('transparent')   
        }      
      }
      
      patternObj.colors.push(getRandomColor())
      patternObj.colors.push('transparent')  

      return patternObj
    }, {colors: []})   
    .startWith({colors: []})
    .publishReplay(1)
    .refCount()

export const patterns = 
  newPattern
  .scan((patterns, pattern) => {
    // Game restarted
    if (!pattern.colors.length) {
      return [] 
    }

    patterns.push(pattern)

    return patterns
  }, [])
  .startWith([])
  .publishReplay(1)
  .refCount()

export default Observable.combineLatestObj({newPattern, 
                                            patterns})