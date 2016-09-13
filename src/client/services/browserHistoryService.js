import { Observable } from '@reactivex/rxjs'
import { createHistory, useQueries } from 'history'
import {Actions, dispatch} from 'shared/actions'
import getPayload from 'shared/dispatcher'

const history = useQueries(createHistory)()

const pushToHistory =
  (route) => {
    const currentLocation = history.getCurrentLocation()
    if (route.path !== currentLocation.pathname &&
        route.query !== currentLocation.query) {
      history.push({ pathname: route.path, query: route.query })
    }
  }

const dispatchRoute =
  (location) => {
    dispatch(Actions.ROUTE_CHANGED, {path: location.pathname, query: location.query})
  }

const pushHistory =
  getPayload(Actions.ROUTE_CHANGED)
    .do(pushToHistory)

const notifyHistoryChange =
  Observable.fromEventPattern(history.listen)
    .merge(Observable.of(history.getCurrentLocation())) // for initial load
    .do(dispatchRoute)

export default Observable.merge(pushHistory, notifyHistoryChange)
