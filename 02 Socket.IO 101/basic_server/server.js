const http = require('http');
const socketio = require('socket.io')

const server = http.createServer((req, res) => {
    console.log("Server Created.")
    res.end("HelloWorld!");
});

const io = socketio(server);

io.on('connection', (socket, req) => {
    // Here we have emit
    socket.emit('welcome', {
        data: "This is a message from the server to the clients."
    });
    // No change here
    socket.on('client_message', (msg) => {
        console.log(msg);
    });
});

server.listen(8000);