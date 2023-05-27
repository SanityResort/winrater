<script lang="ts" setup>
import * as Plot from '@observablehq/plot'
import PlotFigure from './PlotFigure.vue'
import { computed, ref } from 'vue'
import { InternSet } from 'd3'

const allData = ref([])
allData.value.push(newData(1))

const size = computed(() => {
  return allData.value.flatMap((dataElem) => dataElem).length
})

function newData(base): { x: number; y: number; z: number }[] {
  let x = base
  const newData = []
  for (let index = 0; index < 5; index++) {
    newData.push(newElem(x++, allData.value.length))
  }

  return newData
}

function newElem(x: number, z: number) {
  return { x: x, y: Math.round(Math.random() * 100) / 100, z: z }
}

function addDataElem() {
  const size = allData.value.length
  const index: number = Math.round(Math.random() * (size - 1))
  const dataAtIndex = allData.value[index]
  dataAtIndex.push(newElem(dataAtIndex.length + 1, index))
}

function addData() {
  allData.value.push(newData(allData.value.length + 1))
}

const dataMarks = computed(() => {
  return allData.value.map((singleData) => {
    return Plot.line(singleData, {
      x: 'x',
      y: 'y',
      z: 'z'
    })
  })
})

const ticks = computed(() => {
  return new InternSet(
    allData.value.flatMap((singleData) => {
      return singleData.map((dataElem) => {
        return dataElem.x
      })
    })
  ).size
})
</script>

<style scoped></style>

<template>
  <button @click.prevent="addDataElem">Element Button</button>
  <button @click.prevent="addData">Data Button</button>

  <PlotFigure
    :key="size"
    :options="{
      marks: [...dataMarks, Plot.ruleY([0]), Plot.ruleX([0], { x: 1, y1: 0, y2: 1 })],
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
        ticks
      }
    }"
  />
</template>
