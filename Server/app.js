require('dotenv').config();

const express = require('express');
const app = express();
const Users = require('./models/Users');


const cors = require('cors');
const userRouter = require('./routes/api');
const io = require('socket.io')(process.env.SOCKET_PORT, {
    cors: {
        origin: process.env.FRONTEND_LINK,
    }
})
//Connect DB
require('./db/connection');

// Import  files

const port = process.env.PORT || 8000;

//socket io
let users = [];
io.on('connection', socket => {
    console.log('user Connected', socket.id);
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
        }

    })
    socket.on('sendMessage', async ({ senderId, receiverId, message, conversationId }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        const user = await Users.findById(senderId);
        if (receiver) {
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            })
        } else {
            io.to(sender.socketId).emit('getMessage', {
                senderId,
                message,
                conversationId,
                receiverId,
                user: { id: user._id, fullName: user.fullName, email: user.email }
            })
        }

    })
    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    })
})



//app use
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//Routes
app.use('/api', userRouter);

app.listen(port, () => {
    console.log('listening on port ' + port);
})