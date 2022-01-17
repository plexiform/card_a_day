const mongoose = require('mongoose');

const JournalSchema = mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  journalEntry: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})