<template>
  <div>{{ props.store.coachName }}: {{ props.store.matches.length }}</div>
</template>

<script lang="ts" setup>
import { Store } from '@/rating/store'

const props = defineProps({
  store: Store
})
</script>

<style scoped></style>
