import {Observable} from '@reactivex/rxjs'
import dispatcher, {actionDispatcher} from 'shared/dispatcher'
import {actions, send} from 'shared/actions'
import {UserStatus, GameIsInProgressError} from 'shared/consts'

export const userJoined = Observable.of((userData) => {
                            send(actions.USER_JOINED, userData)
                          })

export const userStatus = actionDispatcher(actions.USER_REGISTERED,
                                           actions.USER_REGISTRATION_FAILED,
                                           actions.PATTERN_ACTIVATED,
                                           actions.GAME_STARTED,
                                           actions.USER_SUCCEEDED, 
                                           actions.USER_FAILED,
                                           actions.USER_TIMEDOUT)
                          .scan((prevStatus, action) => {
                            switch (action.type) {
                              case actions.GAME_STARTED: {
                                return UserStatus.NA
                              }                              
                              case actions.USER_REGISTERED: {
                                return UserStatus.IDEAL
                              }
                              case actions.USER_REGISTRATION_FAILED: {
                                return UserStatus.CANTJOIN
                              }
                              case actions.USER_SUCCEEDED: {
                                return UserStatus.SUCCESS
                              }
                              case actions.USER_FAILED: {
                                return UserStatus.FAILED
                              }         
                              case actions.USER_TIMEDOUT: {
                                return UserStatus.TIMEDOUT
                              }
                              case actions.PATTERN_ACTIVATED: {
                                // If was successfull remove last status
                                // if failed/timedout let him keep on seeing it
                                // so he doesn't get an empty screen
                                if (prevStatus === UserStatus.SUCCESS) {
                                  return UserStatus.IDEAL
                                } else {
                                  return prevStatus
                                }
                              }
                            }
                          }, null)
                          .startWith(UserStatus.NA) 

export const isUserStillInTheGame = 
  dispatcher(actions.USER_FAILED, actions.USER_TIMEDOUT)
   .mapTo(false)
   .merge(dispatcher(actions.GAME_STARTED).mapTo(true))                               
   .startWith(true)

export default Observable.combineLatestObj({userJoined, userStatus, isUserStillInTheGame})


