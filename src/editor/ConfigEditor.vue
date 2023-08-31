<template>
  <div>{{ configHolder.config?.getTitle() }}</div>
</template>
<script setup lang="ts">
import { ConfigHolder } from '@/rating/store'

const props = defineProps({ configHolder: ConfigHolder })

const configHolder: ConfigHolder = props.configHolder as ConfigHolder
</script>

<style scoped></style>
