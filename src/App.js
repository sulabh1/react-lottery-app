import React, { Component } from "react";

import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
    winner: "",
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayer().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onInputChange = (e) => {
    this.setState({ value: e.target.value });
  };
  etherEntered = async (e) => {
    e.preventDefault();
    const account = await web3.eth.getAccounts();
    this.setState({ message: "waiting on transaction success..." });
    await lottery.methods.enter().send({
      from: account[0],
      value: web3.utils.toWei(this.state.balance, "ether"),
    });
    this.setState({ message: "transaction successfull" });
  };
  winnerPick = async (e) => {
    e.preventDefault();
    const account = await web3.eth.getAccounts();
    this.setState({ message: "Picking winner..." });
    const winner = lottery.methods.pickWinner().send({ from: account[0] });
    this.setState({ message: "winner is picked" });
    this.setState({ winner });
  };

  render() {
    return (
      <div>
        <h2>Lottery contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently{" "}
          {this.state.players.length} people entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />
        <form onSubmit={this.etherEntered}>
          <h4>Want to try luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input value={this.state.value} onChange={this.onInputChange} />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner</h4>
        <button onClick={this.winnerPick}>Pick a winner!</button>
        <h1> {this.state.winner}</h1>
        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
