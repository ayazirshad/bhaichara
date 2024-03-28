const express = require("express");
const {
  createMessage,
  getMessages,
} = require("../controllers/messageControllers");
const router = express.Router();

router.post("/create", createMessage);
router.get("/get/:chatId", getMessages);

module.exports = router;
