const mongoose = require("mongoose");

// Function to generate a random join code
const generateRandomCode = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const FamilyTreeSchema = new mongoose.Schema({
  treeName: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  main_parent: [
    {
      type:String,
      default:'default Parent'
    }
  ],
  thumbnail: {
    type: String,
    default: 'default Thumbnail',
  },
  createdBy: {
    type: String,
    default: null,
  },
  members: [
    {
      type: String,
      ref: "FamilyMember",
      default: null,
    },
  ],
  event: [
    {
      eventName: {
        type: String,
        default: null,
      },
      eventdescription: {
        type: String,
        default: null,
      },
      eventCreatedAt: { 
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  joinCode: {
    type: String,
    unique: true, // Ensure join codes are unique
    default: generateRandomCode, // Use the function to generate a default code
  },
});

// Pre-save middleware to generate a join code if it doesn't already exist
FamilyTreeSchema.pre('save', function(next) {
  if (!this.joinCode) {
    this.joinCode = generateRandomCode(); // Generate a new code if not set
  }
  next();
});

const FamilyTree = mongoose.model("FamilyTree", FamilyTreeSchema);

module.exports = FamilyTree;
