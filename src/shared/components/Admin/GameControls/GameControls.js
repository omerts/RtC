import React from 'react'
import {Button} from 'react-bootstrap'

import './GameControls.scss'

export default class GameControls extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLevelActive: false
    }
  }

  _onRestart = () => {
    this.setState({isLevelActive: false})

    this.props.onRestart()
  }

  _toggleLevel = () => {
    this.setState({isLevelActive: !this.state.isLevelActive})

    if (!this.state.isLevelActive) {
      this.props.onNextLevel()
    } else {
      this.props.onLevelEnded()
    }   
  }

  render() {
    return <div className='controls-container'>
              <Button bsStyle='primary'
                      onTouchTap={this._onRestart}>Restart Game</Button>
              {!this.state.isLevelActive && <Button bsStyle='info' 
                                                    onTouchTap={this._toggleLevel}>
                                                    Next Level
                                            </Button>}
              {this.state.isLevelActive && <Button bsStyle='warning' 
                                                   onTouchTap={this._toggleLevel}>
                                              End Level
                                            </Button>}
           </div>
  }
}