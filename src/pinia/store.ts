import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMatchStore = defineStore('matches', () => {
  const coachName = ref('')
  const matchCount = ref(0)
  const stores = ref([])

  return { coachName, matchCount, stores }
})
