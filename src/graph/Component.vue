<script lang="ts" setup>
import * as Plot from '@observablehq/plot'
import { onMounted, onUnmounted } from 'vue'
import { InternSet } from 'd3'
import { useMatchStore } from '@/pinia/store'
import { storeToRefs } from 'pinia'
import PlotFigure from '@/graph/PlotFigure.vue'

const matchStore = useMatchStore()

const { stores, modificationCounter } = storeToRefs(matchStore)

function dataMarks() {
  const lines = []
  for (const value of stores.value.values()) {
    let counter = 0
    value.graphs().forEach((graph) => {
      lines.push(
        Plot.line(graph.dataPoints, {
          x: 'index',
          y: 'ratio',
          z: value.coachName + '_' + counter++
        })
      )
    })
  }
  return lines
}

function ticks() {
  const xValues: number[] = []

  for (const value of stores.value.values()) {
    value
      .graphs()
      .flatMap((data) => data.dataPoints)
      .forEach((dataPoint) => xValues.push(dataPoint.index))
  }

  return Math.min(new InternSet(xValues).size, parentWidth() / 50)
}

function parentWidth() {
  return window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', resizeCallback)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCallback)
})

const resizeCallback = () => {
  modificationCounter.value += 1
}
</script>

<style scoped></style>

<template>
  <div id="plot">
    <PlotFigure
      :key="modificationCounter"
      :options="{
        width: parentWidth(),
        marks: [...dataMarks(), Plot.ruleY([0]), Plot.ruleX([0], { x: 0, y1: 0, y2: 1 })],
        y: {
          percent: true,
          grid: true,
          label: '',
          labelArrow: 'none',
          ticks: 20
        },
        x: {
          label: '',
          labelArrow: 'none',
          ticks: ticks()
        }
      }"
    />
  </div>
</template>