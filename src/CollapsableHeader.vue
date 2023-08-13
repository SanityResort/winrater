<template>
  <div class="collapse-wrapper" :class="{ collapsed: stores.size > 0 }">
    <div class="top-bar title"><div class="title-text">WinRater</div></div>
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
    <div class="top-bar pull-down" />
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
}

.collapsed > .description {
  height: 0;
}

.collapsed:hover > .description {
  height: var(--line-height);
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
  background: var(--color-section-background);
  overflow: hidden;
  transition: height 0.5s ease;
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
