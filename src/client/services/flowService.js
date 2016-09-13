import {getAction} from 'shared/dispatcher'
import {FlowLastActionsCount} from 'shared/consts'
import state from '../stores'

const getCountedState = (countedState, state) => {
  return {state, count: ++countedState.count}
}

const lastActions =
  getAction()
  .takeLast(FlowLastActionsCount)

const lastState =
  state
  .startWith(undefined)
  .scan(getCountedState, {count: 0})

export default Observable.combineLatestObj({lastActions, lastState})