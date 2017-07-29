/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();

let PORT = process.env.PORT || 9000;

let db = require('./models');

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`Server running on ${PORT}`);
});