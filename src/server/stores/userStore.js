import {Observable} from '@reactivex/rxjs'
import getPayload from 'shared/dispatcher'
import {Actions} from 'shared/actions'
import {GameIsInProgressErrorCode} from 'shared/consts'
import createMapToObjFunc from 'shared/utils/createMapToObjFunc'

const validatePattern = ({successData, pattern}) => {
  if (!pattern) {
    // Game restarted
    return true
  }

  const {enteredPattern} = successData
  const {colors} = pattern

  return colors.length == enteredPattern.length &&
         colors.every((color, i) => {
          return color === enteredPattern[i]
         })
}

const addUser = (lastUser, {userData, pattern}) => {
  // Game is active can't join
  if (pattern) {
    return {id: GameIsInProgressErrorCode, ...userData}
  }

  const user = {
    id: lastUser.id + 1,
    ...userData
  }

  return user
}

const aggregateUsers = (users, user) => {
  // if no data than restarted
  if (!user) {
    return []
  }

  const clone = users.slice()

  clone.push(user)

  return clone
}

// When we have failures, or success we only
// get the userId, so search for the full user data
const getUsers = (findUsers, allUsers) => {
  // Map to a list of successful/failed users (from userId)
  return findUsers.map(({userId}) => {
    // Some weird bug with max call stack size (bcs of the behind the scenes socket)
    // so do it this way
    const {id, name, nickname} = allUsers.find(user => user.id === userId)
    return {id, name, nickname}
  })
}

const getJustActiveUsers =
  (data, activeUsers) => {
    // data is always null
    return activeUsers
  }

const mapActiveUsers =
  (registeredUsers, failedUsers, successfulUsers) => {
    return {
      activeUsers: failedUsers.concat(successfulUsers),
      registeredUsers
    }
  }

const getTimedoutUsers = (users) => {
  const {registeredUsers, activeUsers} = users
  return registeredUsers.filter((user) =>
          !activeUsers.some((innerUser) => innerUser.id == user.id))
}

const activePattern =
  // PATTERN_TIMEDOUD === level ended
  getPayload(Actions.PATTERN_ACTIVATED,
             Actions.GAME_RESTARTED)
  .startWith(null)
  .publishReplay(1)
  .refCount()

const newLevel =
  getPayload(Actions.PATTERN_ACTIVATED)
  .mapTo(null)

export const userJoined =
  getPayload(Actions.USER_JOINED)
  .withLatestFrom(activePattern, createMapToObjFunc('userData', 'pattern'))
  .scan(addUser, {id: -1})
  .publishReplay(1)
  .refCount()

export const registeredUsers =
  getPayload(Actions.GAME_RESTARTED)
  .merge(userJoined.filter(({id}) => id !== GameIsInProgressErrorCode))
  .scan(aggregateUsers, [])
  .startWith([])
  .publishReplay(1)
  .refCount()

export const failedUsers =
  getPayload(Actions.USER_FAILED,
             Actions.GAME_RESTARTED)
  .scan(aggregateUsers, [])
  .withLatestFrom(registeredUsers, getUsers)
  .startWith([])
  .publishReplay(1)
  .refCount()

export const successfulUsers =
  getPayload(Actions.USER_SUCCEEDED)
  .combineLatest(activePattern,
                 createMapToObjFunc('successData', 'pattern'))
  // filter old actions, or invalid ones
  .filter(validatePattern)
  .pluck('successData')
  // Reset the list once a new level started
  .merge(newLevel)
  .scan(aggregateUsers, [])
  .withLatestFrom(registeredUsers, getUsers)
  .startWith([])
  .publishReplay(1)
  .refCount()

const activeUsers =
  registeredUsers
    .combineLatest(failedUsers,
                   successfulUsers,
                   mapActiveUsers)

export const timedoutUsers =
  getPayload(Actions.PATTERN_TIMEDOUT, Actions.GAME_RESTARTED)
  .withLatestFrom(activeUsers, getJustActiveUsers)
  .map(getTimedoutUsers)
  .startWith([])
  .publishReplay(1)
  .refCount()

// Every change in one obs causes an emission, so debounce
export default Observable.combineLatestObj({registeredUsers,
                                            failedUsers,
                                            successfulUsers,
                                            timedoutUsers})
               .debounceTime(50)
