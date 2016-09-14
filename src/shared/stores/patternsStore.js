import {Observable} from '@reactivex/rxjs'
import getPayload from 'shared/dispatcher'
import {Actions, dispatch} from 'shared/actions'
import {Colors, GameSpeedMS} from 'shared/consts'
import createMapToObjFunc from 'shared/utils/createMapToObjFunc'

const getColors = ({colors}) => {
  // Add null to end to recognize end of pattern,
  // replace the transparent last cell
  const clone = colors.slice()
  clone[clone.length - 1] = null

  return Observable
            .from(clone)
}

const delayValue = (color) => {
  return Observable.of(color).delay(GameSpeedMS)
}

const aggregatePattern = (colors, data) => {
  // new pattern / restart
  if (!data || !data.color) {
    return []
  }

  const clone = colors.slice()

  clone.push(data.color)

  return clone
}

const createColorTappedHandler = ({pattern, user}) => {
  let tapIndex = 0

  return (color) => {
    dispatch(Actions.COLOR_TAPPED, {userId: user.id, color})

    const {colors} = pattern

    // Check if pattern is right
    if (tapIndex < colors.length &&
        colors[tapIndex] === Colors[color]) {
      // Add 1 to tapIndex bcs of transparent color,
      // decrease 1 from length bcs index starts from 0
      if ((tapIndex + 1) === (colors.length - 1)) {
        // Todo better secuirty with enteredPattern
        dispatch(Actions.USER_SUCCEEDED, {userId: user.id, patternId: pattern.id, enteredPattern: colors})
      }
    } else {
      dispatch(Actions.USER_FAILED, {userId: user.id, patternId: pattern.id})
    }

    // Add two for the transparent slides
    tapIndex += 2
  }
}

const gameRestarted =
  getPayload(Actions.GAME_STARTED)
  .mapTo(() => {})

export const newPattern =
  getPayload(Actions.PATTERN_ACTIVATED)

export const currentColor =
  newPattern
  .switchMap(getColors)
  .map(delayValue)
  .concatAll()
  .startWith(null)

export const currentPattern =
  getPayload(Actions.COLOR_TAPPED,
             Actions.GAME_STARTED,
             Actions.PATTERN_ACTIVATED)
  .scan(aggregatePattern, [])
  .startWith([])

export const onColorTapped =
  newPattern
  .withLatestFrom(getPayload(Actions.USER_REGISTERED),
                  createMapToObjFunc('pattern', 'user'))
  .map(createColorTappedHandler)
  // Reset the handler for new games, so user doesn't get failed if mistakenly clicked
  // before level started
  .merge(gameRestarted)
  .startWith(() => {})

export default Observable.combineLatestObj({currentColor,
                                            currentPattern,
                                            onColorTapped})