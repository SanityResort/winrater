<script lang="ts" setup>
import CoachLookup from './coachLocator/Component.vue'
import Rating from './rating/Component.vue'
import Graph from './graph/Component.vue'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'

const matchStore = useMatchStore()
const { stores, modificationCounter } = storeToRefs(matchStore)
</script>

<template>
  <header>
    <div class="collapse-wrapper" :class="{ collapsed: modificationCounter > 0 }">
      <div class="top-bar" />
      <div class="description">Explaining text</div>
    </div>
    <CoachLookup />
    <div class="separator" />
  </header>

  <main>
    <Rating v-for="store in stores.values()" :key="store" :store="store" />

    <Graph />
  </main>
</template>

<style scoped>
.collapse-wrapper {
  width: 100%;
}

.collapsed > .description {
  display: none;
}

.collapsed:hover > .description {
  display: block;
}

.collapsed > .top-bar::after {
  content: '\\/';
}

.collapsed:hover > .top-bar::after {
  background: lightblue;
  content: '';
  display: block;
  min-height: var(--line-height);
}

.description {
  background: red;
}

header {
  display: flex;
  place-items: flex-start;
  flex-flow: column;
}

.separator {
  background: darkgrey;
  height: 0.5em;
  width: 100%;
}
</style>
