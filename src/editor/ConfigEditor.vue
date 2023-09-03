<template>
  <div id="title">{{ editedConfig?.getTitle() }}</div>
  <div id="settings">
    <div id="ranges">
      <div class="range setting">
        <input type="radio" id="range" class="setting-radio" name="ranges" value="count" />
        <label for="range" class="setting-label">Count</label>
        <label for="fromCount" class="setting-label">from</label>
        <input
          id="fromCount"
          class="setting-input"
          type="number"
          :value="editedConfig?.settings.countRange[0]"
          @input="event => { if (event.target) {
            setFromCount(Number.parseInt(((event as Event).target as HTMLInputElement).value))}
          }"
        />
        <label for="toCount" class="setting-label">from</label>
        <input
          id="toCount"
          class="setting-input"
          type="number"
          :value="editedConfig?.settings.countRange[1]"
          @input="event => { if (event.target) {
            setFromCount(Number.parseInt(((event as Event).target as HTMLInputElement).value))}
          }"
        />
        <HelpIcon
          tooltip="Limits the number of games to first n games (or last n games for negative value)"
          id="range-help"
        />
      </div>
    </div>
    <div id="aggregation"></div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMatchStore } from '@/pinia/store'
import HelpIcon from '@/common/HelpIcon.vue'

const { editedConfig } = storeToRefs(useMatchStore())

function setFromCount(value: number) {
  editedConfig.value?.settings.setFromCount(value)
}
</script>

<style scoped>
.setting-input {
  text-align: right;
  margin: 0 0.5em;
  width: 8em;
}

.setting {
  display: flex;
}
</style>
