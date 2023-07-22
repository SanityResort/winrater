<script lang="ts" setup>
import { Store } from '@/rating/store'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'
import CategoryLabel from '@/rating/CategoryLabel.vue'
import GraphConfig from '@/rating/GraphConfig.vue'

const props = defineProps({
  store: Store
})

const matchStore = useMatchStore()
const { stores } = storeToRefs(matchStore)
let { modificationCounter } = storeToRefs(matchStore)

const store: Store = props.store as Store
const key = store.coachName
const matches = store.matches
const categories = store.categories
const configs = store.configs

function removeStore() {
  stores.value.delete(key)
  if (stores.value.size == 0) {
    modificationCounter.value = 0
  }
}

function addConfig() {
  store.addConfig()
}
</script>

<style scoped>
.labels {
  display: flex;
  flex-flow: row wrap;
  font-size: 0.75em;
}

.coachData {
  width: 100%;
}

.config {
  width: 50%;
}

.configs > :last-child {
  width: 100%;
}

.configs {
  display: flex;
  flex-flow: row wrap;
}

.rating {
  max-width: 30em;
}
</style>

<template>
  <div class="rating">
    <div class="coachData">
      <div class="store">
        {{ key }}: {{ matches.length }}
        <button @click="addConfig()">Add config</button>
        <button @click="removeStore()">Remove</button>
      </div>
      <div class="labels">
        <CategoryLabel
          v-for="category in categories"
          :key="category"
          :category="category"
          :active="true"
        />
      </div>
    </div>
    <div class="configs">
      <div class="config" :key="modificationCounter">
        <GraphConfig v-for="config in configs" :key="config" :config="config" :store="store" />
      </div>
    </div>
  </div>
</template>
