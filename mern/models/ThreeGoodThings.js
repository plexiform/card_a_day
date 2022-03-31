const mongoose = require('mongoose');

const ThreeGoodThingsSchema = mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  first: {
    goodThing: {
      type: String,
      required: true
    },
    cause: {
      type: String,
      required: true
    },
  },
  second: {
    goodThing: {
      type: String,
      required: true
    },
    cause: {
      type: String,
      required: true
    },
  },
  third: {
    goodThing: {
      type: String,
      required: true
    },
    cause: {
      type: String,
      required: true
    },
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Dashboard = mongoose.model('threegoodthings', ThreeGoodThingsSchema);