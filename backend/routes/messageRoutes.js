const express = require("express");

const router = express.Router();

const {
  getOwners,
  getTenants,
  sendMessage,
  getMessages,
} = require("../controllers/messageController");


// ========================================
// GET ALL PROPERTY OWNERS
// ========================================

router.get("/owners", getOwners);


// ========================================
// GET ALL TENANTS
// ========================================

router.get("/tenants", getTenants);


// ========================================
// SEND MESSAGE
// ========================================

router.post("/", sendMessage);


// ========================================
// GET CHAT BETWEEN TWO USERS
// ========================================

router.get("/:user1/:user2", getMessages);


module.exports = router;