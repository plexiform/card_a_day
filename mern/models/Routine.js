const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const RoutineSchema = new mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  routineItems: {
    gratitude: {
      type: String,
      required: true
    },
    values: [{
      type: String,
      required: true
    }],
    value_affirmation: {
      type: String,
      required: true
    },
    type_of_meditation: {
      type: String,
      required: true
    },
    minutes_spent: {
      type: Number,
      required: true
    },
    completed_fast: {
      type: Boolean
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
});

module.exports = Routine = mongoose.model('routine', RoutineSchema);