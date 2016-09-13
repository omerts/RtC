import {Observable} from '@reactivex/rxjs'
import {Actions, dispatch} from 'shared/actions'
import {newPattern} from '../stores/patternsStore'
import userStats, {userJoined, timedoutUsers} from '../stores/userStore'
import {GameIsInProgressErrorCode} from 'shared/consts'

const dispatchPattern =
  (pattern) => {
    // Intial pattern is empty and no reason to dispatch it
    if (pattern.colors.length) {
      dispatch(Actions.PATTERN_ACTIVATED, pattern)
    }
  }

const dispatchRegistered =
  (user) => {
    // -1 is initial value, so ignore it
    if (user.id !== -1) {
      if (user.id === GameIsInProgressErrorCode) {
        dispatch(Actions.USER_REGISTRATION_FAILED,
             Object.assign({}, user, {error: 'Game is in progress'}))
      } else {
        dispatch(Actions.USER_REGISTERED, user)
      }
    }
  }

const dispatchTimeouts =
  (users) => {
    users.forEach((user) => dispatch(Actions.USER_TIMEDOUT, user))
  }

const buildStats =
  ({registeredUsers, failedUsers, successfulUsers, timedoutUsers}) => {
    return {
      registeredUsersCount: registeredUsers.length,
      failedUsersCount: failedUsers.length,
      timedoutUsersCount: timedoutUsers.length,
      successfulUsers: successfulUsers
    }
  }

const dispatchStats =
  (stats) => {
    if (!stats.registeredUsersCount) {
      dispatch(Actions.GAME_STARTED)
    }

    dispatch(Actions.STATS_UPDATED, stats)
  }

export const pattern =
  newPattern
  .do(dispatchPattern)

export const user =
  userJoined
  .do(dispatchRegistered)

export const timedout =
  timedoutUsers
  .do(dispatchTimeouts)

export const stats =
  userStats
  .map(buildStats)
  .do(dispatchStats)

export default Observable.combineLatestObj({pattern, user, timedout, stats})