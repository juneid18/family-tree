const mongoose = require("mongoose");
const FamilyTree = require("../../model/FamilyTreeModel");

async function FetchTreeById(req, res) {
  try {
    const { treeId } = req.body;
    if (!treeId) {
        return res.status(400).json({
          success: false,
          message: 'No data provided',
        });
      }
      const existingTree = await FamilyTree.findById(treeId);
      if(existingTree){
        return res.status(200).json({
            success: true,
            message: 'Tree exists',
            UserTree: existingTree
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

module.exports = FetchTreeById;
