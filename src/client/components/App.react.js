import React from 'react'
import {UserStatus} from 'shared/consts'
import ColorShower from 'shared/components/ColorShower'
import Register from './Register'
import ColorPad from './ColorPad'
import StatusBar from './StatusBar'
import Admin from './Admin'

import './App.scss'

function _getClientView(props) {
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

function _getAdminView(props) {
  return (<span>
            {props.currentColor && <ColorShower color={props.currentColor} />}
            <Admin {...props} />
          </span>)
}

const App = (props) => {   
  return <div className='app-container'>
            {props.route.path !== '/admin-gil' && _getClientView(props)}
            {props.route.path === '/admin-gil' && _getAdminView(props)}
         </div>
}

export default App