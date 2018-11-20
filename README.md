nov. 2018 

#### the aim is to create a application to post, get and delete team names :
![applicaiton capture](https://image.ibb.co/dJeYS0/Capture-du-2018-11-20-10-26-27.png)


introduction : [google slides (fr)](https://docs.google.com/presentation/d/1i2KmPDIBzpzXQUm-Dx8q5z6Vl39WXCYOJjvKfigxFGo/edit?usp=sharing)

## Working space
Create a project folder with a backend folder and git init it.
Add in the .gitignore sensitive files we will use (secret.js will contain db connection informations).
Init an react app called "views".
Finally, open the project in vscode.

To do it, play this command on your terminal :
```bash
mkdir escapeGame && cd escapeGame
mkdir backend
git init
echo -e "backend/secret.js\n\nbackend/node_modules" > .gitignore
cd backend && touch server.js secret.js
npm init -y
cd .. && create-react-app views
code .
```

## Data Base setup
I use workbench to manage my data bases.
You can [download](https://www.mysql.com/fr/products/workbench/) and run it :
```bash
$ mysql-workbench
```
Choose a password that you don't use for other sensitive plateforms.
Once workbench is configured, you can run this sql query to create your DB :

```sql
CREATE DATABASE escapeGame;
```

then, connect your interface to this new database and select it in your db list :
![workbench interface](https://preview.ibb.co/c56juf/workbench.png)

finaly, create a table "teamName" and test it :

```sql
CREATE TABLE Team (id INTEGER AUTO_INCREMENT PRIMARY KEY, TeamName TEXT);
INSERT INTO Team (TeamName) VALUES ('FirstTeam');
SELECT * FROM Team;
```

## server setup
Make sure to be in your backend folder. We will use [express](https://expressjs.com)
```bash
$ npm i express
```

```js
const express = require('express');
const app = express();
const port = 3002;

app.get(`/`, (req, res) => {
    res.status(200).send('HELLO YOU !');
});


app.listen(port, err => {
  if (err) throw err;
  console.log(`Server is listening on ${port}`);
});

```

## DB connection to server
Still in your backend folder, install [mysql package](https://www.npmjs.com/package/mysql).
```bash
$ npm i mysql
```
In secret.js, create a constant to stock your db configuration and export it.
```js
//backend/secret.js
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user :  'root',
    password :  '<your password>',
    database :  'escapeGame',
});
module.exports = connection;
```

Import your db configuration in server.js and use the connect method :

```js
//backend/server.js
const connection = require('./secret');
//...
connection.connect();
```

## 'Post' route
Here we use [express routing](https://expressjs.com/en/starter/basic-routing.html).
* line 1 : beware not to interchange req and res ... :)
* line 2 : this is a little anticipation of what we will post, from views, in this route.
* line 4 : [perform the sql query](https://www.npmjs.com/package/mysql#performing-queries) It's much better to [escape query Values](https://github.com/mysqljs/mysql#escaping-query-values)

```js
app.post(`/registerTeam`, (req, res) => {
    const { teamName } = req.body;
    if (!teamName) return;
    connection.query(`INSERT INTO Team (TeamName) VALUES (?);`, teamName, err => {
        if (err) throw err;
        console.log(`${teamName} INSERTED`)
    });
});
```
## REACT form and request posting
Make sure to be in your views folder. To post in routes, we can use [axios](https://github.com/axios/axios)
With axios.post(route, data), data is an object.

```bash
$ npm i axios
```

```js
//views/app.js
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {teamName: ''};
}

handleChangeTxt = (e) => {
  this.setState({teamName: e.target.value});
  
}

submitTeamName = (e) => {
  console.log(this.state)
  e.preventDefault();
  if (!this.state.teamName) alert('team name is empty');
  else {
    axios.post('http://localhost:3002/registerTeam', this.state)
      .then(this.setState({teamName: ''}))
      .then(window.location.reload());
  }
}
  render() {
      return (
        <form onSubmit={this.submitTeamName}>
          <input
            type="text"
            name="teamName"
            placeholder="Your SUper Team Name"
            value={this.state.teamName}
            onChange={this.handleChangeTxt}
          />
          <button type="submit">Submit</button>
      </form>
      );
  }
};

export default App;
```
If you make a test, you will have errors. After some investigations, you can find out two issues [Cross-origin (fr)](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS) and [body parsing](https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express?answertab=votes#tab-top). We need to parse the Json file we send in the route and manage with cors.

## Middleware
Go back to the back and and install [cors](https://www.npmjs.com/package/cors) and [body-parser](https://www.npmjs.com/package/body-parser)

```bash
$ npm i body-parser
$ npm i cors
```

```js
//backend/server.js
const bodyParser = require('body-parser');
const cors = require('cors');
//...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
```
Now run your server and react app : in your backend folder play this command :
```bash
$ node server.js
```
And in views :
```bash
$ npm start
```

If you post a team name in your form, it will works :). You can check in workbench, with a select sql query.

## 'Get' route
The aim is to see all teams registered in a web page.

* line 3 : see [Performing queries](https://www.npmjs.com/package/mysql#performing-queries)

```js
// backend/serveur.js
app.get('/getTeam',  (req, res) => {
    connection.query('SELECT * FROM Team;', (err, rows, fields) => {
      if (err) throw err;
      res.status(200).send(rows)
    })
  })
```

restart your server
```bash
$ ctr+c
$ node server
```
then go to => http://localhost:3002/getTeam
now you sould have your API usable

## GET api in front
You can create an other react component :
make sure to be in views/src
```bash
$ touch Allteams.js
```

```js
//views/src/Allteams
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
```

```js
//views/src/Apps.js
import AllTeams from './Allteams'
```
Finaly, restart your react app :
```bash
$ npm start
```
Post a new team name and it should appear. 

## DELETE a team (Views)
Maybe this have to be done with parsimony because the data couldn't be found again.
Let's begin by views, we have to identify the team we want to delete. We will use the item id, that we also use as 'key' atttribute of the element we render in the team name list.
```js
//views/Allteams.js
    return (
      <ul>
          {allTeams.map((item) => 
            <p key={item.id}>
              <span>{item.TeamName}  </span>
              <button onClick={() => this.deleteTeam(item.id)}>Delete</button>
            </p>)}
      </ul>
    )
```
The item id in passed as an argument to the deleteTeam function. When you click the button, the item id is throwed, via parameter, to the delete route.
```js
//views/Allteams.js
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
  else return
}
```

## DELETE a team (backend)
```js
app.delete('/deleteATeamATeam/:TeamId', (req, res) => {
    const { TeamId } = req.params;
    if (!TeamId) return;
    connection.query('DELETE FROM Team WHERE id = ?', TeamId, (err, rows, fields) => {
        if (err) throw err;
        console.log(`you delete ${rows.affectedRows} row`);
      })
  });
  ```
  
  
## Modify a team (Views)
In render, it's similar to Delete
```js
//views/Allteams.js
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
  else return
}
```
We can define the modity function like this :
```js
modifyTeam = (id) => {
    const newName = prompt("What the new team name ?", "");
    if (newName)
        axios.put(`http://localhost:3002/modifyATeam/${id}`,{ newName })
        .then(window.location.reload());;
}
```

## Modify a team (backend)
```js
  app.put('/modifyATeam/:TeamId', (req, res) => {
    const { TeamId } = req.params;
    const Team = req.body;
    console.log(TeamId, Team.newName);
    if (!Team.newName) return;
    connection.query('UPDATE Team SET TeamName = ? WHERE id = ?', [Team.newName, TeamId], err => {
            if (err) throw err;
        console.log(`you modify row number ${TeamId} for ${Team.newName}`);
    })
  });
  ```
