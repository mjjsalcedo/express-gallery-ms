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
  Users.find({ where: { author: req.body.author } })
  .then( author => {
    if(author){
      return author;
    } else {
      return Users.create(
        {author: req.body.author}
        );
    }
  })
  .then( author => {
      Photos.create(
        { author_id: JSON.stringify(author.id),
          link: req.body.link,
          description: req.body.description }
    );
  })
  .catch( err => {
    console.log(err);
  });
});

app.get('/gallery/:id', (req, res) => {
  console.log('req', req.params.id);
  let photoId = req.params.id;
  Photos.findById(photoId)
  .then( photo =>  {
    res.json(photo);
  });
});

app.get('/gallery/:id/edit', (req, res) =>{
  let photoId = req.params.id;
  Photos.findById(photoId)
  .then( photo =>  {
    res.render(photo);
  });
});

app.get('/', (req, res) =>{
  Photos.findAll()
  .then( photos =>  {
    res.json(photos);
  });
});

app.put('/gallery/:id', (req, res) => {
  let photoId = req.params.id;
  Photos.update(
  {
    author: req.body.author, //ask someone if the user = author? if user = author, disable changes
    link: req.body.link,
    description: req.body.description
  },
  { where: { id: photoId } })
  .catch(err => {
    console.log(err);
  });
});

app.listen(PORT, () => {
/*  db.sequelize.drop();*/
  db.sequelize.sync();

  console.log(`Server running on ${PORT}`);
});