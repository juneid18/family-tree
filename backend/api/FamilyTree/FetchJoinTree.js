const mongoose = require("mongoose");
const FamilyTree = require("../../model/FamilyTreeModel");

async function FetchFamilyTree(req, res) {
  try {
    const { JoinedTree } = req.body;
    if (!JoinedTree) {
        return res.status(400).json({
          success: false,
          message: 'No data provided',
        });
      }
      const existingTree = await FamilyTree.find({ _id: JoinedTree });
      
      if (existingTree && existingTree.length > 0) {
        return res.status(200).json({
          success: true,
          message: 'Family tree retrieved successfully',
          UserTree: existingTree,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Family tree does not exist',
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
