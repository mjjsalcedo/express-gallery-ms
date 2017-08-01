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

app.use(express.static('public'));

/*app.post('/gallery', (req, res) => {
  Users.findOrCreatecreate({where: {
    author: req.body.author
  }
  })
  Photos.create({
    link: req.body.link,
    description: req.body.description
  })
  .then(function (user) {
    res.json(user);
  });
});
*/
app.get('/gallery/:id', (req, res) => {
  let photoId = req.params.id;
  Users.findById(photoId)
  .then(function (users) {
    res.json(users);
  });
});

app.get('/gallery/:id/edit', (req, res) =>{
  let photoId = req.params.id;
  Users.findById(photoId)
  .then(function (users) {
    res.render(users);
  });
});

app.get('/', (req, res) =>{
  Users.findAll()
  .then(function (users) {
    res.json(users);
  });
});


// app.put('/:id')

app.listen(PORT, () => {
/*  db.sequelize.drop();*/
  db.sequelize.sync();
  console.log(`Server running on ${PORT}`);
});