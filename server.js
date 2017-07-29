/* jshint esversion:6 */
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let PORT = process.env.PORT || 9000;

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`Server running on ${PORT}`);
});