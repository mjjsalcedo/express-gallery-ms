/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const methodOverride = require('method-override');
const galleryRouter = require('./routes/gallery.js');

const RedisStore = require('connect-redis')(session);
const saltRounds = 10;
const bcrypt = require('bcrypt');

const app = express();
let db = require('./models');
let Users = db.users;
let Photos = db.photos;

let PORT = process.env.PORT || 9000;

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
});
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  store: new RedisStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');



app.use(passport.initialize());
app.use(passport.session());
app.use('/', galleryRouter);

passport.serializeUser((user, cb)=> {
  console.log('baaaaaaaaaaaaaaaaaaaa');
  cb(null, user.id);
});


passport.deserializeUser((userId, cb)=> {
  console.log('moooooooooooooooooo');
  Users.findById(userId, cb).then(user => {
    if (user) {
      return cb(null, user);
    }
    return cb(null);
  }).catch(err=>{
    if(err){
      return cb(err);
    }
  });
});


passport.use(new LocalStrategy((username,password, done)=>{
  Users.findOne({where: {username:username}}).then ( user => {
    if (user === null) {
      return done(null, false, {message: 'bad username or password'});
    }
    else {
      bcrypt.compare(password, user.password)
      .then(res => {
        if (res) { return done(null, user); }
        else {
          return done(null, false, {message: 'bad username or password'});
        }
      });
    }
  })
  .catch(err => {
    console.log('error: ', err);
  });
}
));



app.listen(PORT, () => {
    /*db.sequelize.drop();*/
  db.sequelize.sync();

  console.log(`Server running on ${PORT}`);
});


