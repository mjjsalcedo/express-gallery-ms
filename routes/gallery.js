/* jshint esversion:6 */
const express = require('express');
const router = express.Router();

let db = require('../models');
let Users = db.users;
let Photos = db.photos;

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
  return Photos.findById(photoId)
  .then( photo => {
    if(photo) {
      return photo;
    } else {
      return;
    }
  });
}

router.post('/gallery', (req, res) => {
  findAuthor(req, res)
  .then( author => {
    Photos.create(
      { author_id: author.id,
        link: req.body.link,
        description: req.body.description }
        );
  })
  .catch( err => {
    console.log(err);
  });
});

router.get('/gallery/:id', (req, res) => {
  let photoId = req.params.id;
  Photos.findById(photoId)
  .then( photo =>  {
    res.json(photo);
  });
});

router.get('/gallery/:id/edit', (req, res) =>{
  let photoId = req.params.id;
  Photos.findById(photoId)
  .then( photo =>  {
    res.render(photo);
  });
});

router.get('', (req, res) =>{
  Photos.findAll()
  .then( photos =>  {
    res.json(photos);
  });
});

router.put('/gallery/:id', (req, res) => {
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
  })
  .catch(err => {
    console.log(err);
  });
});

router.delete('/gallery/:id', (req, res) => {
    let photoId = req.params.id;
    Photos.destroy({ where: {id: photoId} })
  .catch( err => {
    console.log(err);
  });

});

module.exports = router;