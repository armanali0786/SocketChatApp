const Message = require('../models/message');
const { Op } = require('sequelize');

const saveMessage = async (data) => {
    try {
        const newMessageData = {
            message: data.message,
            senderId: data.sender.id,
            receiverId: data.receiver.id,
            timestamp: new Date(),
        };

        if (data.replyMessage) {
            newMessageData.replyMessage = data.replyMessage.message;
        }
        if (data.audioUrl) {
            newMessageData.audioUrl = data.audioUrl;
        }
        const savedMessage = await Message.create(newMessageData);
        return savedMessage.toJSON();
    } catch (error) {
        console.log(error);
        // return res.status(500).json({ error: 'An error occurred while saving the message' });
    }
};


const getMessage = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({
                msg: "Id is required"
            })
        }
        const allMessages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: id },
                    { receiverId: id }
                ]
            },
            attributes: ['id', 'message', 'senderId','audioUrl', 'receiverId', 'replyMessage', 'timestamp']// Include timestamp in the response
        })
        return res.status(200).json({
            data: allMessages,
            message: "All Messages"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred while getting  message' });
    }

}

const deleteMessage = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({
                msg: "Id is required"
            });
        }

        const message = await Message.findByPk(id);

        if (!message) {
            return res.status(404).json({
                msg: "Message not found"
            });
        }

        await message.destroy();

        return res.status(200).json({
            data: message,
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'An error occurred while deleting the message' });
    }
};


module.exports = {
    saveMessage,
    getMessage,
    deleteMessage
};