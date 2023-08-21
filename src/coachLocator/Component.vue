<script lang="ts" setup>
import { Ref, ref } from 'vue'
import { load } from './service'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'
import { Store } from '@/rating/store'

const matchStore = useMatchStore()
const { currentCoachName, stores } = storeToRefs(matchStore)
const { setStore, deleteStore } = matchStore
const loading = ref(false)
const errorMessage: Ref<string> = ref('')

async function loadData() {
  loading.value = true
  if (stores.value.has(currentCoachName.value)) {
    loading.value = false
    return
  }
  const coachName = currentCoachName.value

  currentCoachName.value = ''

  const store = new Store(coachName)
  setStore(coachName, store)

  loading.value = false

  if (!(await load(store, errorMessage))) {
    deleteStore(coachName)
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-weight: bold;
  height: 0;
  text-align: center;
  transition: height 0.2s ease;
}

.error.active {
  display: block;
  height: var(--line-height);
}

#addButton {
  padding-left: 0.25em;
}

#coachForm {
  display: flex;
}

.search {
  padding-top: 0.25em;
}
</style>

<template>
  <div class="search">
    <form id="coachForm">
      <input
        id="coachName"
        v-model="currentCoachName"
        :disabled="loading"
        placeholder="coach name"
        type="text"
      />

      <button id="addButton" class="iconButton" :disabled="loading" @click.prevent="loadData">
        <img src="../../icons/addIcon.png" alt="Add coach" />
      </button>
    </form>
    <div :class="{ active: errorMessage.length > 0 }" class="error">
      {{ errorMessage }}
    </div>
  </div>
</template>
