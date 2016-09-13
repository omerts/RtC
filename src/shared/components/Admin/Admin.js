import React from 'react'
import GameControls from './GameControls'
import GameStats from './GameStats'

const Admin = (props) => {
  return <div>
          <GameControls onRestart={props.restartGame}
                        onNextLevel={props.generateNewPattern}
                        onLevelEnded={props.timeoutPattern} />
          <GameStats {...props.gameStats} />
         </div>
}

export default Admin