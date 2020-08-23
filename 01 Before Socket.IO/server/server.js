const http = require('http');
const websocket = require('ws');

const HOSTNAME = '127.0.0.1';
const PORT = 3000;


const server = http.createServer((req, res) => {
    console.log("Server Created.");
    res.end("HelloWorld");
});

// WebSocket

const wss = new websocket.Server({server});

wss.on('headers', (headers, req) => {
    console.log("Header: " + headers);
    console.log("Req: " + req);
});

wss.on('connection', (ws, req) => {
    // Send meesage from the server.
    ws.send("Here is a message from the server!");
    // Listener for recieving
    ws.on('message', (msg) => {
        console.log(msg);
    });
});

// Run server

server.listen(PORT, HOSTNAME, () => {
    console.log("Server Listening On " + HOSTNAME + ":" + PORT + ".");
});