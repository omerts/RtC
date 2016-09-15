import React from 'react'
import {Panel, ListGroup, ListGroupItem, Glyphicon, Badge} from 'react-bootstrap'

import './FlowDiagram.scss'

const getStyle = (isActive) => {
  if (isActive) {
    return {color: 'purple'}
  }

  return {}
}

const getActions = (actions) => {
  return actions
         .map((action, i) => {
            // Index is not good for key, but I guess its fine here
            return <ListGroupItem key={i} header={action.type}>
                    {JSON.stringify(action.payload)}
                   </ListGroupItem>
         })
}

const getBox = (name) => {
  return (
    <div className={`box box-${name.split(' ')[0]}`}>
      <h4>{name}</h4>      
    </div>)
}

const getArrow = (arrow, isActive) => {
  return <div className='arrow' style={getStyle(isActive)}>
    {arrow}
  </div>
}

const getActionsPanel = (actions) => {
  return <Panel className='actions' header='Actions' bsStyle='info'>
     <ListGroup>
      {getActions(actions)}
     </ListGroup>
  </Panel>
}

const getState = (appState) => {
  return <Panel header='State' bsStyle='danger'>
    <div>
      <pre>{JSON.stringify(appState, null, 4)}</pre>
    </div>
  </Panel>
}

const FlowDiagram = (props) => {
  const {serviceEmitted,
         actionEmitted,
         stateEmitted,
         appState,
         lastActions} = props

  return <div className='flow-wrapper'>
    <div className='boxes'>
      {getBox('Services & Users')}
      {getArrow('→', serviceEmitted)}
      {getBox('Dispatcher')}
      {getArrow('→', actionEmitted)}
      {getBox('Stores')}
      {getArrow('→', stateEmitted)}      
      {getBox('View')}
      {getArrow('↻', false)}
    </div>
    <div className='data'>
      <div className='left'>
        {getActionsPanel(lastActions)}
      </div>
      <div className='right'>
        {getState(appState)}      
      </div>
    </div>
  </div>
}

export default FlowDiagram
