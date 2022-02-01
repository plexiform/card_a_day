const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  public: {
    type: Boolean,
    default: false
  }
})

module.exports = User = mongoose.model('user', UserSchema);