import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Store } from '@/rating/store'

export const useMatchStore = defineStore('matches', () => {
  const currentCoachName = ref('')
  const stores = ref(new Map<string, Store>())
  const modificationCounter = ref(0)

  function setStore(key: string, value: Store) {
    stores.value.set(key, value)
  }

  function deleteStore(key: string) {
    stores.value.delete(key)
  }

  return { currentCoachName, setStore, deleteStore, stores, modificationCounter }
})
