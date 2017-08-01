/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();

let PORT = process.env.PORT || 9000;

let db = require('./models');
let Users = db.Users;
let Photos = db.Photos;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/gallery', function (req, res) {
  Users.create({ username: req.body.username })
  .then(function (user) {
    res.json(user);
  });
});

app.get('/gallery/:id', function(req, res) {
  let photoId = req.params.id;
  Users.findById(photoId)
  .then(function (users) {
    res.json(users);
  });
});

app.get('/gallery/:id/edit', function(req, res) {
  let photoId = req.params.id;
  Users.findById(photoId)
  .then(function (users) {
    res.render(users);
  });
});

/*app.get('/gallery', function(req, res) {
  Users.findAll()
  .then(function (users) {
    res.json(users);
  });
});
*/
app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`Server running on ${PORT}`);
});