const mongoose = require("mongoose");
const FamilyTree = require('../../model/FamilyTreeModel')

async function FamilyTreeAPI(req,res) {
    try {
        const TreeData = req.body;
        if (!TreeData) {
            return res.status(400).json({
              success: false,
              message: 'No data provided',
            });
          }

          const NewTree = new FamilyTree(TreeData);
          const SaveTree = await NewTree.save();

          res.status(200).json({
            success: true,
            message: 'Tree is Created',
            data: SaveTree,
          });
    } catch (error) {
        console.error("Error occurred while saving to DB:", error); // Log detailed error
        return res.status(400).json({
            status: false,
            success: false,
            message: `catch an error , ${error.message}`,
          });
    }
}

module.exports = FamilyTreeAPI;