<template>
  <div class="category" @click="callback()">
    {{ category.name }}
  </div>
</template>

<script setup lang="ts">
import Color from 'color'
import type { PropType } from 'vue'
import { Category } from '@/rating/match'

const props = defineProps({
  category: Object as PropType<Category>,
  active: Boolean,
  callback: Function
})

const category = props.category as Category

const foreground = props.active ? category.foreground : (category.foreground as Color).alpha(0.75)
const background = props.active ? category.background : (category.background as Color).alpha(0.25)

function callback() {
  if (props.callback) {
    props.callback(category)
  }
}
</script>

<style scoped>
.category {
  background: v-bind(background);
  border-color: lightgray;
  border-radius: var(--line-height);
  border-style: ridge;
  color: v-bind(foreground);
  font-weight: bold;
  margin: 1px 1px 1px 0;
  padding: 0 calc(var(--line-height) / 2);
}
</style>
