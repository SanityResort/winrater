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
    <CoachLookup class="lookup" />
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
  content: '⮋';
  font-size: xxx-large;
  width: 100%;
}

.collapsed:hover > .top-bar::after {
  background: lightblue;
  content: '';
  display: block;
  font-size: revert;
  min-height: var(--line-height);
}

.description {
  background: red;
}

.lookup {
  margin: 0 auto;
}

header {
  background: var(--color-section-background);
  display: flex;
  flex-flow: column;
  margin: 0 auto;
  place-items: flex-start;
  width: 100%;
}

main {
  background: var(--color-section-background);
}

.separator {
  background: linear-gradient(to bottom, #e9e9e9, grey);
  height: 0.25em;
  margin-top: 5px;
  width: 100%;
}

.top-bar {
  text-align: center;
}
</style>
