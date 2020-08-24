const express = require('express');
const socketio = require('socket.io')

const app = express();

app.use(express.static(__dirname + '/public'))

const server = app.listen(8000);

const io = socketio(server);

io.on('connect', (socket, req) => {
    // socket.emit('data_from_server', {
    //     data: "Data from server!"
    // });
    // socket.on('data_from_client', (data) => {
    //     console.log(data);
    // });
    socket.on('new_message_to_server', (data) => {
        io.emit('new_message_to_clients', {
            text: data.text
        });
    });
});