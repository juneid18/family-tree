const mongoose = require("mongoose");
const FamilyTree = require("../../model/FamilyTreeModel");

async function AddEvent(req, res) {
  try {
    const { treeId, event } = req.body;
    if (!treeId || !event) {
      return res.status(400).json({
        success: false,
        message: "No data provided",
      });
    }
    const existingFamilyTree = await FamilyTree.findById(treeId);
    if (!existingFamilyTree) {
      return res.status(404).json({
        success: false,
        message: "No family tree found with the provided treeId",
      });
    }
    // If the family tree exists, save the event
    existingFamilyTree.event.push(event); // Assuming `events` is an array in your FamilyTree schema
    const savedFamilyTree = await existingFamilyTree.save();

    res.status(200).json({
      success: true,
      message: "Event is Created",
      data: savedFamilyTree,
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

module.exports = AddEvent;
