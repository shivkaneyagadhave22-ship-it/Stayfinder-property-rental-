const Message = require("../models/Message");
const User = require("../models/User");

// ========================================
// GET ALL PROPERTY OWNERS
// ========================================

const getOwners = async (req, res) => {
  try {
    const owners = await User.find(
      { role: "owner" },
      "name email role"
    );

    res.json({
      success: true,
      count: owners.length,
      data: owners,
    });
  } catch (error) {
    console.error("Get Owners Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch property owners",
    });
  }
};


// ========================================
// GET ALL TENANTS
// ========================================

const getTenants = async (req, res) => {
  try {
    const tenants = await User.find(
      { role: "tenant" },
      "name email role"
    );

    res.json({
      success: true,
      count: tenants.length,
      data: tenants,
    });
  } catch (error) {
    console.error("Get Tenants Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch tenants",
    });
  }
};


// ========================================
// SEND MESSAGE
// ========================================

const sendMessage = async (req, res) => {
  try {
    const {
      sender,
      receiver,
      message,
      property,
    } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({
        success: false,
        message: "Sender, receiver and message are required",
      });
    }

    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      property: property || null,
    });

    const populatedMessage =
      await Message.findById(newMessage._id)
        .populate("sender", "name email role")
        .populate("receiver", "name email role");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: populatedMessage,
    });

  } catch (error) {
    console.error("Send Message Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};


// ========================================
// GET CHAT BETWEEN TWO USERS
// ========================================

const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await Message.find({
      $or: [
        {
          sender: user1,
          receiver: user2,
        },
        {
          sender: user2,
          receiver: user1,
        },
      ],
    })
      .populate("sender", "name email role")
      .populate("receiver", "name email role")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });

  } catch (error) {
    console.error("Get Messages Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};


// ========================================
// EXPORT
// ========================================

module.exports = {
  getOwners,
  getTenants,
  sendMessage,
  getMessages,
};