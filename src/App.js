import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import ipfs from './ipfs'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
//import ReactSignupLoginComponent from 'react-signup-login-component';

//var Web3 = require('web3');
//var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');


class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
      currentAccount:null
    }
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.signupWasClickedCallback = this.signupWasClickedCallback.bind(this);
    this.loginWasClickedCallback = this.loginWasClickedCallback.bind(this);
    this.recoverPasswordWasClickedCallback = this.recoverPasswordWasClickedCallback.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)
  
    // Get accounts
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance
        this.setState({ account: accounts[0] })
        // Get the value from the contract to prove it worked.
        return this.simpleStorageInstance.get.call(accounts[0])
      }).then((ipfsHash) => {
        // Update state with the result.
        return this.setState({ ipfsHash })
      })
    })
  }

  captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.buffer = Buffer(reader.result)
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }
  signupWasClickedCallback() {
    //console.log(data);
    alert('Signup callback, see log on the console to see the data.');
  }
  loginWasClickedCallback() {
//    console.log(data);
    alert('Login callback, see log on the console to see the data.');
  }
  recoverPasswordWasClickedCallback() {
//    console.log(data);
    alert('Recover password callback, see log on the console to see the data.');
  }


  onSubmit(event) {



    //console.log(Web3)
    const acc = "0x31228C373aF8561c59fcA9e3FD91367c4AA6F0C6"

    event.preventDefault()

    // this.state.web3.eth.getAccounts(function (error, accounts) => {
     
    //  this.setState({currentAccount : accounts[0]}) 
     
    // })
    
    this.state.web3.eth.getAccounts((error, accounts) => {
       
        this.setState({ currentAccount: accounts[0] })  
    })

    ipfs.files.add(this.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }

      // web3.eth.sendTransaction({
      //   from: "0x266652513c56Fabc34a7080Dd60c7357417cd6c0",
      //   to: acc,
      //   value :web3.utils.toWei('0','ether'),
      //   data: web3.utils.asciiToHex('ipfsHash')
      // },function(err, transactionHash) {
      //   if (!err)
      //     console.log(transactionHash); 
      // })
      
      
      this.simpleStorageInstance.sendHash(result[0].hash,acc,{from: this.state.currentAccount }).then((r) => {
        
        console.log('ifpsHash', result[0].hash)
        this.simpleStorageInstance.getHash(acc,{from:this.state.currentAccount}).then((res) => {
            console.log('Received hash : ',res)
        })
        return this.setState({ ipfsHash: result[0].hash})
     
      })

    })
 
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">IPFS File Upload DApp</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Your Image</h1>
              <p>This image is stored on IPFS & The Ethereum Blockchain!</p>
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
              <h2>Upload Image</h2>
              <form onSubmit={this.onSubmit} >
                <input type='file' onChange={this.captureFile} />
                <input type='submit' />
              </form>
            </div>
          </div>
        </main>
        {/* <div>
              <ReactSignupLoginComponent
                  title="My awesome company"
                  handleSignup={this.signupWasClickedCallback}
                  handleLogin={this.loginWasClickedCallback}
                  handleRecoverPassword={this.recoverPasswordWasClickedCallback}
              />
          </div> */}

      </div>
  
    );
  }
}

export default App
