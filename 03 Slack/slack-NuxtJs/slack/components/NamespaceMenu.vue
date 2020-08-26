<template>
  <div class="pt-2 col-1 namespaces">
    <div v-for="namespace in namespaces" class="mt-4" @click="onNamespaceClicked(namespace.endpoint)">
      <img :src="namespace.image">
    </div>
  </div>
</template>

<style>

</style>

<script>
export default {
  data() {
    return {}
  },
  props: ["namespaces", "onNamespaceClicked"]
}
</script>
