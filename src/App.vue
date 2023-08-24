<script lang="ts" setup>
import CoachLookup from './coachLocator/Component.vue'
import Rating from './rating/Component.vue'
import Graph from './graph/Component.vue'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'
import CollapsableHeader from '@/CollapsableHeader.vue'

const matchStore = useMatchStore()
const { stores } = storeToRefs(matchStore)
</script>

<template>
  <header>
    <CollapsableHeader />
    <CoachLookup class="lookup" />
    <div class="separator" />
  </header>

  <main>
    <Rating v-for="store in stores.values()" :key="store" :store="store" />

    <Graph />
  </main>
</template>

<style scoped>
header {
  background: var(--color-section-background);
  display: flex;
  flex-flow: column;
  margin: 0 auto;
  place-items: flex-start;
  width: 100%;
}

.lookup {
  margin: 0 auto;
}

main {
  background: var(--color-section-background);
  padding: 0 0.5em;
}

.separator {
  background: linear-gradient(to bottom, #e9e9e9, grey);
  height: 0.25em;
  margin-top: 5px;
  width: 100%;
}
</style>
