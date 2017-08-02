/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const router = express.Router();

let db = require('../models');
let Users = db.users;
let Photos = db.photos;


router.use(express.static('public'));
router.use(bodyParser.urlencoded({extended:true}));
router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());


router.use(passport.session());
passport.serializeUser((user, cb)=> {
  cb(null, user.id);
});


passport.deserializeUser((userId, cb)=> {
  Users.findById(userId, cb);
});


passport.use(new LocalStrategy((username,password, done)=>{
  console.log('username', username);
  Users.findAuthor({username:username}, (err, user)=> {
    if(err) {return done(err);}
    if(!user){
      return done(null, false, {message: 'username does not exist'});
    }
    if(user.password !== password){
      return done(null, false, {message: 'incorrect password'});
    }
    return done(null, user);
  });
}));


router.get('/', (req, res) =>{
  Photos.findAll({ include: { model: Users } })
  .then( photos => {
    let photosObj = {
      photos: photos
    };
    res.render('./templates/index', photosObj);
  });
});


router.get('/gallery/new', ( req, res ) => {
  res.render('./templates/new');
});


router.get('/gallery/:id', (req, res) => {
  let photoId = req.params.id;
  Photos.findAll({ include: { model: Users } })
  .then( photos => {
    let mainPhoto = photos.filter((photo)=> {
      if(photo.id == photoId){
        return photo;
      }
    });

    let otherPhotos = photos.filter((photo)=> {
      if(photo.id != photoId){
        return photo;
      }
    });

    let photosObj = {
      photo: mainPhoto,
      photos: otherPhotos
    };
    res.render('./templates/photo', photosObj);
  });
});

router.get('/gallery/:id/edit', (req, res) =>{
  findPhoto(req, res)
  .then( photo =>  {
    let photoObj = {
      author_id: photo.author_id,
      link: photo.link
    };
    console.log(photoObj);
    res.render('./templates/edit', photo);
  });
});


router.post('/gallery', (req, res) => {
  findAuthor(req, res)
  .then( author => {
    Photos.create(
      { author_id: author.id,
        link: req.body.link,
        description: req.body.description }
        );
  });
  res.redirect('/')
  .catch( err => {
    console.log(err);
  });
});


router.put('/gallery/:id', isAuthenticated, (req, res) => {
  let photoId = req.params.id;
  findAuthor(req, res)
  .then( author => {
    Photos.update(
    {
      author_id: author.id,
      link: req.body.link,
      description: req.body.description
    },
    { where: { id: photoId } });
  });
  console.log('herro');
  res.redirect(`/gallery/${req.params.id}`)
  .catch(err => {
    console.log(err);
  });
});


router.delete('/gallery/:id', isAuthenticated, (req, res) => {
  let photoId = req.params.id;
  Photos.destroy({ where: {id: photoId} });
  res.redirect('/')
  .catch( err => {
    console.log(err);
  });

});

module.exports = router;

function findById(id, cb) {
  let user = users.find(user => id === user.id);
  if (user) {
    return cb(null, user);
  }
  return cb(null);
}

function findAuthor( req, res ) {
  return Users.find({ where: { author: req.body.author } })
  .then( author => {
    if(author){
      return author;
    } else {
      return Users.create(
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


function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/index.html');
}


function hasAdminAccess(req, res, next){
  if(req.isAuthenticated()){
    if(req.user.role === 'admin'){
      return next();
    }
    return res.redirect('/secret');
  }
  res.redirect('/login.html');
}