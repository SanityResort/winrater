<template>
  <div class="category" :style="{ background: background, color: foreground }">
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
  display: block;
}
</style>
