import {Observable} from '@reactivex/rxjs'
import socketService from './socketService'
import browerHistoryService from './browserHistoryService'

export default Observable.merge(socketService,
                                        browerHistoryService)                                        