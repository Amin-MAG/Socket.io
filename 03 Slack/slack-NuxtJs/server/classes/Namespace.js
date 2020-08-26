class Namespace {

    constructor(namespaceId, title, image, endpoint) {
        this.namespaceId = namespaceId;
        this.title = title;
        this.image = image;
        this.endpoint = endpoint;
        this.rooms = []
    }

    addRoom(room) {
        this.rooms.push(room);
    }

}

module.exports = Namespace;