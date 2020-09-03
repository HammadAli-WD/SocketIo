const MessageModel = require("../schema/messages")

const addMessage = async (message, sender) => {
  try {
    const newMessage = new MessageModel({ text: message, sender })
    const savedMessage = await newMessage.save()
    return savedMessage
  } catch (error) {
    console.log(error)
  }
}

module.exports = addMessage