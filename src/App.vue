<script lang="ts" setup>
import CoachLookup from './coachLocator/Component.vue'
import Rating from './rating/Component.vue'
import Graph from './graph/Component.vue'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'

const matchStore = useMatchStore()
const { stores } = storeToRefs(matchStore)
</script>

<template>
  <header>
    <CoachLookup />

    <Rating v-for="storeKey in stores.keys()" :key="storeKey" :coach-name="storeKey" />
  </header>

  <main><Graph /></main>
</template>

<style scoped>
header {
  line-height: 1.5;
  display: flex;
  place-items: flex-start;
}
</style>
