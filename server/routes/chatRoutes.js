const express = require("express");
const {
  createChat,
  findUserChats,
  findChat,
} = require("../controllers/chatControllers");
const router = express.Router();

router.post("/create", createChat);
router.get("/get/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
