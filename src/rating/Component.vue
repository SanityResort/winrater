<script lang="ts" setup>
import { Store } from '@/rating/store'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'
import CategoryLabel from '@/rating/CategoryLabel.vue'

const props = defineProps({
  coachName: String
})

const matchStore = useMatchStore()
const { stores } = storeToRefs(matchStore)

const key: string = props.coachName.toString()
const store: Store = stores.value.get(key)
const matches = store.matches
const categories = store.categories
</script>

<style scoped>
.labels {
  display: flex;
  flex-flow: row wrap;
  font-size: 0.75em;
}
</style>

<template>
  <div class="store">{{ coachName }}: {{ matches.length }}</div>
  <div class="labels">
    <CategoryLabel
      v-for="category in categories"
      :key="category"
      :definedBackground="category.background"
      :definedForeground="category.foreground"
      :name="category.name"
    />
  </div>
</template>
