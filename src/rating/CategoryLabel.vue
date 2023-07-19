<template>
  <div class="category">
    {{ name }}
  </div>
</template>

<script setup lang="ts">
import Color from 'color'

defineProps({
  background: Color,
  foreground: Color,
  name: String
})
</script>

<style scoped>
.category {
  background: v-bind(background);
  border-color: lightgray;
  border-radius: 1em;
  border-style: ridge;
  color: v-bind(foreground);
  margin: 0 0.25em;
  padding: 0 0.5em;
}
</style>
