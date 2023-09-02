<template>
  <div id="title">{{ editedConfig?.getTitle() }}</div>
  <div id="settings">
    <div id="limits">
      <div class="limit setting">
        <input type="radio" id="limit" class="setting-radio" name="limits" value="startLimit" />
        <label for="limit" class="setting-label">Limit</label>
        <input
          class="setting-input"
          type="number"
          :value="editedConfig?.settings.limit"
          @input="event => { if (event.target) {
            setLimit(Number.parseInt(((event as Event).target as HTMLInputElement).value))}
          }"
        />
        <HelpIcon
          tooltip="Limits the number of games to first n games (or last n games for negative value)"
          id="limit-help"
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

function setLimit(value: number) {
  editedConfig.value?.settings.setLimit(value)
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
