<template>
  <div id="title">{{ editedConfig?.getTitle() }}</div>
  <div id="settings">
    <div id="ranges">
      <div class="range setting">
        <input type="radio" id="range" class="setting-radio" name="ranges" value="count" />
        <label for="range" class="setting-label">Count</label>
        <NumberInput
          input-id="fromCount"
          :value="editedConfig?.settings.countRange[0]"
          :callback="setFromCount"
          label="from"
        />
        <NumberInput
          input-id="toCount"
          :value="editedConfig?.settings.countRange[1]"
          :callback="setToCount"
          label="to"
        />
        <HelpIcon tooltip="Limits to games within the range based on order of games" />
      </div>
    </div>
    <div id="aggregation"></div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMatchStore } from '@/pinia/store'
import HelpIcon from '@/common/HelpIcon.vue'
import NumberInput from '@/editor/NumberInput.vue'

const { editedConfig } = storeToRefs(useMatchStore())

function setFromCount(value: number) {
  editedConfig.value?.settings.setFromCount(value)
}
function setToCount(value: number) {
  editedConfig.value?.settings.setToCount(value)
}
</script>

<style scoped>
.setting {
  display: flex;
  gap: 2em;
}
</style>
