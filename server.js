/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const Users = require('./models/users');
const app = express();

let PORT = process.env.PORT || 9000;

let db = require('./models');

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users', function (req, res) {
  Users.create({ username: req.body.username })
  .then(function (user) {
    res.json(user);
  });
});

app.get('/users', function(req, res) {
  console.log(Users);
  Users.findAll()
  .then(function (users) {
    res.json(users);
  });
});

app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`Server running on ${PORT}`);
});