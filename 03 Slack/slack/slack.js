// Imports
const express = require('express');
const socketio = require('socket.io')
const channels = require('./data/channels');

// NodeJs Express initialize
const app = express();

app.use(express.static(__dirname + '/public'))

// Server initialize
const server = app.listen(8000);

// Socket initialize
const io = socketio(server);

// Listen for root socket
io.on('connect', (socket, req) => {
    // Send back namespaces and their details
    let nsData = channels.map((ns) => {
        return {
            image: ns.image,
            endpoint: ns.endpoint,
        };
    })
    // Send namespace data to the socket
    socket.emit('nsList', nsData);
});

// Iterate and listen for connection
channels.forEach((namespace) => {
    io.of(namespace.endpoint).on('connect', (nsSocket) => {
        console.log(`${nsSocket.id} has joined ${namespace.title}`);
        // Socket connected so send the namespace details
        nsSocket.emit('nsRooms', channels[0].rooms);
        // Listen for user request to join to a room
        nsSocket.on('join_room', (roomName, getDataCallback) => {
            console.log(`User has been joined to the ${roomName}`);
            // Join to the room
            nsSocket.join(roomName);
            // Callback that update room and user count
            io.of('/wiki').to(roomName).clients((err, clients) => {
                getDataCallback({
                    numberOfUsers: clients.length,
                });
            });
        });
        // Received messages from the server
        nsSocket.on('message_to_server', (data) => {
            console.log("Received a message from client.")
            let fullData = {
                text: data.text,
                username: data.username,
                time: getTime(),
                avatar: 'https://via.placeholder.com/30',
            }
            // Send this message to the all of the clients in this room
            let roomTitle = Object.keys(nsSocket.rooms)[1];
            const nsRoom = channels[0].rooms.find((room) => {
                return room.title === roomTitle;
            });
            nsRoom.addMessage(fullData);
            io.of('/wiki').to(roomTitle).emit('message_to_clients', fullData);
        });
    });
});

function getTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return hours + ':' + minutes + ' ' + ampm;
}