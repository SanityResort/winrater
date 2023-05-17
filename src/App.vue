<script lang="ts" setup>
import CoachLookup from './coachLocator/Component.vue'
import Rating from './rating/Component.vue'
import { ref } from 'vue'
import { Store } from '@/rating/store'
import { match } from '@/rating/mapper'

const matchCount = ref(0)
const coachName = ref('')
const stores = ref([])

function processMatches(matches: FumbblMatch[]) {
  stores.value.push(
    new Store(
      coachName.value,
      matches.map((fumbblMatch) => match(fumbblMatch, coachName.value))
    )
  )
}
</script>

<template>
  <header>
    <CoachLookup
      @coach="
        (coach) => {
          coachName = coach
        }
      "
      @count="
        (count) => {
          matchCount = count
        }
      "
      @matches="
        (matches) => {
          processMatches(matches)
        }
      "
    />
    {{ matchCount }}

    <Rating v-for="store in stores" :key="store.coachName" :store="store" />
  </header>

  <main></main>
</template>

<style scoped>
header {
  line-height: 1.5;
  display: flex;
  place-items: flex-start;
}
</style>
