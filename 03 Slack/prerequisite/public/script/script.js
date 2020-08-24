const socket = io('http://localhost:8000');
const adminSocket = io('http://localhost:8000/admin');


socket.on('new_message_to_clients', (data) => {
    console.log(data)
    document.querySelector('#messages').innerHTML += `<li class="list-group-item"><p>${data.text}</p></li>`;
});

socket.on('joined', (data) => {
    console.log(data.text);
});

document.querySelector("#message-form").addEventListener('submit', (event) => {
    event.preventDefault();
    const msg = document.querySelector('#user-message').value;
    socket.emit('new_message_to_server', {
        text: msg
    });
});
