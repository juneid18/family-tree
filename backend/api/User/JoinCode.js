const mongoose = require("mongoose");
const User = require("../../model/UserModel");
const FamilyTree = require('../../model/FamilyTreeModel')

async function JoinCode(req, res) {
  try {
    const { JoinCode, email } = req.body;
    if (!JoinCode) {
      return res.status(400).json({
        success: false,
        message: "Join Code is not provided",
      });
    }
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const familyTree = await FamilyTree.findOne({ joinCode: JoinCode });
    if (!familyTree) {
      return res.status(404).json({
        success: false,
        message: "Invalid join code",
      });
    }
    // Add family tree reference to the user's "JoinedTree" if not already joined
    if (!existingUser.JoinedTree.includes(familyTree._id)) {
      existingUser.JoinedTree.push(familyTree._id);
      await existingUser.save(); // Save the user data
    }
    if (!familyTree.members.includes(existingUser.name)) {
      familyTree.members.push(existingUser.name);
      await familyTree.save(); // Save the member data
    }
    return res.status(200).json({
        success: true,
        message: 'Successfully joined the family tree',
        familyTree: familyTree._id,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
}

module.exports = JoinCode;
