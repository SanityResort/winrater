<template>
  <div class="category">
    {{ name }}
  </div>
</template>

<script setup lang="ts">
import Color from 'color'

const props = defineProps({
  definedBackground: Color,
  definedForeground: Color,
  name: String,
  active: Boolean
})

const foreground = props.active
  ? props.definedForeground
  : (props.definedForeground as Color).alpha(0.75)
const background = props.active
  ? props.definedBackground
  : (props.definedBackground as Color).alpha(0.25)
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
