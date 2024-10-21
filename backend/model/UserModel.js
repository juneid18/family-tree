const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  phone: {
    type: String,
    default: null, // Default to null if not provided
  },
  DOB: {
    type: String,
    default: null, // Default to null if not provided
  },
  gender: {
    type: String,
    default: null, // Default to null if not provided
  },
  relationshipStatus: {
    type: String,
    default: null, // Default to null if not provided
  },
  address: {
    type: String,
    default: null, // Default to null if not provided
  },
  bio: {
    type: String,
    default: null, // Default to null if not provided
  },
  profile_img: {
    type: String,
    default: null, // Default to null if not provided
  },
  JoinedTree: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FamilyMember',
    }
  ],
  IsAdmin: {
    type: Boolean,
    default: false, // Default to null if not provided
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
