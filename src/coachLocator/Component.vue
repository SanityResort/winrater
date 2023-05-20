<template>
  <form>
    <input v-model="coachName" :disabled="loading" placeholder="coach name" type="text" />
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
const { coachName, stores } = storeToRefs(matchStore)
const loading = ref(false)
const errorMessage: Ref<string> = ref('')

async function loadData() {
  loading.value = true
  if (stores.value.has(coachName.value)) {
    loading.value = false
    return
  }
  const finalCoachName = coachName.value

  coachName.value = ''

  const store = new Store(finalCoachName)
  stores.value.set(finalCoachName, store)

  loading.value = false

  await load(finalCoachName, store, errorMessage)
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
