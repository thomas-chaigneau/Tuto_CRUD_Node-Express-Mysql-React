const express = require('express');
const app = express();
const connection = require('./secret');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3002;

connection.connect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get(`/`, (req, res) => {
  res.status(200).send('HELLO YOU !');
});

app.post(`/registerTeam`, (req, res) => {
  const { teamName } = req.body;
  if (!teamName) return;
  connection.query(`INSERT INTO Team (TeamName) VALUES (?);`, teamName, err => {
    if (err) throw err;
    console.log(`${teamName} INSERTED`);
  });
});

app.get('/getTeam',  (req, res) => {
  connection.query('SELECT * FROM Team;', (err, rows, fields) => {
    if (err) throw err;
    res.status(200).send(rows);
  });
});

app.delete('/deleteATeam/:TeamId', (req, res) => {
  const { TeamId } = req.params;
  if (!TeamId) return;
  connection.query('DELETE FROM Team WHERE id = ?', TeamId, (err, rows, fields) => {
    if (err) throw err;
    console.log(`you delete ${rows.affectedRows} row`);
  });
});

app.put('/modifyATeam/:TeamId', (req, res) => {
  const { TeamId } = req.params;
  const NewTeamName = req.body.newName;
  if (!NewTeamName) return;
  connection.query('UPDATE Team SET TeamName = ? WHERE id = ?', [NewTeamName, TeamId], err => {
    if (err) throw err;
    console.log(`you modify row number ${TeamId} for ${NewTeamName}`);
  });
});

app.listen(port, err => {
  if (err) throw err;
  console.log(`Server is listening on ${port}`);
});