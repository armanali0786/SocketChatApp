const socket = require("socket.io");
const { saveMessage } = require("../controller/message");

const onlineUsers = [];

const addUser = (user, socketId) => {
    const userExists = onlineUsers.findIndex((item) => item.id === user.id);
    if (userExists !== -1) {
        onlineUsers.splice(userExists, 1);
    }
    user.socketId = socketId;
    onlineUsers.push(user);
}

const removeUser = (socketId) => {
    const isExists = onlineUsers.findIndex((item) => item.socketId === socketId);
    if (isExists !== -1) {
        onlineUsers.splice(isExists, 1);
    }
}

const socketInit = (server) => {
    const io = socket(server, {
        cors: {
            origin: 'http://localhost:3000',
        }
    });

    io.on('connection', (socket) => {
        socket.on('ADD_USER', (user) => {
            addUser(user, socket.id);
            io.emit("USER_ADDED", onlineUsers);
        });
        socket.on('SEND_MESSAGE', async (message) => {
            const isSaved = await saveMessage(message);
            socket
                .to(message.receiver.socketId)
                .to(message.sender.socketId)
                .emit("RECEIVE_MESSAGE", isSaved)
        });
        socket.on('DELETE_MESSAGE', (message) => {
            socket.to(message.receiver.socketId).emit("DELETED_MESSAGE", message)
        });
        socket.on('TYPING', (user) => {
            socket.broadcast.emit('TYPING', user);
        });

        socket.on('STOP_TYPING', (user) => {
            socket.broadcast.emit('STOP_TYPING', user);
        });
        socket.on('disconnect', () => {
            removeUser(socket.id);
            io.emit("USER_ADDED", onlineUsers);
            socket.broadcast.emit('USER_LEFT', onlineUsers);
        });

    });
}

module.exports = socketInit;