import React from 'react';
import { render } from 'react-dom';
import {Observable} from '@reactivex/rxjs'
import appState from 'shared/stores'
import App from 'shared/components/App'
import stores from 'shared/stores'
import {getAction} from 'shared/dispatcher'
import {Actions} from 'shared/actions'
import services from './services'
import 'shared/consts'
import FlowDiagram from 'shared/components/FlowDiagram'
import injectTapEventPlugin from 'react-tap-event-plugin'

injectTapEventPlugin();

// Get the DOM Element that will host our React application.
const container = document.querySelector('#app');

// The following is needed so that we can hot reload our App.
if (process.env.NODE_ENV === 'development' && module.hot) {
  // Accept changes to this file for hot reloading.
  module.hot.accept('./index.js');
}

services.subscribe(() =>{}, ::console.log, ::console.log)

stores.subscribe((appState) => {
  if (appState.route.path !== '/flow') {
    render(
      <App {...appState} />,
      container
    )
  }
}, ::console.log, ::console.log)

const initialState =  {
  serviceEmitted: false,
  actionEmitted: false,
  stateEmitted: false,
  appState: {},
  lastActions: []
}

const initialScanState = {
  data: initialState
}

const countEmissions = (count, value) => {
  return ++count
}

const takeLastX = (count) => {
  return (prev, current) => {
    // We add new element to the top
    const cloneLast = prev.slice(0, count)
    cloneLast.unshift(current)

    return cloneLast
  }
}

const buildDiffState = (prevData, currentData) => {
  const {data} = prevData

  const state = {
    serviceEmitted: true, //data.serviceEmissions !== currentData.serviceEmissions,
    actionEmitted: true, //data.actionEmissions !== currentData.actionEmissions,
    stateEmitted: true, //data.stateEmissions !== currentData.stateEmissions,
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
    appState: state.appState,
    lastActions: state.lastActions
  }
}

const animateEmissions = (state) => {
  return Observable.of(state)
          .concat(Observable.of(resetState(state)).delay(400))
}

const serviceEmissions =
  getAction()
  .scan(countEmissions, 0)

const stateEmissions = 
  appState
  .scan(countEmissions, 0)

const actionEmissions =
  getAction()
  .scan(countEmissions, 0)

const lastActions =
  getAction()
  .scan(takeLastX(50), [])
  .startWith([])

const state =
  Observable.combineLatestObj({serviceEmissions, 
                               stateEmissions,
                               actionEmissions,
                               lastActions,
                               appState})
  .scan(buildDiffState, initialScanState)
  .pluck('state')
  .switchMap(animateEmissions)
  .debounceTime(100)
  .startWith(initialState)

state.subscribe((state) => {
  if (state.appState.route && state.appState.route.path === '/flow') {
    render(<FlowDiagram {...state} />, container)
  }
}, ::console.log, ::console.log)
