import {Observable} from '@reactivex/rxjs'
import dispatcher from 'shared/dispatcher'
import {actions} from 'shared/actions'
import {GameIsInProgressErrorCode} from 'shared/consts'

function _validatePattern(successData, pattern) {
  const {enteredPattern} = successData
  const {colors} = pattern
  
  return colors.length == enteredPattern.length &&
         colors.every((color, i) => {
          return color === enteredPattern[i]
         })
}

const activePattern = 
  // PATTERN_TIMEDOUD === level ended
  dispatcher(actions.PATTERN_ACTIVATED,              
             actions.GAME_RESTARTED)
  .startWith(null)
  .publishReplay(1)
  .refCount()

export const userJoined = 
  dispatcher(actions.USER_JOINED)
    .withLatestFrom(activePattern, (userData, pattern) => {
      return {
        userData,
        pattern
      }
    })
    .scan((lastUser, {userData, pattern}) => {   
      // Game is active can't join
      if (pattern) {
        return {id: GameIsInProgressErrorCode, ...userData}
      }             

      const user = {
        id: lastUser.id + 1,
        ...userData
      }

      return user
    }, {id: -1})
    .publishReplay(1)
    .refCount()                     

export const registeredUsers = 
  dispatcher(actions.GAME_RESTARTED)
    .merge(userJoined.filter(({id}) => id !== GameIsInProgressErrorCode))
    .scan((users, user) => {
      // if no data than restarted
      if (!user) {
        return []
      }

      users.push(user)
      
      return users;
    }, [])
    .startWith([])
    .publishReplay(1)
    .refCount()

export const failedUsers = 
  dispatcher(actions.USER_FAILED, 
             actions.GAME_RESTARTED)
    .scan((users, user) => {                                        
      if (!user) {
        // Game restarted
        return []                                 
      }
                                    
      users.push(user)
      return users
    }, [])
    .withLatestFrom(registeredUsers, (sUsers, rUsers) => {      
      // Map to a list of successful users (from userId)
      return sUsers.map(({userId}) => { 
        // Some weird bug with max call stack size (bcs of the behind the scenes socket)
        // so do it this way
        const {id, name, nickname} = rUsers.find(user => user.id === userId)
        return {id, name, nickname}
      })
    })
    .startWith([])
    .publishReplay(1)
    .refCount()

export const successfulUsers = 
  dispatcher(actions.USER_SUCCEEDED)    
    .combineLatest(activePattern, (successData, pattern) => {
      return {
        successData,
        pattern
      }
    })
    // filter old actions, or invalid ones
    .filter(({successData, pattern}) => {
      if (!pattern) {
        // Game restarted
        return true
      }

      return _validatePattern(successData, pattern)
    })
    // Reset the list once a new level started
    .merge(dispatcher(actions.PATTERN_ACTIVATED).mapTo({pattern: null}))
    .scan((users, {successData, pattern}) => {  
      if (!pattern) {
        // Game restarted / new level started
        return []
      }

      users.push(successData)
      
      return users
    }, [])
    .withLatestFrom(registeredUsers, (sUsers, rUsers) => {      
      // Map to a list of successful users (from userId)
      return sUsers.map(({userId}) => { 
        // Some weird bug with max call stack size (bcs of the behind the scenes socket)
        // so do it this way
        const {id, name, nickname} = rUsers.find(user => user.id === userId)
        return {id, name, nickname}
      })
    })
    .startWith([])
    .publishReplay(1)
    .refCount()

const _activeUsers = 
  registeredUsers
    .combineLatest(failedUsers, 
                   successfulUsers, 
                   (registeredUsers, failedUsers, successfulUsers) => {
                      return {
                        activeUsers: failedUsers.concat(successfulUsers),
                        registeredUsers
                      }
                    })

export const timedoutUsers = 
  dispatcher(actions.PATTERN_TIMEDOUT, actions.GAME_RESTARTED)
    .withLatestFrom(_activeUsers, (data, activeUsers) => {
      // data is always null
      return activeUsers
    })
    .map((users) => {      
      const {registeredUsers, activeUsers} = users    
      return registeredUsers.filter((user) => 
              !activeUsers.some((innerUser) => innerUser.id == user.id))
    })
    .startWith([])
    .publishReplay(1)
    .refCount()

// Every change in one obs causes an emission, so debounce
export default Observable.combineLatestObj({registeredUsers, failedUsers, successfulUsers, timedoutUsers})
                .debounceTime(50)
