import React from 'react';
import RouterContext from 'react-router/lib/RouterContext';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import match from 'react-router/lib/match';
import render from '../htmlPage/render';
import stores from 'client/stores'
import App from 'client/components/App.react'

/**
 * An express middleware that is capabable of doing React server side rendering.
 */
function universalReactAppMiddleware(request, response) {
  if (process.env.DISABLE_SSR) {
    if (process.env.NODE_ENV === 'development') {
      console.log('==> 🐌  Handling react route without SSR');  // eslint-disable-line no-console
    }
    // SSR is disabled so we will just return an empty html page and will
    // rely on the client to populate the initial react application state.
    const html = render();
    response.status(200).send(html);
    return;
  }

  stores.first().subscribe((appState) => {
    // Override the route from the request
    appState.route.path = request.path
    appState.route.query = request.query

    const html = render({rootElement: <App {...appState} />, initialState: appState})
    response.status(200).send(html)
  }, ::console.log)
}

export default universalReactAppMiddleware;
