<script setup lang="ts">
import * as Plot from '@observablehq/plot'
import { h, withDirectives } from 'vue'
import * as d3 from 'd3'
import type { BaseType } from 'd3'

const props = defineProps(['options'])

const lines = new Map<string, BaseType>()

// this allows to create the plot using the render tag in template
// noinspection JSUnusedGlobalSymbols
const render = () => {
  return withDirectives(h('div'), [
    [
      {
        mounted(el) {
          const plot = Plot.plot(props.options)
          el.append(plot)

          const plotDom = d3.select(plot)
          const dot = plotDom.append('g').attr('display', 'none')
          dot.append('circle').attr('r', 2)

          plotDom
            .selectAll('title')
            .nodes()
            .forEach((node) =>
              lines.set(d3.select(node).text(), d3.select(node).nodes()[0].parentNode.parentNode)
            )

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
                      title: data.title,
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

            lines.forEach((line, title) => {
              d3.select(line).attr('stroke', title === closest.title ? 'red' : ' green')
            })
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
