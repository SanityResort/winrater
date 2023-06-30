<script lang="ts" setup>
import { Store } from '@/rating/store'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'

const props = defineProps({
  coachName: String
})

const matchStore = useMatchStore()
const { stores } = storeToRefs(matchStore)

const key: string = props.coachName?.toString()
const store: Store = stores.value.get(key)
const matches = store.matches
const categories = store.categories
</script>

<style scoped>
.category {
  display: block;
  background: blue;
}
</style>

<template>
  <div class="store">{{ coachName }}: {{ matches.length }}</div>
  <div v-for="category in categories" :key="category" class="category">{{ category.name }}</div>
</template>
