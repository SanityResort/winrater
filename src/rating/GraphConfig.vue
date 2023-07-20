<template>
  <div class="labels">
    <CategoryLabel
      v-for="category in storeCategories"
      :key="category"
      :definedBackground="category.background"
      :definedForeground="category.foreground"
      :name="category.name"
      :active="isActive(category)"
    />
    <button @click="remove()">Remove</button>
  </div>
</template>

<script setup lang="ts">
import CategoryLabel from '@/rating/CategoryLabel.vue'
import { Category } from '@/rating/match'
import type { PropType } from 'vue'
import type { GraphConfig } from '@/rating/store'
import { Store } from '@/rating/store'

const props = defineProps({
  config: Object as PropType<GraphConfig>,
  store: Object as PropType<Store>
})

const config = props.config as GraphConfig

const categories: Category[] = config.categories

const store = props.store as Store
const storeCategories = store.categories

function isActive(category: Category): Boolean {
  return categories.indexOf(category) >= 0
}

function remove() {
  store.removeConfig(config)
}
</script>

<style scoped>
.labels {
  display: flex;
  flex-flow: row wrap;
  font-size: 0.75em;
}
</style>
