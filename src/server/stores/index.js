import {Observable} from '@reactivex/rxjs'

import patternsStore from './patternsStore'
import userStore from './userStore'

export default Observable.combineLatest(patternsStore, 
                                        userStore,                                         
                                        (patternsStore, 
                                         userStore) => {
                                          return Object.assign({},  
                                                               userStore,
                                                               patternsStore)
                                        })
