<script lang="ts" setup>
import * as Plot from '@observablehq/plot'
import PlotFigure from './PlotFigureClient.js'
import { ref } from 'vue'

const data = ref([
  { x: 1, y: 2, z: 1 },
  { x: 2, y: 5, z: 1 },
  { x: 3, y: 3, z: 1 },
  { x: 4, y: 4, z: 1 },
  { x: 5, y: 6, z: 1 }
])

function addData() {
  data.value.push({ x: data.value.length, y: 1, z: 1 })
}
</script>

<style scoped></style>

<template>
  <button @click.prevent="addData">Button</button>

  <PlotFigure
    :key="data.length"
    :options="{
      marks: [
        Plot.line(data.values(), {
          x: 'x',
          y: 'y',
          z: 'z'
        })
      ]
    }"
  />
</template>
