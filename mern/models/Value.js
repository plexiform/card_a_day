const mongoose = require('mongoose');

const ValueSchema = new mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  valueAndReason: {
    value: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      required: true
    }
  }
});

module.exports = Value = mongoose.model('value', ValueSchema);