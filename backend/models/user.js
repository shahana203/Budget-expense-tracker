const mongoose = require('mongoose'); // Import mongoose

// Define the structure of User data
const UserSchema = new mongoose.Schema({
  name: {
    type: String,        // User's name will be text
    required: true       // This field is required (can't be empty)
  },
  email: {
    type: String,
    required: true,
    unique: true         // Each email must be unique (no duplicates)
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Export the model so we can use it in other files
module.exports = mongoose.model('User', UserSchema);
