<template>
  <div id="title">
    {{ editedConfig?.getTitle() }}
    <IconButton :src="applyIcon" alt="Apply" :callback="update" />
    <IconButton
      :src="resetIcon"
      alt="Reset"
      :callback="
        () => {
          // TODO
          const oldConfig = editedConfig
          editedConfig = undefined
          editedConfig = oldConfig
        }
      "
    />
    <IconButton
      :src="removeIcon"
      alt="Close"
      :callback="
        () => {
          editedConfig = undefined
        }
      "
    />
  </div>
  <div id="settings">
    <div id="ranges">
      <div class="setting spaced">
        <div>
          <input
            type="radio"
            id="countRange"
            name="ranges"
            value="count"
            :checked="editedConfig?.settings.range == Range.COUNT"
            @input="
              () => {
                setRange(Range.COUNT)
              }
            "
          />
          <label for="countRange">Match Number</label>
        </div>
        <div class="range-data">
          <label for="fromCount">from</label>
          <div class="input-wrapper">
            <input
              id="fromCount"
              class="setting-input"
              type="number"
              :value="editedConfig?.settings.countRange[0]"
              min="1"
            />
          </div>
          <label for="toCount">to</label>
          <div class="input-wrapper">
            <input
              id="toCount"
              class="setting-input"
              type="number"
              :value="editedConfig?.settings.countRange[1]"
              min="1"
            />
          </div>
          <HelpIcon
            id="countHelp"
            tooltip="Limits to games within the range based on order of games"
          />
        </div>
      </div>

      <div class="setting spaced">
        <div>
          <input
            type="radio"
            id="idRange"
            name="ranges"
            value="id"
            :checked="editedConfig?.settings.range == Range.ID"
            @input="
              () => {
                setRange(Range.ID)
              }
            "
          />
          <label for="idRange">Match Id</label>
        </div>
        <div class="range-data">
          <label for="fromId">from</label>
          <div class="input-wrapper">
            <input
              id="fromId"
              class="setting-input"
              type="number"
              :value="editedConfig?.settings.idRange[0]"
              min="1"
            />
          </div>
          <label for="toId">to</label>
          <div class="input-wrapper">
            <input
              id="toId"
              class="setting-input"
              type="number"
              :value="editedConfig?.settings.idRange[1]"
              min="1"
            />
          </div>
          <HelpIcon id="idHelp" tooltip="Limits to games with ids within given" />
        </div>
      </div>
      <div class="setting spaced">
        <div>
          <input
            type="radio"
            id="dateRange"
            name="ranges"
            value="date"
            :checked="editedConfig?.settings.range == Range.DATE"
            @input="
              () => {
                setRange(Range.DATE)
              }
            "
          />
          <label for="dateRange">Date</label>
        </div>
        <div class="range-data">
          <label for="fromId">from</label>
          <div class="input-wrapper">
            <input
              id="fromDate"
              class="setting-input"
              type="date"
              :value="editedConfig?.settings.getStartDate()"
            />
          </div>
          <label for="toId">to</label>
          <div class="input-wrapper">
            <input
              id="toDate"
              class="setting-input"
              type="date"
              :value="editedConfig?.settings.getEndDate()"
            />
          </div>
          <HelpIcon id="dateHelp" tooltip="Limits to games played within those dates" />
        </div>
      </div>
    </div>
    <div id="aggregation">
      <div class="setting">
        <div>
          <input
            type="radio"
            id="sum-aggregation"
            class=""
            name="aggregation"
            value="sum"
            :checked="editedConfig?.settings.aggregation == Aggregation.SUM"
            @input="
              () => {
                setAggregation(Aggregation.SUM)
              }
            "
          />
          <label for="sum-aggregation">Sum</label>
        </div>
        <HelpIcon id="sumHelp" tooltip="Win ratios are summed up" />
      </div>
      <div class="setting">
        <div>
          <input
            type="radio"
            id="window-aggregation"
            class=""
            name="aggregation"
            value="window"
            :checked="editedConfig?.settings.aggregation == Aggregation.WINDOW"
            @input="
              () => {
                setAggregation(Aggregation.WINDOW)
              }
            "
          />
          <label for="sum-aggregation">Sliding window</label>
        </div>
        <div class="input-wrapper">
          <input
            type="number"
            min="1"
            id="windowSize"
            class="setting-input"
            :value="editedConfig?.settings.windowSize"
          />
        </div>
        <HelpIcon
          id="windowHelp"
          tooltip="Calculates the win ratio of all series of <n> consecutive games as separate values (1..n, 2..n+1, ...)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMatchStore } from '@/pinia/store'
import HelpIcon from '@/common/HelpIcon.vue'
import { Aggregation, Range, SettingsUpdate } from '@/rating/store'
import IconButton from '@/common/IconButton.vue'
import applyIcon from '../../icons/applyIcon.png'
import removeIcon from '../../icons/removeIcon.png'
import resetIcon from '../../icons/resetIcon.png'

const { editedConfig, errorMessage } = storeToRefs(useMatchStore())

let range = editedConfig.value?.settings.range || Range.COUNT
let aggregation = editedConfig.value?.settings.aggregation || Aggregation.SUM

function update() {
  if (editedConfig.value) {
    const countRange = [
      Number.parseInt((document.getElementById('fromCount') as HTMLInputElement).value),
      Number.parseInt((document.getElementById('toCount') as HTMLInputElement).value)
    ]
    const idRange = [
      Number.parseInt((document.getElementById('fromId') as HTMLInputElement).value),
      Number.parseInt((document.getElementById('toId') as HTMLInputElement).value)
    ]
    const dateRange = [
      (document.getElementById('fromDate') as HTMLInputElement).value,
      (document.getElementById('toDate') as HTMLInputElement).value
    ]
    const size = Number.parseInt((document.getElementById('windowSize') as HTMLInputElement).value)
    editedConfig.value.updateIfChanged(
      new SettingsUpdate(countRange, idRange, dateRange, size, aggregation, range),
      errorMessage
    )
  }
}

function setRange(newRange: Range) {
  range = newRange
}

function setAggregation(newAggregation: Aggregation) {
  aggregation = newAggregation
}
</script>

<style scoped>
#aggregation,
#ranges {
  width: fit-content;
}

.input-wrapper {
  margin-right: 0.75em;
  width: 7em;
}

.range-data {
  display: flex;
  gap: 0.5em;
}

.setting {
  display: flex;
  gap: 0.5em;
}

#settings {
  display: flex;
}

.setting-input {
  text-align: right;
  width: 100%;
}

.spaced {
  justify-content: space-between;
}
</style>
