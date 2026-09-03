const express = require("express");

const router = express.Router();

const {
  addProperty,
  getProperties,
  getOwnerProperties,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");


// ========================================
// ADD PROPERTY
// ========================================

router.post("/", addProperty);


// ========================================
// GET ALL PROPERTIES
// ========================================

router.get("/", getProperties);


// ========================================
// GET PROPERTIES OF ONE OWNER
// ========================================

router.get("/owner/:ownerId", getOwnerProperties);


// ========================================
// UPDATE PROPERTY
// ========================================

router.put("/:id", updateProperty);


// ========================================
// DELETE PROPERTY
// ========================================

router.delete("/:id", deleteProperty);


module.exports = router;