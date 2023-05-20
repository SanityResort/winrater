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

const emit = defineEmits(['matches'])

const matchStore = useMatchStore()
const { coachName, matchCount } = storeToRefs(matchStore)
const loading = ref(false)
const errorMessage: Ref<string> = ref('')

const matchesCallback = (data: []) => emit('matches', data)
const errorCallback = (msg: string) => (errorMessage.value = msg)
const countCallback = (count: number) => (matchCount.value = count)
const coachCallback = (msg: string) => (coachName.value = msg)

async function loadData() {
  loading.value = true

  await load(coachName.value, countCallback, matchesCallback, errorCallback, coachCallback)

  coachName.value = ''
  loading.value = false
}
</script>

<style scoped>
.error {
  color: red;
}
</style>
