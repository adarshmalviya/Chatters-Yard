const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const messageSchema = mongoose.Schema({
    sender: {
        type: ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        trim: true
    },
    chat: {
        type: ObjectId,
        ref: "Chat"
    }
}, { timestamps: true })

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;