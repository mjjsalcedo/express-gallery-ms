/*jshint esversion: 6 */
const { MongoClient } = require('mongodb');
const mongoConnectionString = 'mongodb://localhost:27017/galleryMeta';

let mongoDb = null;
let photoMetas = null;
MongoClient.connect(mongoConnectionString, (err,connectedDb)=> {
  console.log(`successfully connected to ${mongoConnectionString}`);
  mongoDb = connectedDb;

  photoMetas = mongoDb.collection('photoMetas');
  // Insert some docuemnts
  photoMetas.insertOne({hello: 'world'});
});

module.exports = {
  photoMetas : () => photoMetas
};