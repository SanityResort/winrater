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
      <div class="top-bar title"><div class="title-text">WinRater</div></div>
      <div class="top-bar pull-down" />
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

.collapsed > .top-bar.pull-down {
  height: var(--line-height);
  opacity: 1;
  text-align: center;
}

.collapsed > .top-bar.pull-down::after {
  content: '⮋';
  font-size: x-large;
  height: var(--line-height);
}

.collapsed > .top-bar.title > .title-text {
  height: 0;
  opacity: 0;
}

.collapsed:hover > .top-bar.pull-down::after {
  content: '';
  display: block;
}

.description {
  background: red;
}

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
  height: 100%;
  padding: 0 0.5em;
}

.separator {
  background: linear-gradient(to bottom, #e9e9e9, grey);
  height: 0.25em;
  margin-top: 5px;
  width: 100%;
}

.top-bar {
  background: var(--color-title-background);
  color: var(--color-element-background);
}

.top-bar.pull-down {
  height: 0;
  opacity: 0;
  transition: height 0.5s 0.5s ease-out, opacity 0.5s 0.5s ease-out;
}

.top-bar.title {
  font-size: xxx-large;
  font-weight: bold;
  overflow: hidden;
  text-align: center;
}

.top-bar.title > .title-text {
  height: var(--line-height);
  line-height: var(--line-height);
  opacity: 1;
  transition: height 0.5s ease-in, opacity 0.5s ease-in;
}
</style>
