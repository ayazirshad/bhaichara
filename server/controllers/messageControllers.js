const messageModel = require("../schema/messageSchema");

const createMessage = async (req, res) => {
  try {
    const { senderId, chatId, text } = req.body;
    const message = new messageModel({ senderId, chatId, text });
    const createdMessage = await message.save();
    res.status(200).json(createdMessage);
  } catch (error) {
    console.log(error);
    resizeBy.status(500).json(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await messageModel.find({ chatId });
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    resizeBy.status(500).json(error);
  }
};

module.exports = { createMessage, getMessages };
