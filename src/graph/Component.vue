<script lang="ts" setup>
import * as Plot from '@observablehq/plot'
import { Line } from '@observablehq/plot'
import PlotFigure from './PlotFigure.vue'
import { computed, ref } from 'vue'

const data = ref([])
data.value.push(newData(1))

const size = computed(() => {
  const length = data.value.flatMap((dataElem) => dataElem).length
  console.log('Size: ' + length)
  return length
})

function newData(base): { x: number; y: number; z: number }[] {
  let x = base
  const newData = []
  for (let index = 0; index < 5; index++) {
    newData.push(newElem(x++, data.value.length))
  }

  return newData
}

function newElem(x: number, z: number) {
  return { x: x, y: Math.round(Math.random() * 10), z: z }
}

function addDataElem() {
  const size = data.value.length
  const index: number = Math.round(Math.random() * (size - 1))
  const dataAtIndex = data.value[index]
  console.log('Data: ' + data.value)
  console.log('Index: ' + index)
  console.log('DataAtIndex: ' + dataAtIndex)
  dataAtIndex.push(newElem(dataAtIndex.length + 1, index))
}

function addData() {
  data.value.push(newData(data.value.length + 1))
}

function dataMarks(): Line[] {
  return data.value.map((dataELem) => {
    console.log('Generating marks for: ' + JSON.stringify(dataELem))
    return Plot.line(dataELem, {
      x: 'x',
      y: 'y',
      z: 'z'
    })
  })
}
</script>

<style scoped></style>

<template>
  <button @click.prevent="addDataElem">Element Button</button>
  <button @click.prevent="addData">Data Button</button>

  <PlotFigure
    :key="size"
    :options="{
      marks: dataMarks()
    }"
  />
</template>
