import {Observable} from '@reactivex/rxjs'
import getPayload from 'shared/dispatcher'
import {Actions, dispatch} from 'shared/actions'
import {UserStatus, GameIsInProgressError} from 'shared/consts'

const getStatusForPattern = (prevStatus) => {
  // If was successfull remove last status
  // if failed/timedout let him keep on seeing it
  // so he doesn't get an empty screen
  if (prevStatus === UserStatus.SUCCESS) {
    return UserStatus.IDEAL
  } else {
    return prevStatus
  }
}

const na = 
  getPayload(Actions.GAME_STARTED)
  .mapTo(UserStatus.NA)

const ideal =
  getPayload(Actions.USER_REGISTERED)
  .mapTo(UserStatus.IDEAL)  

const cantJoin = 
  getPayload(Actions.USER_REGISTRATION_FAILED)
  .mapTo(UserStatus.CANTJOIN)

const success = 
  getPayload(Actions.USER_SUCCEEDED)
  .mapTo(UserStatus.SUCCESS)

const failed = 
  getPayload(Actions.USER_FAILED)
  .mapTo(UserStatus.FAILED)

const timedout = 
  getPayload(Actions.USER_TIMEDOUT)
  .mapTo(UserStatus.TIMEDOUT)

const status = 
  Observable.merge(na, 
                  ideal, 
                  cantJoin, 
                  success, 
                  failed, 
                  timedout)
  .startWith(UserStatus.NA) 

const patternActivated =
  getPayload(Actions.PATTERN_ACTIVATED)
  .withLatestFrom(status, (pattern, prevStatus) => {
    return prevStatus
  })
  .map(getStatusForPattern)

export const userStatus = 
  Observable.merge(status, patternActivated)

export const userJoined = 
  Observable.of((userData) => {
    dispatch(Actions.USER_JOINED, userData)
  })

export default Observable.combineLatestObj({userJoined, userStatus})


