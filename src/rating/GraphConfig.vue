<template>
  <div class="labels">
    <CategoryLabel
      v-for="category in storeCategories"
      :key="category"
      :category="category"
      :active="isActive(category)"
      :callback="toggleCategory"
    />
    <button @click="remove()">Remove</button>
  </div>
</template>

<script setup lang="ts">
import CategoryLabel from '@/rating/CategoryLabel.vue'
import { Category } from '@/rating/match'
import { GraphConfig, Store } from '@/rating/store'
import { storeToRefs } from 'pinia'
import { useMatchStore } from '@/pinia/store'

const props = defineProps({
  config: GraphConfig,
  store: Store
})

const config = props.config as GraphConfig

const categories: Category[] = config.categories

const store = props.store as Store
const storeCategories = store.categories

const matchStore = useMatchStore()
const { modificationCounter } = storeToRefs(matchStore)

function isActive(category: Category): Boolean {
  return categories.indexOf(category) >= 0
}

function remove() {
  store.removeConfig(config)
}

function toggleCategory(category: Category) {
  config.toggleCategory(category)
  modificationCounter.value += 1
}
</script>

<style scoped>
.labels {
  display: flex;
  flex-flow: row wrap;
  font-size: 0.75em;
}
</style>
