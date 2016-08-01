import { Observable } from '@reactivex/rxjs'
import { createHistory, useQueries } from 'history'
import {actions, send} from 'shared/actions'
import dispatcher from 'shared/dispatcher'

const history = useQueries(createHistory)()

const pushHistory = 
  dispatcher(actions.ROUTE_CHANGED)
    .do(route => {
      const currentLocation = history.getCurrentLocation()
      if (route.path !== currentLocation.pathname && 
          route.query !== currentLocation.query) {
        history.push({ pathname: route.path, query: route.query })
      }
    })

const notifyHistoryChange = 
  Observable.fromEventPattern(history.listen)
    .merge(Observable.of(history.getCurrentLocation())) // for initial load
    .do((location) => {        
      send(actions.ROUTE_CHANGED, {path: location.pathname, query: location.query})
    })

export default Observable.merge(pushHistory, notifyHistoryChange)
