import {Observable} from '@reactivex/rxjs'
import dispatcher from 'shared/dispatcher'
import {actions, send} from 'shared/actions'

export const gameStats = 
  dispatcher(actions.STATS_UPDATED)
    .startWith({
      registeredUsersCount: 0, 
      failedUsersCount: 0, 
      timedoutUsersCount: 0, 
      successfulUsers: []
    }) 
    
export default Observable.combineLatestObj({gameStats})