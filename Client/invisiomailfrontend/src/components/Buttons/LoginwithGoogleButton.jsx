import "../../Styles/Buttons/LoginwithGoogleButton.css"

import { FcGoogle } from "react-icons/fc";
import React from 'react'

function LoginwithGoogleButton({buttonTitle,buttonFunctionality,Icon}) {
  return (
    <div className="Loginwithgooglecontainer">
      <button className="buttonLogin"
      onClick={buttonFunctionality}>
        
      {Icon && <Icon className="button-icon"/>}
        <span>{buttonTitle}</span>
      </button>
    </div>
  )
}

export default LoginwithGoogleButton