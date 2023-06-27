<script lang="ts" setup>
import { Store } from '@/rating/store'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef } from 'vue'
import type { Category } from '@/rating/match'

const props = defineProps({
  coachName: String
})

const matchStore = useMatchStore()
const { stores } = storeToRefs(matchStore)

const key: string = props.coachName?.toString()
const store: Store = stores.value.get(key)
const matches = store.matches
const categories: ComputedRef<Category[]> = computed(() => {
  const result: Category[] = []
  matches
    .map((match) => match.category)
    .forEach((category) => {
      if (result.indexOf(category) < 0) {
        result.push(category)
      }
    })
  return result.sort((a: Category, b: Category) => a.toString().localeCompare(b.toString()))
})
</script>

<style scoped></style>

<template>
  <div class="store">{{ coachName }}: {{ matches.length }}</div>
  <div>{{ categories }}</div>
</template>
