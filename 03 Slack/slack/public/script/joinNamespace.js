function joinNamespace(endpoint) {
    // Check if it is in a namespace if it is then close  (**)
    if (nsSocket) {
        // Remove Socket
        // ?!
        nsSocket.close();
        // Remove event listener
        document.querySelector('#user-input').removeEventListener('submit', formSubmission);
    }
    // Listen for namespace details
    nsSocket = io(`http://localhost:8000${endpoint}`, {
        query: {
            username,
        },
    });
    nsSocket.on('nsRooms', (nsRooms) => {
        // Update rooms
        let roomsListDiv = document.querySelector('.room-list');
        roomsListDiv.innerHTML = ""
        nsRooms.forEach((room) => {
            let icon = room.isPrivate ? "fa-lock" : "fa-globe-americas";
            let newRoomItem = `<li class="room mt-3"><i class="pr-2 fas ${icon}"></i>${room.title}</li>`;
            roomsListDiv.innerHTML += newRoomItem;
        });
        // Set click listener for room nodes.
        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach((element) => {
            element.addEventListener('click', (e) => {
                let roomName = e.target.innerText;
                joinRoom(roomName);
            });
        });
        // Grab the first room as default value for room
        const topRoomName = document.querySelector('.room').innerText;
        joinRoom(topRoomName);
    });
    // Listen for new messages from server
    nsSocket.on('message_to_clients', (data) => {
        let newMessage = buildNewMessage(data);
        let messagesDiv = document.querySelector('#messages');
        messagesDiv.innerHTML += newMessage;
        messagesDiv.scrollTo(0, messagesDiv.scrollHeight);
    });
    // Set on submit to send message to the server
    document.querySelector('.message-form').addEventListener('submit', formSubmission);
}

function formSubmission(e) {
    e.preventDefault();
    const inputMessageElement = document.querySelector('#user-message');
    const message = inputMessageElement.value;
    inputMessageElement.value = "";
    nsSocket.emit('message_to_server', {
        text: message,
    });
}


function buildNewMessage(data) {
    return `
           <li class="message_item col-12">
                    <div class="user-image">
                        <img src="${data.avatar}"/>
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">
                            ${data.username}<span class="ml-2">${data.time}</span>
                        </div>
                        <div class="message-text">${data.text}</div>
                    </div>
                </li>
           `;
}