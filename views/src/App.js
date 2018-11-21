import React, { Component } from 'react';
import axios from 'axios';
import Allteams from './Allteams';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {teamName: ''};
  };

  handleChangeTxt = (e) => {
    this.setState({teamName: e.target.value});
    
  };

  submitTeamName = (e) => {
    console.log(this.state)
    e.preventDefault();
    if (!this.state.teamName) alert('team name is empty');
    else {
      axios.post('http://localhost:3002/registerTeam', this.state)
        .then(this.setState({teamName: ''}))
        .then(window.location.reload()); //this line is horrible
    };
  };

  render() {
    return (
      <div>
        <form onSubmit={this.submitTeamName}>
          <input
            type="text"
            name="teamName"
            placeholder="Your Super Team Name"
            value={this.state.teamName}
            onChange={this.handleChangeTxt}
          />
          <button type="submit">Submit</button>
        </form>
        <Allteams />
      </div>
    );
  };
};

export default App;