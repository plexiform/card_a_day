const mongoose = require('mongoose');

const DeadlineSchema = mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  deadline: {
    type: String,
    default: '09:00'
  },
  timePosted: {
    type: Date
  }
})

module.exports = Dashboard = mongoose.model('deadline', DeadlineSchema);
