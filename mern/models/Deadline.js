const mongoose = require('mongoose');

const DeadlineSchema = mongoose.Schema({
  userId: mongoose.Schema.ObjectId,

})

module.exports = Dashboard = mongoose.model('deadline', DeadlineSchema);
