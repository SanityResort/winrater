<template>
  <form>
    <input v-model="coachName" placeholder="coach name" type="text" />
    <button id="addButton" :disabled="loading" @click.prevent="loadData">Add</button>
  </form>

  <div class="error">
    {{ errorMessage }}
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue'
import { load } from './service'

const emit = defineEmits(['matches', 'count', 'coach'])

const coachName: Ref<string> = ref('')
const loading = ref(false)
const errorMessage: Ref<string> = ref('')

const matchesCallback = (data: []) => emit('matches', data)
const errorCallback = (msg: string) => (errorMessage.value = msg)
const countCallback = (count: number) => emit('count', count)
const coachCallback = (msg: string) => emit('coach', msg)

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
