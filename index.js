const express = require('express');
const dotenv = require('dotenv')
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const PORT = process.env.PORT || 5000
dotenv.config();
connectDB();
const app = express();

app.use(express.json());    // To use JSON Data
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// Deployment
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    });
}


// Error Handling middleware
app.use(notFound)
app.use(errorHandler)



const server = app.listen(PORT, () => { console.log(`Server running at port ${PORT}`) })
const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    });

    socket.on('join chat', (room) => {
        socket.join(room);

    })

    socket.on('typing', (room) => socket.in(room).emit('typing'))
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'))

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        });
    })
    socket.on('leave', (room) => {
        socket.leave(room);
    })
    socket.off('setup', () => {
        socket.leave(userData._id)
    })
})

