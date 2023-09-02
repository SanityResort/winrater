<template>
  <div id="title">{{ editedConfig?.getTitle() }}</div>
  <div id="settings">
    <div id="limits">
      <div class="limit">
        <input type="radio" id="start-limit" name="limits" value="startLimit" />
        <label for="start-limit">Start</label>
        <input
          type="number"
          maxlength="5"
          :value="editedConfig?.settings.limit"
          @input="event => { if (event.target) {
            setLimit(Number.parseInt(((event as Event).target as HTMLInputElement).value))}
          }"
        />
      </div>
    </div>
    <div id="aggregation"></div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMatchStore } from '@/pinia/store'

const { editedConfig } = storeToRefs(useMatchStore())

function setLimit(value: number) {
  editedConfig.value?.settings.setLimit(value)
}
</script>

<style scoped></style>
