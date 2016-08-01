import React from 'react'
import {ProgressBar, Badge, Table, Glyphicon} from 'react-bootstrap'

// We get the ranking out of the box, because of the order the user_succeeded event arrived
function _buildUserColumns(users) {  
  return users.map((user, i) => {
    return <tr key={user.id}>
              <td>{i + 1}</td>
              <td>{user.name}</td>
              <td>{user.nickname}</td>
            </tr>
  })
}

const GameStats = ({registeredUsersCount, failedUsersCount, timedoutUsersCount, successfulUsers}) => {
  // Add or 100 to progress bar cause 0/0 leaves it full
  return <div>
          <p>Overall Users: <Badge>{registeredUsersCount}</Badge></p>
          <div>
            <h4>Successful Users: <Badge>{successfulUsers.length}</Badge></h4>
            <ProgressBar active 
                         bsStyle="success"
                         now={successfulUsers.length} 
                         max={registeredUsersCount || 100} />
          </div>
          <div>
            <h4>Failed Users: <Badge>{failedUsersCount}</Badge></h4>
            <ProgressBar active 
                         bsStyle="danger"
                         now={failedUsersCount} 
                         max={registeredUsersCount || 100} />
          </div>
          <div>
            <h4>Timedout Users: <Badge>{timedoutUsersCount}</Badge></h4>
            <ProgressBar active 
                         bsStyle="warning"
                         now={timedoutUsersCount} 
                         max={registeredUsersCount || 100} />
          </div>
          {successfulUsers.length === 1 && 
           successfulUsers.length + failedUsersCount + timedoutUsersCount === registeredUsersCount &&
           <h1><Glyphicon glyph="gift" /> We have a winner!</h1>}
          <h2>Hall of Fame:</h2>
          <Table striped bordered condensed hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Nick</th>                
              </tr>
            </thead>
            <tbody>
              {_buildUserColumns(successfulUsers)}
            </tbody>
          </Table>
         </div>
}

export default GameStats
