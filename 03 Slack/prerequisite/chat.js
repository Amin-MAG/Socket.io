const express = require('express');
const socketio = require('socket.io')

const app = express();

app.use(express.static(__dirname + '/public'))

const server = app.listen(8000);

const io = socketio(server);

io.on('connect', (socket, req) => {
    socket.join('level1')
    io.of('/').to('level1').emit('joined', {
        text: `${socket.id} says i have joined to the level1 room.`
    });
});

io.of('/admin').on('connect', (socket, req) => {
    io.of('/admin').emit('welcome', "Here is some stuff for admins");
});