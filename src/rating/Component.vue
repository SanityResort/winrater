<template>
  <div v-if="props.store?.fumbblMatches.value">
    {{ props.store.coachName }}: {{ props.store.fumbblMatches.value.length }}
  </div>
  <div v-else>{{ props.store.coachName }}: no value yet</div>
</template>

<script lang="ts" setup>
import { Store } from '@/rating/store'

const props = defineProps({
  store: Store
})
</script>

<style scoped></style>
