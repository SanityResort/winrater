<template>
  <div class="editingPane">
    <div id="title-bar" :style="{ background: tooltipGradient, color: tooltipColor }">
      <div id="title">
        {{ editedConfig?.getTitle() }}
      </div>
      <IconButton :src="applyIcon" alt="Apply" :callback="update" :show-indicator="true" />
      <IconButton
        :src="resetIcon"
        alt="Reset"
        :callback="
          () => {
            editedConfig?.resetSettings()
            editedConfig?.update()
          }
        "
        :show-indicator="true"
      />
      <IconButton
        :src="removeIcon"
        alt="Close"
        :callback="
          () => {
            editedConfig = undefined
          }
        "
        :show-indicator="false"
      />
    </div>
    <div id="settings">
      <div id="ranges" class="element">
        <div class="setting spaced">
          <div>
            <input
              type="radio"
              id="countRange"
              name="ranges"
              value="count"
              :checked="settingsUpdate.range == Range.COUNT"
              @input="
                () => {
                  settingsUpdate.range = Range.COUNT
                }
              "
            />
            <label for="countRange">Match Number</label>
          </div>
          <div class="range-data">
            <div class="range-field">
              <label for="fromCount">from</label>
              <div class="input-wrapper">
                <input
                  id="fromCount"
                  class="setting-input"
                  type="number"
                  v-model="settingsUpdate.lowerCount"
                  min="1"
                />
              </div>
            </div>
            <div class="range-field">
              <label for="toCount">to</label>
              <div class="input-wrapper">
                <input
                  id="toCount"
                  class="setting-input"
                  type="number"
                  v-model="settingsUpdate.upperCount"
                  min="1"
                />
              </div>
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
              :checked="settingsUpdate.range == Range.ID"
              @input="
                () => {
                  settingsUpdate.range = Range.ID
                }
              "
            />
            <label for="idRange">Match Id</label>
          </div>
          <div class="range-data">
            <div class="range-field">
              <label for="fromId">from</label>
              <div class="input-wrapper">
                <input
                  id="fromId"
                  class="setting-input"
                  type="number"
                  v-model="settingsUpdate.lowerId"
                  min="1"
                />
              </div>
            </div>
            <div class="range-field">
              <label for="toId">to</label>
              <div class="input-wrapper">
                <input
                  id="toId"
                  class="setting-input"
                  type="number"
                  v-model="settingsUpdate.upperId"
                  min="1"
                />
              </div>
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
              :checked="settingsUpdate.range == Range.DATE"
              @input="
                () => {
                  settingsUpdate.range = Range.DATE
                }
              "
            />
            <label for="dateRange">Date</label>
          </div>
          <div class="range-data">
            <div class="range-field">
              <label for="fromId">from</label>
              <div class="input-wrapper">
                <input
                  id="fromDate"
                  class="setting-input"
                  type="date"
                  :value="startDate"
                  @input="(event: Event) => {
                if (event.target) {
                  settingsUpdate.lowerDate = createStartOfDayDate(createDate(event.target))
                }
              }"
                />
              </div>
            </div>
            <div class="range-field">
              <label for="toId">to</label>
              <div class="input-wrapper">
                <input
                  id="toDate"
                  class="setting-input"
                  type="date"
                  :value="endDate"
                  @input="(event: Event) => {
                if (event.target) {
                  settingsUpdate.upperDate = createEndOfDayDate(createDate(event.target))
                }
              }"
                />
              </div>
            </div>
            <HelpIcon id="dateHelp" tooltip="Limits to games played within those dates" />
          </div>
        </div>
      </div>
      <div id="aggregation" class="element">
        <div class="setting">
          <div>
            <input
              type="radio"
              id="sum-aggregation"
              class=""
              name="aggregation"
              value="sum"
              :checked="settingsUpdate.aggregation == Aggregation.SUM"
              @input="
                () => {
                  settingsUpdate.aggregation = Aggregation.SUM
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
              :checked="settingsUpdate.aggregation == Aggregation.WINDOW"
              @input="
                () => {
                  settingsUpdate.aggregation = Aggregation.WINDOW
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
              v-model="settingsUpdate.windowSize"
            />
          </div>
          <HelpIcon
            id="windowHelp"
            tooltip="Calculates the win ratio of all series of <n> consecutive games as separate values (1..n, 2..n+1, ...)"
          />
        </div>
      </div>
    </div>
  </div>
  <div class="separator" />
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useMatchStore } from '@/pinia/store'
import HelpIcon from '@/common/HelpIcon.vue'
import {
  Aggregation,
  createEndOfDayDate,
  createStartOfDayDate,
  htmlFormatDate,
  Range
} from '@/rating/store'
import IconButton from '@/common/IconButton.vue'
import applyIcon from '../../icons/applyIcon.png'
import removeIcon from '../../icons/removeIcon.png'
import resetIcon from '../../icons/resetIcon.png'
import { computed } from 'vue'
import Color from 'color'

const { editedConfig, errorMessage } = storeToRefs(useMatchStore())

const settingsUpdate = computed(() => {
  return editedConfig.value?.settings.buildSettingsUpdate()!
})

const startDate = computed(() => {
  return htmlFormatDate(settingsUpdate.value.lowerDate)
})

const endDate = computed(() => {
  return htmlFormatDate(settingsUpdate.value.upperDate)
})

const tooltipGradient = computed(() => {
  return (
    'linear-gradient(to bottom, ' +
    new Color(editedConfig.value?.color).darken(0.2).rgb() +
    ', ' +
    editedConfig.value?.color +
    ')'
  )
})

const tooltipColor = computed(() => {
  return new Color(editedConfig.value?.color).isLight() ? 'black' : 'white'
})

function update() {
  if (editedConfig.value && settingsUpdate) {
    editedConfig.value.updateIfChanged(settingsUpdate.value, errorMessage)
  }
}

function createDate(element: EventTarget): Date {
  return new Date((element as HTMLInputElement).value)
}
</script>

<style scoped>
#aggregation,
#ranges {
  width: fit-content;
}

.editingPane {
  background: var(--color-element-background);
  border: 2px black solid;
  border-radius: 2em;
  margin: 0.5em auto;
  width: fit-content;
}

.element {
  background: var(--color-sub-section-background);
  border: 1px solid black;
  border-radius: var(--border-radius-element);
  margin: 0.25em;
  padding: 0.25em;
}

.input-wrapper {
  margin-right: 0.75em;
  width: 7em;
}

.range-data,
.range-field {
  display: flex;
  flex-flow: row wrap;
  gap: 0.5em;
}

.setting {
  display: flex;
  gap: 0.5em;
}

#settings {
  display: flex;
  flex-flow: row wrap;
  padding: 0.5em;
}

.setting-input {
  text-align: right;
  width: 100%;
}

.spaced {
  justify-content: space-between;
}

#title {
  margin: auto 0;
}

#title-bar {
  border-start-end-radius: 2em;
  border-start-start-radius: 2em;
  display: flex;
  justify-content: center;
}
</style>
