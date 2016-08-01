import React from 'react'

import './Register.scss'

export default class Register extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isValid: true
    }
  }
  _onUserJoin = () => {
    const name = this.refs.name.value
    const nickname = this.refs.nickname.value

    if (name.length > 2 && nickname.length > 2) {
      this.props.onUserJoined({name, nickname})
    } else {
      this.setState({isValid: false})
    }
  }

  render() {
    return <div className='login-dialog'>
              <input placeholder='Name' type='text' ref='name' name='name' />
               <div className='input-tip'> *(at least 3 chars) </div>
              <input type='text' placeholder='Nickname' ref='nickname' name='nickname' />
              <div className='input-tip'>*(at least 3 chars)</div>
            <button className='button' onTouchTap={this._onUserJoin}>Join</button>
            {!this.state.isValid && <p style={{color: 'red'}}>*Please make sure fields are valid</p>}
           </div>
  }
}
