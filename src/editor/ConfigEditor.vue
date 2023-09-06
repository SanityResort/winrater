<template>
  <div id="title">{{ editedConfig?.getTitle() }}</div>
  <div id="settings">
    <div id="ranges">
      <div class="range setting" :class="{ error: countError }">
        <input type="radio" id="countRange" class="setting-radio" name="ranges" value="count" />
        <label for="range" class="setting-label">Match Number</label>
        <label for="fromCount" class="setting-label">from</label>
        <input
          id="fromCount"
          class="setting-input"
          type="number"
          :value="editedConfig?.settings.countRange[0]"
          @input="setCountRange"
        />
        <label for="toCount" class="setting-label">to</label>
        <input
          id="toCount"
          class="setting-input"
          type="number"
          :value="editedConfig?.settings.countRange[1]"
          @input="setCountRange"
        />
        <HelpIcon tooltip="Limits to games within the range based on order of games" />
      </div>

      <div class="range setting" :class="{ error: idError }">
        <input type="radio" id="idRange" class="setting-radio" name="ranges" value="id" />
        <label for="range" class="setting-label">Match Id</label>
        <label for="fromId" class="setting-label">from</label>
        <input
          id="fromId"
          class="setting-input"
          type="number"
          :value="editedConfig?.settings.idRange[0]"
          @input="setIdRange"
        />
        <label for="toId" class="setting-label">to</label>
        <input
          id="toId"
          class="setting-input"
          type="number"
          :value="editedConfig?.settings.idRange[1]"
          @input="setIdRange"
        />
        <HelpIcon tooltip="Limits to games with ids within given" />
      </div>
      <div class="range setting" :class="{ error: idError }">
        <input type="radio" id="idRange" class="setting-radio" name="ranges" value="date" />
        <label for="range" class="setting-label">Date</label>
        <label for="fromId" class="setting-label">from</label>
        <input
          id="fromDate"
          class="setting-input"
          type="date"
          :value="editedConfig?.settings.dateRange[0]"
          @input="setDateRange"
        />
        <label for="toId" class="setting-label">to</label>
        <input
          id="toDate"
          class="setting-input"
          type="date"
          :value="editedConfig?.settings.dateRange[1]"
          @input="setDateRange"
        />
        <HelpIcon tooltip="Limits to games played within those date" />
      </div>
    </div>
    <div id="aggregation"></div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMatchStore } from '@/pinia/store'
import HelpIcon from '@/common/HelpIcon.vue'
import { ref } from 'vue'

const { editedConfig, errorMessage } = storeToRefs(useMatchStore())

const countError = ref(false)
const idError = ref(false)
const dateError = ref(false)

function setCountRange() {
  console.log('Invoke')
  if (editedConfig.value) {
    console.log('perform')
    const from = Number.parseInt((document.getElementById('fromCount') as HTMLInputElement).value)
    const to = Number.parseInt((document.getElementById('toCount') as HTMLInputElement).value)
    countError.value = !editedConfig.value.settings.setCountRange(from, to, errorMessage)
  }
}

function setIdRange() {
  if (editedConfig.value) {
    const from = Number.parseInt((document.getElementById('fromId') as HTMLInputElement).value)
    const to = Number.parseInt((document.getElementById('toId') as HTMLInputElement).value)
    idError.value = !editedConfig.value.settings.setIdRange(from, to, errorMessage)
  }
}

function setDateRange() {
  if (editedConfig.value) {
    const from = new Date((document.getElementById('fromDate') as HTMLInputElement).value)
    const to = new Date((document.getElementById('toDate') as HTMLInputElement).value)
    dateError.value = !editedConfig.value.settings.setDateRange(from, to, errorMessage)
  }
}
</script>

<style scoped>
.error {
  border: red solid 2px;
}

.setting {
  display: flex;
  gap: 0.5em;
}

.setting-input {
  text-align: right;
  width: 8em;
}
</style>
