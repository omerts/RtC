import React from 'react'
import {Panel, ListGroup, ListGroupItem, Glyphicon, Badge} from 'react-bootstrap'

import './FlowDiagram.scss'

const getActions = (actions) => {
  return actions
         .map((action, i) => {
            // Index is not good for key, but I guess its fine here
            return <ListGroupItem key={i} header={action.type}>
                    {JSON.stringify(action.payload)}
                   </ListGroupItem>
         })
}

const getDispatcher = (actions) => {
  return <Panel header='Dispatcher' className='dispatcher' bsStyle='success'>
      <ListGroup>
        {getActions(actions)}
      </ListGroup>
  </Panel>
}

const getStores = () => {
  return <Panel className='stores' header='Stores' bsStyle='info'>
      <Glyphicon glyph='tasks' />
  </Panel>
}

const getRenders = (props) => {
  return <Panel className='react' header='React' bsStyle='danger'>
      <div className='left'>
        <p>State updates: <Badge>{props.stateCount}</Badge></p>
        <img src='https://upload.wikimedia.org/wikipedia/commons/5/57/React.js_logo.svg' alt='react' />
      </div>
      <div className='right'>
        <pre>{JSON.stringify(props, null, 4)}</pre>
      </div>
  </Panel>
}

const getServices = () => {
  return <Panel className='services' header='Services' bsStyle='warning'>
    <Glyphicon glyph='cog' />
  </Panel>
}

const FlowDiagram = (props) => {
  const {lastActions} = props

  return <div className='flow-wrapper'>
    {getDispatcher(lastActions)}
    <div className='arrow'>&#11015;Actions</div>
    {getStores()}
    <div className='arrow'>&#11015;State</div>
    {getRenders(props)}
    <div className='arrow'>&#11015;Actions</div>
    {getServices()}
    <div className='arrow'>&#8635;Actions</div>
  </div>
}

export default FlowDiagram
