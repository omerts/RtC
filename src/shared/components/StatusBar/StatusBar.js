import React from 'react'
import {UserStatus} from 'shared/consts'
import {Glyphicon} from 'react-bootstrap'

function getStatusElement(userStatus) {
  switch (userStatus) {
    case (UserStatus.SUCCESS): {
      return <div style={{color: 'green'}}>
               <Glyphicon glyph="ok" /> Success!
             </div>
    }
    case (UserStatus.FAILED): {
      return <div style={{color: 'red'}}>
               <Glyphicon glyph="remove" /> Failed!
             </div>
    }
    case (UserStatus.TIMEDOUT): {
      return <div style={{color: 'red'}}>
               <Glyphicon glyph="hourglass" /> Too late!
             </div>
    }
    default: {
      return null
    }
  }
}

const StatusBar = ({userStatus}) => {
  return getStatusElement(userStatus)
}

export default StatusBar
