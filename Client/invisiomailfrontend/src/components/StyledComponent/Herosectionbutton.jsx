import React from 'react'
import "../../Styles/Herosectionbutton.css"
function Herosectionbutton({buttontitle,herobuttonfunction}) {
  return (
    <button className='herosectionbutton' onClick={herobuttonfunction}>
       {buttontitle}  
   </button>
  )
}

export default Herosectionbutton