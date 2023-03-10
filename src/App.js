import react from 'react'
import "./App.css";
import web3 from "./web3.js";
import lottery from './lottery.js';


class App extends react.Component{

  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const balance = await web3.eth.getBalance(lottery.options.address)

    this.setState({manager, players, balance})
  }

  onSubmit = async event => {
    event.preventDefault()

    const accounts = await web3.eth.getAccounts()

    // We will display this message, while the transaction is taking place. Because it needs time to transact

    this.setState({message: 'Waiting for the transaction success...'})

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether'),

    })

    this.setState({message: 'You have been successfully entered to the lottery'})
  }

  onClick = async() => {
    const accounts = await web3.eth.getAccounts()

    this.setState({message: 'Waiting for transaction success...'})

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })

    this.setState({message: 'Winner has been picked'})
  }
  render(){
  return (
    <div>
      <h2>Lottery Contract </h2>
      <p>This Contract is managed by {this.state.manager}.
         There are currently {this.state.players.length} players, And Competing 
         to win {web3.utils.fromWei(this.state.balance, 'ether')} ether.
      </p>

      <hr/>
      <form onSubmit = {this.onSubmit}>
        <h4>Want to try your luck?</h4>

        <div>
          <label> Amount you want to enter:</label>
          <input 
          value = {this.state.value}
          onChange = {event => this.setState({
            value: event.target.value
          })}
          />
          <button>Enter</button>
        </div>
      </form>

      <hr/>

      <h4>Ready to pick a winner</h4>
      <button onClick = {this.onClick}>Pick a winner</button>

      <hr/>

      <h1>{this.state.message}</h1>

    </div>
  );
}
}

export default App;
