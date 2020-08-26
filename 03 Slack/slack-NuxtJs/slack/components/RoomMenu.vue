<template>
  <div class="col-3 rooms">
    <h3 class="mt-4">Rooms</h3>
    <ul class="room-list">
      <li v-for="room in nsRooms" @click="onRoomClicked(room.title)" class="mt-3">
        <i :class="`pr-2 fas ${room.isPrivate ?  'fa-lock' : 'fa-globe-americas'}`"></i>
        {{ room.title }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: ["nsRooms", "onRoomClicked"]
}
</script>

<style scoped>

</style>
