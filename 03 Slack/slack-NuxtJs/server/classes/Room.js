class Room {

    constructor(roomId, title, namespace, isPrivate = false) {
        this.roomId = roomId;
        this.title = title;
        this.namespace = namespace;
        this.isPrivate = isPrivate;
        this.chat_history = [];
    }

    addMessage(message) {
        this.chat_history.push(message);
    }

    clearHistory() {
        this.chat_history = [];
    }

}

module.exports = Room;