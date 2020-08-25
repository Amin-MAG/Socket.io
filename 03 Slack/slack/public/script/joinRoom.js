function joinRoom(roomName) {
    // Send the room name to the server.
    nsSocket.emit('join_room', roomName);
    // Listen to get room histories from the server
    nsSocket.on('room_histories', (histories) => {
        // Update the message page
        let messagesDiv = document.querySelector('#messages');
        messagesDiv.innerHTML = "";
        histories.forEach((message) => {
            let newMessage = buildNewMessage(message);
            messagesDiv.innerHTML += newMessage;
        });
        // Scroll to the bottom of the list
        messagesDiv.scrollTo(0, messagesDiv.scrollHeight);
    });
    // Listen to update the changes when someone joins.
    nsSocket.on('update_chatroom', (information) => {
        // Update the room and show messages
        let numberOfUsersElement = document.querySelector('.curr-room-num-users');
        numberOfUsersElement.innerHTML = `${information.numberOfUsers}`;
        let roomNameElement = document.querySelector('.curr-room-text');
        roomNameElement.innerHTML = `${information.roomName}`;
    });
    // Search box
    let searchElement = document.querySelector('#search-box');
    searchElement.addEventListener('input', (e) => {
        console.log(e.target.value);
        // Search stuff
        let messages = Array.from(document.getElementsByClassName('message_item'));
        messages.forEach((message) => {
            let text = message.querySelector('.message-text').innerText.toLowerCase();
            if (text.indexOf(e.target.value.toLowerCase()) === -1) {
                message.style.display = 'none';
            } else {
                message.style.display = 'flex';
            }
        });
        // Scroll to the bottom of the list
        let messagesDiv = document.querySelector('#messages');
        messagesDiv.scrollTo(0, messagesDiv.scrollHeight);
    });
}