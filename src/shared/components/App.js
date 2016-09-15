import React from 'react'
import {UserStatus} from 'shared/consts'
import ColorShower from 'shared/components/ColorShower'
import Register from 'shared/components/Register'
import ColorPad from 'shared/components/ColorPad'
import StatusBar from 'shared/components/StatusBar'
import Admin from 'shared/components/Admin'
import FlowDiagram from 'shared/components/FlowDiagram'

import './App.scss'

function getClientView(props) {
  if (props.userStatus === UserStatus.NA ||
      props.userStatus === UserStatus.CANTJOIN) {
    return <div className='register-container'>
            <Register onUserJoined={props.userJoined} />
            {props.userStatus === UserStatus.CANTJOIN && <p>Game is in progress, please try again later.</p>}
          </div>
  }

  return <span >
            <ColorShower color={props.currentColor} />
            <StatusBar userStatus={props.userStatus} />
            <ColorPad isActive={props.userStatus === UserStatus.IDEAL  &&
                                !props.currentColor}
                      tappedColors={props.currentPattern}
                      onColorTapped={props.onColorTapped} />
          </span>
}

function getAdminView(props) {
  return (<span>
            {props.currentColor && <ColorShower color={props.currentColor} />}
            <Admin {...props} />
          </span>)
}

function getFlowView(props) {
  return <FlowDiagram {...props} />
}

const App = (props) => {
  return <div className='app-container'>
            {props.route.path === '/' && getClientView(props)}
            {props.route.path === '/mmm' && getAdminView(props)}
         </div>
}

export default App