<template>
  <div class="container-fluid">
    <div class="row">

      <NamespaceMenu :namespaces="namespaces" :onNamespaceClicked="onNamespaceClicked"/>

      <RoomMenu :nsRooms="nsRooms" :onRoomClicked="onRoomClicked"/>

      <div class="chat-panel col-8">
        <div class="room-header row">
          <div class="col-6">
            <span class="curr-room-text">{{ chat.roomName }}</span>
            <span class="ml-1 curr-room-num-users">{{ chat.numberOfOnlineUsers }}</span>
            <i class="fas fa-user curr-room-num-users"></i>
          </div>
          <div class="col-6 search pull-right">
            <span><i class="fas fa-search"></i></span>
            <input v-model="chat.currentSearchText"
                   @input="chat.shouldScrollDown = true" type="text"
                   id="search-box" placeholder="Search"/>
          </div>
        </div>
        <div class="message-form">
          <form id="user-input" @submit.prevent="sendMessageToServer">
            <input v-model="chat.currentText" id="user-message" type="text" placeholder="Enter your message"/>
          </form>
        </div>
        <ul id="messages" ref="chat_box" class="row mt-5">

          <li v-for="message in chat.chatHistory"
              v-if="searchString(message.text, chat.currentSearchText)"
              class="message_item col-12">
            <div class="user-image">
              <img :src="message.avatar"/>
            </div>
            <div class="user-message">
              <div class="user-name-time">
                {{ message.username }}<span class="ml-2">{{ message.time }}</span>
              </div>
              <div class="message-text">{{ message.text }}</div>
            </div>
          </li>

        </ul>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      // User info
      userInfo: {
        username: undefined,
      },
      // Chat data
      chat: {
        roomName: "",
        numberOfOnlineUsers: 0,
        chatHistory: [],
        currentText: "",
        currentSearchText: "",
        shouldScrollDown: false,
      },
      // Current namespaces' attributes
      nsSocket: undefined,
      nsRooms: [],
      // All the namespaces
      namespaces: [],
    }
  },
  mounted() {
    // Prompt to get the username
    this.userInfo.username = prompt("Please enter your username.");
    // Connect to the socket
    const socket = io('http://localhost:8000');
    // Listen for namespace's List
    socket.on('nsList', (nsData) => {
      this.namespaces = nsData
      // As the first page namespace
      let firstEndpoint = this.namespaces[0].endpoint;
      this.joinNamespace(firstEndpoint);
    });
  },
  updated() {
    console.log("YASDASDASDAsd");
    if (this.chat.shouldScrollDown) {
      this.scrollDownChatBox();
      this.chat.shouldScrollDown = false;
    }
  },
  methods: {
    // Socket helpers
    joinNamespace(endpoint) {
      // Check if it is in a namespace if it is then close  (**)
      if (this.nsSocket) {
        // Remove Socket
        this.nsSocket.close();
      }
      // Listen for namespace details
      this.nsSocket = io(`http://localhost:8000${endpoint}`, {
        query: {
          username: this.userInfo.username,
        },
      });
      // Listen and get the rooms of that namespace
      this.nsSocket.on('nsRooms', (nsRooms) => {
        // Update rooms
        this.nsRooms = nsRooms;
        // Grab the first room as default value for room
        const firstRoomName = this.nsRooms[0].title;
        this.joinRoom(firstRoomName);
      });
      // Listen for new messages from server
      this.nsSocket.on('message_to_clients', (message) => {
        this.chat.chatHistory.push(message);
        this.chat.shouldScrollDown = true;
      });
      // Set on submit to send message to the server
    },
    joinRoom(roomName) {

      // Send the room name to the server.
      this.nsSocket.emit('join_room', roomName);
      // Listen to get room histories from the server
      this.nsSocket.on('room_histories', (histories) => {
        // Update the message page
        this.chat.chatHistory = histories;
        // Scroll to the bottom of the list
        this.chat.shouldScrollDown = true
      });
      // Listen to update the changes when someone joins.
      this.nsSocket.on('update_chatroom', (information) => {
        // Update the room and show messages
        this.chat.roomName = information.roomName;
        this.chat.numberOfOnlineUsers = information.numberOfUsers;
      });
    },
    sendMessageToServer() {
      this.nsSocket.emit('message_to_server', {
        text: this.chat.currentText,
      });
      this.chat.currentText = "";
    },
    // Listeners
    onNamespaceClicked(endpoint) {
      // Join namespace
      this.joinNamespace(endpoint);
    },
    onRoomClicked(roomName) {
      // Join Room
      this.joinRoom(roomName);
    },
    // UI helper
    scrollDownChatBox() {
      this.$refs['chat_box'].scrollTo(0, this.$refs['chat_box'].scrollHeight);
    },
    // Search
    searchString(text, search) {
      return text.toLowerCase().includes(search.toLowerCase());
    }
  },
}

</script>

<style scoped>

</style>
