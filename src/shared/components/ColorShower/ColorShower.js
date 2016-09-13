import React from 'react'

import './ColorShower.scss'

const ColorShower = ({color}) => {
  return <div className='color-shower' style={{backgroundColor: color}} />
}

export default ColorShower