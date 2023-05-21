import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Store } from '@/rating/store'

export const useMatchStore = defineStore('matches', () => {
  const currentCoachName = ref('')
  const stores = ref(new Map<string, Store>())

  return { currentCoachName, stores }
})
