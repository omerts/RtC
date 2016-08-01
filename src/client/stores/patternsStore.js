import {Observable} from '@reactivex/rxjs'
import dispatcher from 'shared/dispatcher'
import {actions, send} from 'shared/actions'
import {Colors, GameSpeedMS} from 'shared/consts'

export const newPattern = 
  dispatcher(actions.PATTERN_ACTIVATED)

export const currentColor = 
  newPattern
    .switchMap(({colors}) => {
      // Add null to end to recognize end of pattern, replace the transparent last cell
      const clone = colors.slice()
      clone[clone.length - 1] = null

      return Observable
                .from(clone)                                          
    })
    .map((color) => {
      return Observable.of(color).delay(GameSpeedMS)
    })     
    .concatAll()        
    .startWith(null)

export const currentPattern =
  dispatcher(actions.COLOR_TAPPED, actions.GAME_RESTARTED, actions.PATTERN_ACTIVATED)
  .scan((colors, data) => {
    // new pattern / restart
    if (!data || !data.color) {
      return []
    }

    colors.push(data.color)

    return colors
  }, [])
  .startWith([])

export const onColorTapped = 
  newPattern
    .withLatestFrom(dispatcher(actions.USER_REGISTERED), (pattern, user) => {
      return {
        pattern,
        user
      }
    })
    .map(({pattern, user}) => {
      let tapIndex = 0
      
      return (color) => {
        send(actions.COLOR_TAPPED, {userId: user.id, color})

        const {colors} = pattern

        // Check if pattern is right
        if (tapIndex < colors.length &&
            colors[tapIndex] === Colors[color]) {
          // Add 1 to tapIndex bcs of transparent color, 
          // decrease 1 from length bcs index starts from 0
          if ((tapIndex + 1) === (colors.length - 1)) {
            // Todo better secuirty with enteredPattern
            send(actions.USER_SUCCEEDED, {userId: user.id, patternId: pattern.id, enteredPattern: colors})
          }
        } else {
          send(actions.USER_FAILED, {userId: user.id, patternId: pattern.id})
        }

        // Add two for the transparent slides
        tapIndex += 2
      }
    })
    // Reset the handler for new games, so user doesn't get failed if mistakenly clicked
    // before level started
    .merge(dispatcher(actions.GAME_STARTED)
           .mapTo(() => {}))
    .startWith(() => {})

export default Observable.combineLatestObj({currentColor,
                                            currentPattern,
                                            onColorTapped})