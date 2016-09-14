import {Observable} from '@reactivex/rxjs'
import {getAction} from 'shared/dispatcher'
import {FlowLastActionsCount} from 'shared/consts'
import state from '../stores'

const takeLastX = (count) => {
  return (prev, current) => {
    // Minus one bcs of the push, and *-1 for taking from the end
    const cloneLast = prev.slice((count - 1) * -1)
    cloneLast.push(current)

    return cloneLast
  }
}

const lastActions =
  getAction()
  .scan(takeLastX(3), [])
  .startWith([])

export default Observable.combineLatestObj({lastActions})