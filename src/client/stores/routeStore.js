import {Observable} from '@reactivex/rxjs'
import dispatcher from 'shared/dispatcher'
import {actions, send} from 'shared/actions'

export const route = dispatcher(actions.ROUTE_CHANGED)
                      .startWith({path: undefined, query: undefined})

export default Observable.combineLatestObj({route})
