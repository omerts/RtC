import {Observable} from '@reactivex/rxjs'
import getPayload from 'shared/dispatcher'
import {Actions, dispatch} from 'shared/actions'

export const gameStats = 
  getPayload(Actions.STATS_UPDATED)
  .startWith({
    registeredUsersCount: 0, 
    failedUsersCount: 0, 
    timedoutUsersCount: 0, 
    successfulUsers: []
  }) 
    
export default Observable.combineLatestObj({gameStats})