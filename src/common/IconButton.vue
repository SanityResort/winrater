<template>
  <button class="iconButton" @click.prevent="callback">
    <img :src="props.src" :alt="props.alt" />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  callback: Function,
  src: String,
  alt: String
})

function callback() {
  if (props.callback) {
    props.callback()
  }
}
</script>

<style scoped>
.iconButton {
  border: none;
  background: none;
}

.iconButton > img {
  height: 2em;
}
</style>
