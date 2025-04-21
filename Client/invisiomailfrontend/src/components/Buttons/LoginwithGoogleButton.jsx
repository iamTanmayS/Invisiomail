import React from 'react'
import { FcGoogle } from "react-icons/fc";
import "../../Styles/Buttons/LoginwithGoogleButton.css"

function LoginwithGoogleButton({buttonTitle,buttonFunctionality}) {
  return (
    <div className="Loginwithgooglecontainer">
      <button className="buttonLogin"
      onClick={buttonFunctionality}>
        
        <FcGoogle
        className='google-icon'/>
        <span>{buttonTitle}</span>
      </button>
    </div>
  )
}

export default LoginwithGoogleButton