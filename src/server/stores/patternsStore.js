import {Observable} from '@reactivex/rxjs'
import getPayload from 'shared/dispatcher'
import {Actions} from 'shared/actions'
import {Colors, GameSpeedMS, DefaultLevel} from 'shared/consts'

const colorKeys = Object.keys(Colors)

const getRandomColor = () => {
  // Generate a random key to get a random color
  const randomIndex = Math.floor(Math.random() * colorKeys.length)
  const colorKey = colorKeys[randomIndex]
  return Colors[colorKey]
}

const getPattern = (prevPattern, data) => {
  // If no data restarted
  if (!data) {
    return {colors: []}
  }

  const patternObj = {
    id: prevPattern.colors.length + 1,
    colors: prevPattern.colors.slice()
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
}

const aggregatePatterns = (patterns, pattern) => {
  // Game restarted
  if (!pattern.colors.length) {
    return [] 
  }

  patterns.push(pattern)

  return patterns
}

export const newPattern = 
  getPayload(Actions.PATTERN_ADDED, Actions.GAME_RESTARTED)
  .scan(getPattern, {colors: []})   
  .startWith({colors: []})
  .publishReplay(1)
  .refCount()

export const patterns = 
  newPattern
  .scan(aggregatePatterns, [])
  .startWith([])
  .publishReplay(1)
  .refCount()

export default Observable.combineLatestObj({newPattern, 
                                            patterns})