import {Observable} from '@reactivex/rxjs'
import socketService from './socketService'
import stateToActionMappingService from './stateToActionMappingService'

export default Observable.combineLatest(socketService,
                                        stateToActionMappingService,
                                        (socketService,
                                         stateToActionMappingService) => {
                                          return Object.assign({}, 
                                                               socketService, 
                                                               stateToActionMappingService)
                                        })