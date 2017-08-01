/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();

let PORT = process.env.PORT || 9000;

let db = require('./models');
let Users = db.users;
let Photos = db.photos;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/gallery', (req, res) => {
  Users.findAll()
  .then( user => {
    res.json(user);
  });
});

app.get('/gallery/:id', (req, res) => {
  let photoId = req.params.id;
  Users.findById(photoId)
  .then( users =>  {
    res.json(users);
  });
});

app.get('/gallery/:id/edit', (req, res) =>{
  let photoId = req.params.id;
  Users.findById(photoId)
  .then( users =>  {
    res.render(users);
  });
});

app.get('/', (req, res) =>{
  Photos.findAll()
  .then( users =>  {
    res.json(users);
  });
});


// app.put('/:id')

app.listen(PORT, () => {
  /*  db.sequelize.drop();*/
  db.sequelize.sync({ force: true });
  console.log(`Server running on ${PORT}`);
});