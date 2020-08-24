function joinNamespace(endpoint) {
    // Listen for namespace details
    nsSocket = io(`http://localhost:8000${endpoint}`);
    nsSocket.on('nsRooms', (nsRooms) => {
        console.log("Rooms' list has been received.")
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
                console.log(`Some one clicked on ${e.target.innerText} room.`);
            });
        });
        // Grab the first room
        const topRoomName = document.querySelector('.room').innerText;
        joinRoom(topRoomName);
    });
    // Listen for new messages from server
    nsSocket.on('message_to_clients', (data) => {
        console.log(data.text);
        let newMessage = buildNewMessage(data);
        let messagesDiv = document.querySelector('#messages');
        messagesDiv.innerHTML += newMessage;
    });
    // Set on submit to send message to the server
    document.querySelector('.message-form').addEventListener('submit', (e) => {
        console.log("Submmited: Some message has been sent to server.")
        e.preventDefault();
        const inputMessageElement = document.querySelector('#user-message');
        const message = inputMessageElement.value;
        inputMessageElement.value = "";
        nsSocket.emit('message_to_server', {
            text: message,
            username: "rbunch"
        });
    });
}

function buildNewMessage(data) {
    return `
           <li class="col-12">
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