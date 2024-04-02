const chatModel = require("../schema/chatSchema");

const createChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.body;

    const foundChat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    console.log("foundChat", foundChat);
    if (foundChat) return res.status(200).json(foundChat);
    const chat = new chatModel({ members: [firstId, secondId] });
    const createdChat = await chat.save();
    res.status(200).json(createdChat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  try {
    const { firstId, secondId } = req.params;
    const chat = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createChat, findUserChats, findChat };
