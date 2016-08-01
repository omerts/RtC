import {Observable} from '@reactivex/rxjs'
import adminStore from './adminStore'
import patternsStore from './patternsStore'
import userStore from './userStore'
import statsStore from './statsStore'
import routeStore from './routeStore'

export default Observable.combineLatest(adminStore, 
                                        userStore,
                                        patternsStore,                                         
                                        statsStore,
                                        routeStore, 
                                        (adminState, 
                                         userState, 
                                         patternsState, 
                                         statsState,
                                         routeState) => {
                                          return Object.assign({}, 
                                                               adminState,
                                                               userState,
                                                               patternsState,
                                                               statsState,
                                                               routeState)
                                        })
