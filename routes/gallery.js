/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const router = express.Router();

let db = require('../models');
let Users = db.users;
let Authors = db.authors;
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
  Users.findById(userId, cb).then(user => {
    if (user) {
      return cb(null, user);
    }
    return cb(null);
  }).catch(err=>{
    if(err){
      return done(err);
    }
  });
});


passport.use(new LocalStrategy((username,password, done)=>{
  Users.findOne({where: {username:username}}).then((user)=> {
    if(!user){
      return done(null, false);
    }
    if(user.password !== password){
      return done(null, false);
    }
    return done(null, user);
  }).catch(err => {
    if (err){
      return done(err);
    }
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

router.get('/login', (req, res)=> {
  res.render('./templates/login');
});

router.get('/success', (req, res)=> {
  res.render('./templates/success');
});

router.post('/login', passport.authenticate('local',{
  successRedirect: '/success',
  failureRedirect: '/login'
}));



router.get('/gallery/new', ( req, res ) => {
  res.render('./templates/new');
});


router.get('/success', isAuthenticated, (req, res) =>{
  res.render('./templates/success', photosObj);
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

router.get('/gallery/:id/edit', isAuthenticated, (req, res) =>{
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


router.post('/gallery', isAuthenticated, (req, res) => {
  findAuthor(req, res)
  .then( author => {
    Photos.create(
      { author_id: author.id,
        user_id: req.user.id,
        link: req.body.link,
        description: req.body.description}
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
    { author_id: author.id,
      user_id: req.user.id,
      link: req.body.link,
      description: req.body.description
    },
    { where: { id: photoId } });
  });
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


function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

/*
function hasAdminAccess(req, res, next){
  if(req.isAuthenticated()){
    if(req.user.role === 'admin'){
      return next();
    }
    return res.redirect('/secret');
  }
  res.redirect('/login.html');
}*/