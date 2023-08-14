<template>
  <div class="collapse-wrapper" :class="{ collapsed: stores.size > 0 }">
    <div class="top-bar title"><div class="title-text">WinRater</div></div>
    <div class="top-bar pull-down" />
    <div class="description">
      <p>
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
      </p>
      <p>
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
        Explaining text Explaining text asd sad a an salkdn alksnd Explaining text sdansdkl,ld na
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'

const matchStore = useMatchStore()
const { stores } = storeToRefs(matchStore)
</script>

<style scoped>
.collapse-wrapper {
  width: 100%;
  --min-line-count: 5;
  --line-inc: 0;
  --desc-line-height: calc((var(--min-line-count) + var(--line-inc)) * var(--line-height));
  --desc-padding: 0.5em;
  --desc-margin: 1em;
  --desc-height: calc(var(--desc-line-height) + (var(--desc-padding) + var(--desc-margin)) * 2);
}

.collapsed > .description {
  height: 0;
}

.description > p,
.collapsed:hover > .description > p {
  background: var(--color-element-background);
  border: black 2px solid;
  border-radius: 5px;
  flex-flow: row;
  padding: var(--desc-padding);
  margin: var(--desc-margin);
  height: calc(var(--desc-line-height));
}

.description,
.collapsed:hover > .description {
  transition: height 0.5s ease;
  height: var(--desc-height);
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
  transition: opacity 0.25s ease;
}

.collapsed > .top-bar.title > .title-text {
  height: 0;
  opacity: 0;
}

.collapsed:hover > .top-bar.pull-down::after {
  opacity: 0;
  display: block;
}

.description {
  background: var(--color-section-background);
  display: flex;
  overflow: hidden;
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
