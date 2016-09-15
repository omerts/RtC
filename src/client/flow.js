import React from 'react';
import {render} from 'react-dom';
import {Observable} from '@reactivex/rxjs'
import appState from 'shared/stores'
import services from './services'
import {getAction} from 'shared/dispatcher'
import 'shared/consts'
import FlowDiagram from 'shared/components/FlowDiagram'

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

const initialState =  {
  serviceEmitted: false,
  actionEmitted: false,
  stateEmitted: false,
  appState: {},
  lastActions: []
}

const initialScanState = {
  data: intialState
}

const countEmissions = (count, value) => {
  return ++count
}

const takeLastX = (count) => {
  return (prev, current) => {
    // Minus one bcs of the push, and *-1 for taking from the end
    const cloneLast = prev.slice((count - 1) * -1)
    cloneLast.push(current)

    return cloneLast
  }
}

const buildDiffState = (prevData, currentData) => {
  const {data} = prevData

  const state = {
    serviceEmitted: data.serviceEmissions !== currentData.serviceEmissions,
    actionEmitted: data.actionEmissions !== currentData.actionEmissions,
    stateEmitted: data.stateEmissions !== currentData.stateEmissions,
    appState: currentData.appState,
    lastActions: currentData.lastActions
  }

  return {state, data: currentData }
}

const resetState = (state) => {
  return {
    serviceEmitted: false,
    actionEmitted: false,
    stateEmitted: false,
    appState: currentData.appState,
    lastActions: currentData.lastActions
  }
}

const animateEmissions = (state) => {
  return Observable.of(state)
          .concat(Observable.of(resetState(state)).delay(400))
}

const serviceEmissions =
  services
  .scan(countEmissions)

const stateEmissions = 
  appState
  .scan(countEmissions)

const actionEmissions =
  getAction()
  .scan(countActions)

const lastActions =
  getAction()
  .scan(takeLastX(50), [])
  .startWith([])

const state =
  Observables.combineLatestObj({serviceEmissions, 
                                stateEmission,
                                actionsEmissions,
                                lastActions,
                                appState})
  .debounce(16)
  .scan(buildDiffState, initialScanState)
  .pluck('state')
  .switchMap(animateEmissions)
  .startWith(initialState)

state.subscribe((state) => {
  render(<FlowDiagram {...state} />, container)
}, ::console.log, ::console.log)
