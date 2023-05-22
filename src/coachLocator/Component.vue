<template>
  <form>
    <input
      id="coachName"
      v-model="currentCoachName"
      :disabled="loading"
      placeholder="coach name"
      type="text"
    />
    <button id="addButton" :disabled="loading" @click.prevent="loadData">Add</button>
  </form>

  <div class="error">
    {{ errorMessage }}
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue'
import { load } from './service'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'
import { Store } from '@/rating/store'

const matchStore = useMatchStore()
const { currentCoachName, stores } = storeToRefs(matchStore)
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
  stores.value.set(coachName, store)

  loading.value = false

  if (!(await load(store, errorMessage))) {
    stores.value.delete(coachName)
  }
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
