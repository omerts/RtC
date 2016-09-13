import {Observable} from '@reactivex/rxjs'
import getPayload from 'shared/dispatcher'
import {Actions, dispatch} from 'shared/actions'

export const route = 
  getPayload(Actions.ROUTE_CHANGED)
  .startWith({path: undefined, query: undefined})

export default Observable.combineLatestObj({route})
