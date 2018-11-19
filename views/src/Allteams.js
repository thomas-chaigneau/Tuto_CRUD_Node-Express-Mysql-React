import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class Allteams extends Component {
  constructor() {
    super();
    this.state = {allTeams: [],
                  isLoaded: false};
  }

loadTeamsNames = () => {
  axios.get(`http://localhost:3002/getTeam`)
    .then(response => this.setState({ 
      allTeams: response.data.reverse(),
      isLoaded : true}));
  console.log('Chargez !!!!!!')
}

deleteTeam = (id) => {
  console.log(id)
  axios.delete(`http://localhost:3002/modifyATeam/${id}`)
}


componentDidMount() {
  this.loadTeamsNames()
}
  render() {

    const { allTeams , isLoaded } = this.state;
    if (!isLoaded) return <div>Loading...</div>
    return (
        <ul>
            {allTeams.map((item) => 
              <div key={item.id}><p> {item.TeamName} <button onClick={() => this.deleteTeam(item.id)}>Delete</button></p></div>)}
        </ul>
  )
            }
};

export default Allteams;