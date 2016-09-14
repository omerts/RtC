import {Observable} from '@reactivex/rxjs'
import adminStore from './adminStore'
import patternsStore from './patternsStore'
import userStore from './userStore'
import statsStore from './statsStore'
import routeStore from './routeStore'
import flowStore from './flowStore'

const getCountedState = (prevState, newState) => {
  return Object.assign(newState, {stateCount: ++prevState.stateCount})
}

export default Observable.combineLatest(adminStore,
                                        userStore,
                                        patternsStore,
                                        statsStore,
                                        routeStore,
                                        flowStore,
                                        (adminState,
                                         userState,
                                         patternsState,
                                         statsState,
                                         routeState,
                                         flowStore) => {
                                          return Object.assign({},
                                                               adminState,
                                                               userState,
                                                               patternsState,
                                                               statsState,
                                                               routeState,
                                                               flowStore)
                                        })
                                        .scan(getCountedState, {stateCount: 0})
                                        .publishReplay(1)
                                        .refCount()
