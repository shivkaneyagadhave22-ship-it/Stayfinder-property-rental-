const Property = require("../models/Property");

// ========================================
// ADD PROPERTY
// ========================================

const addProperty = async (req, res) => {
  try {
    const {
      owner,
      title,
      location,
      rent,
      area,
      bedrooms,
      bathrooms,
      propertyType,
      furnishing,
      description,
      image,
    } = req.body;

    // Required fields check
    if (
      !owner ||
      !title ||
      !location ||
      !rent ||
      !area ||
      bedrooms === undefined ||
      bathrooms === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required property fields",
      });
    }

    // Create property
    const property = await Property.create({
      owner,
      title,
      location,
      rent,
      area,
      bedrooms,
      bathrooms,
      propertyType: propertyType || "Apartment",
      furnishing: furnishing || "Furnished",
      description: description || "",
      image: image || "",
    });

    // Populate owner information
    const populatedProperty = await Property.findById(property._id)
      .populate("owner", "name email role");

    res.status(201).json({
      success: true,
      message: "Property added successfully",
      data: populatedProperty,
    });
  } catch (error) {
    console.error("Add Property Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add property",
    });
  }
};


// ========================================
// GET ALL PROPERTIES
// ========================================

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Get Properties Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch properties",
    });
  }
};


// ========================================
// GET OWNER PROPERTIES
// ========================================

const getOwnerProperties = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const properties = await Property.find({
      owner: ownerId,
    })
      .populate("owner", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("Get Owner Properties Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch owner properties",
    });
  }
};


// ========================================
// UPDATE PROPERTY
// ========================================

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email role");

    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty,
    });
  } catch (error) {
    console.error("Update Property Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update property",
    });
  }
};


// ========================================
// DELETE PROPERTY
// ========================================

const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProperty =
      await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Delete Property Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete property",
    });
  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  addProperty,
  getProperties,
  getOwnerProperties,
  updateProperty,
  deleteProperty,
};