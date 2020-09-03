const http = require('http');
const express = require('express');

const socketio = require('socket.io');
const mongoose = require('mongoose');

const server = express();
const httpServer = http.createServer(server);

const io = socketio(httpServer);

var onlineUsers = [];

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('setUsername', (username) => {
    onlineUsers.push({ ...username, id: socket.id });

    const usernames = onlineUsers.map((user) => user.username);

    io.emit('online', usernames);
  });

  socket.on('sendMessage', (message) => {
    const socketId = onlineUsers.find((user) => user.username === message.to);

    io.to(socketId.id).emit('message', message);
  });

  socket.on('reportUser', (user) => {
    onlineUsers.filter((user) => user.username !== user.name);
  });
});

const port = process.env.PORT;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dn7fa.mongodb.net/${process.env.DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    httpServer.listen(port, () => {
      console.log(`Server running port { ${port} }`);
    })
  )
  .catch((err) => console.log(err));




/* const http = require ('http')
const express = require("express")
const socketio = require("socket.io")
const mongoose = require("mongoose")

const addMesg = mongoose.model('Message',{
    name : String,
    message : String
  })

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const users = []

io.on('connection', (socket) => {
console.log("New WebSocket connection ", socket.id)

socket.on('chat message', function(data){
    io.to(people[data.receiver]).emit('chat message', data.msg)
})
socket.on('setUsername', (username) => {
  onlineUsers.push({ ...username, id: socket.id });

  const usernames = onlineUsers.map((user) => user.username);

  io.emit('online', usernames);
});

socket.on('sendMessage', (message) => {
  const socketId = onlineUsers.find((user) => user.username === message.to);

  io.to(socketId.id).emit('message', message);
});

socket.on('reportUser', (user) => {
  onlineUsers.filter((user) => user.username !== user.name);
});

})

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err)) */


