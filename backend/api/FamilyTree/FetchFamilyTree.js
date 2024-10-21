const mongoose = require("mongoose");
const FamilyTree = require("../../model/FamilyTreeModel");

async function FetchFamilyTree(req, res) {
  try {
    const { createdBy } = req.body;
    if (!createdBy) {
        return res.status(400).json({
          success: false,
          message: 'No data provided',
        });
      }
      const existingUser = await FamilyTree.find({createdBy});
      if(existingUser){
        return res.status(200).json({
            success: true,
            message: 'User exists and its family tree too',
            UserTree: existingUser
        });
      }else{
        return res.status(400).json({
            success: false,
            message: 'Family tree not exist',
        });
      }

  } catch (error) {
    console.error("Error occurred while saving to DB:", error); // Log detailed error
    return res.status(400).json({
      status: false,
      success: false,
      message: `catch an error , ${error.message}`,
    });
  }
}

module.exports = FetchFamilyTree;
