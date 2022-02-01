const mongoose = require('mongoose');

const JournalSchema = mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  journalEntry: {
    type: String,
    required: true
  },
  values: {
    type: [String]
  },
  date: {
    type: Date,
    required: true
  }
})

module.exports = Journal = mongoose.model('journal', JournalSchema);