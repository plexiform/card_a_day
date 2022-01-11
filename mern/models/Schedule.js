const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  timeBlock: {
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    pomoLength: {
      type: Number,
      required: true
    },
    breakLength: {
      type: Number,
      required: true
    },
    numPomos: {
      type: Number,
      required: true
    },
    maxPomos: {
      type: Number,
      required: true
    },
    goal: {
      type: String
    }
  },
  percentPomos: {
    type: Number,
  },
  finished: {
    type: Boolean
  }
})

module.exports = Schedule = mongoose.model('schedule', ScheduleSchema);