import React from 'react';
import { render } from 'react-dom';
import App from './components/App.react'
import stores from './stores'
import services from './services'
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
  render(
    <App {...appState} />,
    container
  )
}, ::console.log, ::console.log)
