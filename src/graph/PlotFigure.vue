<script setup lang="ts">
import * as Plot from '@observablehq/plot'
import { h, withDirectives } from 'vue'
import * as d3 from 'd3'

const props = defineProps(['options', 'callbacks'])

// this allows to create the plot using the render tag in template
// noinspection JSUnusedGlobalSymbols
const render = () => {
  return withDirectives(h('div'), [
    [
      {
        mounted(el) {
          const plot = Plot.plot(props.options)
          el.append(plot)

          const callbacks: Map<string, (event: MouseEvent) => void> = props.callbacks
          const plotDom = d3.select(plot)
          console.log('# of callbacks:' + callbacks.size)
          for (let callback of callbacks) {
            console.log('Callback ' + callback)
            plotDom.on(callback[0], callback[1])
          }
        }
      }
    ]
  ])
}
</script>
<template>
  <!--suppress HtmlUnknownTag -->
  <render />
</template>
