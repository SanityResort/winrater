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
          for (let callback of callbacks) {
            plotDom.on(callback[0], callback[1])
          }
          const dot = plotDom.append('g').attr('display', 'none')
          dot.append('circle').attr('r', 2)

          plotDom.on('pointerenter', () => {
            dot.attr('display', null)
          })

          plotDom.on('pointerleave', () => {
            dot.attr('display', 'none')
          })

          plotDom.on('pointermove', (event: MouseEvent) => {
            const xPx = plot.scale('x')?.apply
            const yPx = plot.scale('y')?.apply
            const [ex, ey] = d3.pointer(event)
            const closest = d3.least(
              props.options.marks
                .filter((mark) => mark.z)
                .flatMap((mark) => {
                  return mark.data.map((data) => {
                    const x = xPx ? xPx(data.index) : 0
                    const y = yPx ? yPx(data.ratio * 100) : 0
                    return {
                      x: x,
                      y: y,
                      z: mark.z,
                      stroke: mark.stroke,
                      distance: Math.hypot(x - ex, y - ey)
                    }
                  })
                }),
              (point) => point.distance
            )
            dot
              .attr('transform', `translate(${closest.x},${closest.y})`)
              .attr('stroke', closest.stroke)
              .attr('fill', closest.stroke)
              .attr('display', null)
          })
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
