import {Observable} from '@reactivex/rxjs'
import socketService from './socketService'
import browerHistoryService from './browserHistoryService'
import loggerService from './loggerService'

export default Observable.merge(socketService,
                                browerHistoryService,
                                loggerService)