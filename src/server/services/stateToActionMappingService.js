import {Observable} from '@reactivex/rxjs'
import {actionDispatcher} from 'shared/dispatcher'
import {actions, send} from 'shared/actions'
import {newPattern} from '../stores/patternsStore'
import userStats, {userJoined, timedoutUsers} from '../stores/userStore'
import {GameIsInProgressErrorCode} from 'shared/consts'

export const pattern = 
  newPattern
  .do((pattern) => {    
    // Intial pattern is empty and no reason to send it
    if (pattern.colors.length) {
      send(actions.PATTERN_ACTIVATED, pattern)
    }
  })

export const user = 
  userJoined
  .do((user) => {
    // -1 is initial value, so ignore it
    if (user.id !== -1) {
      if (user.id === GameIsInProgressErrorCode) {
        send(actions.USER_REGISTRATION_FAILED, 
             Object.assign({}, user, {error: 'Game is in progress'}))
      } else {
        send(actions.USER_REGISTERED, user)
      }
    }
  })

export const timedout = 
  timedoutUsers
    .do((users) => {
      users.forEach((user) => send(actions.USER_TIMEDOUT, user))
    })

export const stats =
  userStats
  .map(({registeredUsers, failedUsers, successfulUsers, timedoutUsers}) => {
    return {
      registeredUsersCount: registeredUsers.length, 
      failedUsersCount: failedUsers.length, 
      timedoutUsersCount: timedoutUsers.length, 
      successfulUsers: successfulUsers
    }
  })
  .do((stats) => {
    if (!stats.registeredUsersCount) {
      send(actions.GAME_STARTED)
    }

    send(actions.STATS_UPDATED, stats)
  })

export default Observable.combineLatestObj({pattern, user, timedout, stats})