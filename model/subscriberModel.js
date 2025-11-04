const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  subscribed: { type: Boolean, default: true },

  subscribedAt: {
    type: Date,
    default: Date.now(),
  },
});

subscriberSchema.methods.generateUnsubscribeToken = function () {
  return jwt.sign({ email: this.email }, process.env.UNSUBSCRIBE_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = mongoose.model('Subscriber', subscriberSchema);
