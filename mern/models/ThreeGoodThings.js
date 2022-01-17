const mongoose = require('mongoose');

const ThreeGoodThingsSchema = mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  threeGoodThings: {
    type: [String],
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})