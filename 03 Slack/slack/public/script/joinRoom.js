function joinRoom(roomName) {
    // Send the room name to the server.
    nsSocket.emit('join_room', roomName, (data) => {
        // Update the room and show messages
        let numberOfUsersElement = document.querySelector('.curr-room-num-users');
        numberOfUsersElement.innerHTML = `${data.numberOfUsers}`;
    });
}