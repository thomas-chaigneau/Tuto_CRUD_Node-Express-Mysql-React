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
  if (window.confirm('Are you sure you wish to delete this team?')) {
    axios.delete(`http://localhost:3002/modifyATeam/${id}`)
    .then(window.location.reload());
  }
  else return
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
            <p key={item.id}>
              <span>{item.TeamName}  </span>
              <button onClick={() => this.deleteTeam(item.id)}>Delete</button>
            </p>)}
      </ul>
    )
  }
};

export default Allteams;