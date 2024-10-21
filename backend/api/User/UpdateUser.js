const mongoose = require("mongoose");
const User = require("../../model/UserModel");

async function UpdateUser(req, res) {
  try {
    const userData = req.body;

    // Validate if the user data and ID are provided
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "No data or user ID provided",
      });
    }

    const userID = { email: userData.uniqe };

    // Check if the user exists before updating
    const existingUser = await User.findOne(userID);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only update the fields that can be changed
    const updateData = { ...userData };
    // Exclude the 'uniqe' field to prevent unintended changes
    delete updateData.uniqe;

    // // Check for email duplication if the email is being changed
    // if (updateData.email && updateData.email !== existingUser.email) {
    //   const emailExists = await User.findOne({ email: updateData.email });
    //   if (emailExists) {
    //     return res.status(400).json({
    //       success: false,
    //       message: existingUser,
    //     });
    //   }
    // }

    // Update the user with new data
    const updateResult = await User.updateOne(userID, { $set: updateData });

    if (updateResult.modifiedCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No changes were made to the user",
        data: updateResult,
      });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updateResult,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `An error occurred: ${error.message}`,
    });
  }
}
module.exports = UpdateUser;