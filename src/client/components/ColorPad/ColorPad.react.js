import React from 'react'
import {Colors} from 'shared/consts'

import './ColorPad.scss'

const ColorPad = ({isActive, isDisabled, onColorTapped, tappedColors}) => {  
  const colors = Object.keys(Colors).map(color => {
    return <button key={color}
                   className='color'                 
                   style={{backgroundColor: Colors[color]}}
                   disabled={isDisabled}
                   onClick={!isDisabled && onColorTapped.bind(null, color)}
                   onTouchTap={!isDisabled && onColorTapped.bind(null, color)} />
  })

  const usedColors = tappedColors.map((color, i) => {
    return <div key={color + '-' + i}
                className='color' 
                style={{backgroundColor: Colors[color]}} />
  })

  return <span>
            {isActive && 
              <div>
                <div className='color-container'>
                  {colors}
                </div>
                <h3>Your pattern:</h3>
                <div className='mini-color-container'>
                  {usedColors}
                </div>
              </div>}
         </span>
}

export default ColorPad