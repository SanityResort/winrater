<template>
  <div>GraphConfig</div>
  <div class="labels">
    <CategoryLabel
      v-for="category in storeCategories"
      :key="category"
      :definedBackground="category.background"
      :definedForeground="category.foreground"
      :name="category.name"
      :active="isActive(category)"
    />
  </div>
</template>

<script setup lang="ts">
import CategoryLabel from '@/rating/CategoryLabel.vue'
import { Category } from '@/rating/match'
import type { PropType } from 'vue'
import type { GraphConfig } from '@/rating/store'

const props = defineProps({
  config: Object as PropType<GraphConfig>,
  storeCategories: Object as PropType<Category[]>
})

const categories: Category[] = props.config?.categories ? props.config.categories : []

const storeCategories = props.storeCategories?.map((category) => category as Category)

function isActive(category: Category): Boolean {
  return categories.indexOf(category) >= 0
}
</script>

<style scoped></style>
