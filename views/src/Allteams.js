import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class Allteams extends Component {
  constructor() {
    super();
    this.state = {allTeams: [],
                  isLoaded: false};
  }

loadMEssages = () => {
  axios.get(`http://localhost:3002/getTeam`)
    .then(response => this.setState({ 
      allTeams: response.data.reverse(),
      isLoaded : true}));
  console.log('Chargez !!!!!!')
}

componentDidMount() {
  this.loadMEssages()
}
  render() {

    const { allTeams , isLoaded } = this.state;
    if (!isLoaded) return <div>Loading...</div>
    return (
        <ul>
            {allTeams.map((item) => 
                <p key={item.id}> {item.TeamName} {item.message} </p>)}
        </ul>
  )
            }
};

export default Allteams;