"use strict";
const { start } = require("./src/server");
const { db } = require("./src/models/index");
require("dotenv").config();

db.sync()
  .then(() => {
    start(process.env.PORT || 8080);
  })
  .catch(console.error());
