<template>
  <div id="title">{{ editedConfig?.getTitle() }}</div>
  <div id="settings">
    <div id="limits">
      <div class="limit">
        <input type="radio" id="start-limit" name="limits" value="startLimit" />
        <label for="start-limit">Start</label>
        <input
          type="number"
          :value="settings?.startLimit"
          @input="event => { if (event.target) {
            setStartLimit(Number.parseInt(((event as Event).target as HTMLInputElement).value))}
          }"
        />
      </div>
    </div>
    <div id="aggregation"></div>
  </div>
</template>
<script setup lang="ts">
import { Settings } from '@/rating/store'
import { storeToRefs } from 'pinia'
import { useMatchStore } from '@/pinia/store'

const { editedConfig } = storeToRefs(useMatchStore())

const settings: Settings | undefined = editedConfig.value?.settings

function setStartLimit(value: number) {
  settings?.setStartLimit(value)
}
</script>

<style scoped></style>
