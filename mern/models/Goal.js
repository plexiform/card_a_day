const mongoose = require('mongoose');

const GoalSchema = mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  goalName: {
    type: String,
    required: true,
  },
  goalTags: {
    type: [mongoose.Schema.ObjectId]
  }
})

module.exports = Goal = mongoose.model('goal', GoalSchema);