<template>
  <div id="title">{{ editedConfig?.getTitle() }}</div>
  <div id="settings">
    <div id="ranges">
      <div class="range setting" :class="{ error: countError }">
        <div>
          <input type="radio" id="countRange" class="setting-radio" name="ranges" value="count" />
          <label for="countRange" class="setting-label">Match Number</label>
        </div>
        <div class="range-data">
          <label for="fromCount" class="setting-label">from</label>
          <div class="input-wrapper">
            <input
              id="fromCount"
              class="setting-input"
              type="number"
              :value="editedConfig?.settings.countRange[0]"
              @input="setCountRange"
              min="1"
              :max="editedConfig?.settings.matchCount"
            />
          </div>
          <label for="toCount" class="setting-label">to</label>
          <div class="input-wrapper">
            <input
              id="toCount"
              class="setting-input"
              type="number"
              :value="editedConfig?.settings.countRange[1]"
              @input="setCountRange"
              min="1"
              :max="editedConfig?.settings.matchCount"
            />
          </div>
          <HelpIcon
            id="countHelp"
            tooltip="Limits to games within the range based on order of games"
          />
        </div>
      </div>

      <div class="range setting" :class="{ error: idError }">
        <div>
          <input type="radio" id="idRange" class="setting-radio" name="ranges" value="id" />
          <label for="idRange" class="setting-label">Match Id</label>
        </div>
        <div class="range-data">
          <label for="fromId" class="setting-label">from</label>
          <div class="input-wrapper">
            <input
              id="fromId"
              class="setting-input"
              type="number"
              :value="editedConfig?.settings.idRange[0]"
              @input="setIdRange"
              :min="editedConfig?.settings.minId"
              :max="editedConfig?.settings.maxId"
            />
          </div>
          <label for="toId" class="setting-label">to</label>
          <div class="input-wrapper">
            <input
              id="toId"
              class="setting-input"
              type="number"
              :value="editedConfig?.settings.idRange[1]"
              @input="setIdRange"
              :min="editedConfig?.settings.minId"
              :max="editedConfig?.settings.maxId"
            />
          </div>
          <HelpIcon id="idHelp" tooltip="Limits to games with ids within given" />
        </div>
      </div>
      <div class="range setting" :class="{ error: dateError }">
        <div>
          <input type="radio" id="dateRange" class="setting-radio" name="ranges" value="date" />
          <label for="dateRange" class="setting-label">Date</label>
        </div>
        <div class="range-data">
          <label for="fromId" class="setting-label">from</label>
          <div class="input-wrapper">
            <input
              id="fromDate"
              class="setting-input"
              type="date"
              :value="toString(editedConfig?.settings.dateRange[0])"
              @input="setDateRange"
              :min="editedConfig?.settings.minDate"
              :max="editedConfig?.settings.maxDate"
            />
          </div>
          <label for="toId" class="setting-label">to</label>
          <div class="input-wrapper">
            <input
              id="toDate"
              class="setting-input"
              type="date"
              :value="toString(editedConfig?.settings.dateRange[1])"
              @input="setDateRange"
              :min="editedConfig?.settings.minDate"
              :max="editedConfig?.settings.maxDate"
            />
          </div>
          <HelpIcon id="dateHelp" tooltip="Limits to games played within those date" />
        </div>
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

new Date().toUTCString()

function setCountRange() {
  if (editedConfig.value) {
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

function toString(date: Date): string {
  if (!date) {
    return ''
  }

  return date.toISOString().split('T')[0]
}
</script>

<style scoped>
.error {
  border: red solid 2px;
}

.input-wrapper {
  margin-right: 0.75em;
  width: 7em;
}

.range-data {
  display: flex;
  gap: 0.5em;
}

#ranges {
  width: fit-content;
}

.setting {
  display: flex;
  gap: 0.5em;
  justify-content: space-between;
}

.setting-input {
  text-align: right;
  width: 100%;
}
</style>
