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
    axios.delete(`http://localhost:3002/deleteATeam/${id}`)
    .then(window.location.reload());
  }
  else return
}

modifyTeam = (id) => {
  const teamNameToModify = this.state.allTeams.filter(item => item.id === id)[0].TeamName;
  const newName = prompt("What the new team name ?", teamNameToModify);
  if (newName)
    axios.put(`http://localhost:3002/modifyATeam/${id}`,{ newName })
    .then(window.location.reload());;
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
              <button onClick={() => this.modifyTeam(item.id)}>Modify</button>
            </p>)}
      </ul>
    )
  }
};

export default Allteams;