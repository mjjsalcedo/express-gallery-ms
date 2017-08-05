/* jshint esversion:6 */
const express = require('express');
const passport = require('passport');
const app = express.Router();

let db = require('../models');
let Users = db.users;
let Authors = db.authors;
let Photos = db.photos;

app.get('/', (req, res) =>{
  console.log('booooooooooooooooop', req.user);
  Photos.findAll({ include: [{ model: Users }, {model: Authors}]})
  .then( photos => {
    let photosObj = {
      photos: photos
    };
    res.render('./templates/index', photosObj);
  });
});

app.get('/login', (req, res)=> {
  res.render('./templates/login');
});

app.get('/register', (req, res)=> {
  res.render('./templates/register');
});

app.post('/login', passport.authenticate('local',{
  successRedirect: '/success',
  failureRedirect: '/login'
}));

app.post('/register',(req, res)=>{

  let {username, password} = req.body;
  bcrypt.genSalt(saltRounds, (err, salt)=>{

    bcrypt.hash(req.body.password, salt, (err, hash)=>{
      Users.create({
        username: req.body.username,
        password: hash
      }).then ((user)=> {
        res.redirect('/login');
      }).catch((err)=> {
        return res.send('Stupid username yo');
      });
    });
  });
});

app.get('/success', (req, res)=> {
  res.render('./templates/success');
});

app.get('/logout', (req, res)=>{
  req.logout();
  res.render('./templates/logout');
});

app.get('/gallery/new', ( req, res ) => {
  res.render('./templates/new');
});

app.get('/success', isAuthenticated, (req, res) =>{
  res.render('./templates/success', photosObj);
});

app.get('/gallery/:id', (req, res) => {
  let photoId = req.params.id;
  Photos.findAll({ include: [{ model: Users },{ model:Authors } ] })
  .then( photos => {
    let mainPhoto = photos.filter((photo)=> {
      if(photo.id == photoId){
        return photo;
      }
    });

    let revisedMainPhoto = {
      id: mainPhoto[0].id,
      link:mainPhoto[0].link,
      author: mainPhoto[0].author.author,
      description: mainPhoto[0].description,
    };

    let otherPhotos = photos.filter((photo)=> {
      if(photo.id != photoId){
        return photo;
      }
    });

    let photosObj = {
      photo: revisedMainPhoto,
      photos: otherPhotos
    };

    res.render('./templates/photo', photosObj);
  });
});

app.get('/gallery/:id/edit', (req, res) =>{
  findPhoto(req, res)
  .then( photo =>  {
    let photoObj = {
      author_id: photo.id,
      link: photo.link,
      description: photo.description,
    };
    console.log(photoObj);
    res.render('./templates/edit', photoObj);
  });
});

app.post('/gallery', /*isAuthenticated,*/ (req, res) => {
  console.log('hellooooooooooooooooooooo');
  res.send('route here');
  /*findAuthor(req, res)
  .then( author => {
    console.log('hello');
console.log('bye');
    Photos.create(
      { author_id: author.id,
        user_id: req.user.id,
        link: req.body.link,
        description: req.body.description}
        );
  }).then(()=> {
    res.redirect('/');
  })
  .catch( err => {
    console.log(err);
  });*/
});

app.put('/gallery/:id', isAuthenticated, (req, res) => {
  let photoId = req.params.id;
  findAuthor(req, res)
  .then( author => {

      Photos.findById(photoId , {include: [{model:Users}]}).then(photo => {
       if(req.user.id === photo.user_id){
         photo.update(
          { author_id: author.id,
            link: req.body.link,
            description: req.body.description
          }
          );
        }
      }).then(()=>{
      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
    });
  });
});

app.delete('/gallery/:id', isAuthenticated, (req, res) => {
  let photoId = req.params.id;
  findPhoto(req, res).then(photo=>{
    if(req.user.id === photo.user_id){
      Photos.destroy({ where: {id: photoId} }).then(()=> {
        res.redirect('/');
      });
    }
  });
});

module.exports = app;

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function findAuthor( req, res ) {
  return Authors.find({ where: { author: req.body.author } })
  .then( author => {
    if(author){
      return author;
    } else {
      return Authors.create(
        {author: req.body.author}
        );
    }
  });
}

function findPhoto( req, res ) {
  let photoId = req.params.id;
  return Photos.findOne({
    where: {id: photoId },
    include: {model: Users}
  });
}


