const mongoose = require('mongoose');
//const config = require('config');
//const db = config.get('mongoURI');
require("dotenv").config();

const connectToDB = () => {
  try {
    mongoose.connect(
      process.env.mongoURI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log('mongodb connected');
  } catch (err) {
    console.log('error encountered')
    process.exit(1);
  }
}

module.exports = connectToDB;