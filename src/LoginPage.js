import React, { Component } from 'react'


//var Web3 = require('web3');
//var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');


import ReactSignupLoginComponent from 'react-signup-login-component';
 
const LoginPage = (props) => {
    const signupWasClickedCallback = (data) => {
      console.log(data);
      alert('Signup callback, see log on the console to see the data.');
    };
    const loginWasClickedCallback = (data) => {
      console.log(data);
      alert('Login callback, see log on the console to see the data.');
    };
    const recoverPasswordWasClickedCallback = (data) => {
      console.log(data);
      alert('Recover password callback, see log on the console to see the data.');
    };
    return (
        <div>
            <ReactSignupLoginComponent
                title="My awesome telegram bot"
                handleSignup={signupWasClickedCallback}
                handleLogin={loginWasClickedCallback}
                handleRecoverPassword={recoverPasswordWasClickedCallback}
            />
        </div>
    );
};
 
export default LoginPage
//export default App
