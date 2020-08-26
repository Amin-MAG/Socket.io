// Imports
const express = require('express');
const socketio = require('socket.io')
const channels = require('./data/channels');

// NodeJs Express initialize
const app = express();

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
        const username = nsSocket.handshake.query.username;
        // Socket connected so send the namespace details
        nsSocket.emit('nsRooms', namespace.rooms);
        // Listen for user request to join to a room
        nsSocket.on('join_room', (roomName, getDataCallback) => {
            // Grab the first room as default value for room
            let roomToLeave = Object.keys(nsSocket.rooms)[1];
            // Left current room first (**)
            nsSocket.leave(roomToLeave);
            updateUsersInRoom(namespace, roomToLeave);
            // Join to the room
            nsSocket.join(roomName);
            // Fetch histories from server each time someone join
            const nsRoom = namespace.rooms.find((room) => {
                return room.title === roomName;
            });
            nsSocket.emit('room_histories', nsRoom.chat_history);
            // Update number of members online in the room
            updateUsersInRoom(namespace, roomName);
        });
        // Received messages from the server
        nsSocket.on('message_to_server', (data) => {
            // Provide full data in the server
            let fullData = {
                text: data.text,
                username,
                time: getTime(),
                avatar: 'https://via.placeholder.com/30',
            }
            // Send this message to the all of the clients in this room
            let roomTitle = Object.keys(nsSocket.rooms)[1];
            const nsRoom = namespace.rooms.find((room) => {
                return room.title === roomTitle;
            });
            if (nsRoom) {
                nsRoom.addMessage(fullData);
            }
            io.of(namespace.endpoint).to(roomTitle).emit('message_to_clients', fullData);
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

function updateUsersInRoom(namespace, roomName) {
    io.of(namespace.endpoint).to(roomName).clients((err, clients) => {
        io.of(namespace.endpoint).to(roomName).emit('update_chatroom', {
            roomName,
            numberOfUsers: clients.length,
        });
    });
}