<script setup lang="ts">
import * as Plot from '@observablehq/plot'
import { h, withDirectives } from 'vue'
import type { BaseType } from 'd3'
import * as d3 from 'd3'
import Color from 'color'
import tippy, { Instance } from 'tippy.js'

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
          plotDom
            .attr('style', 'background:var(--color-element-background)')
            .attr('font-size', '1em')
            .attr('border', '2px black solid')
          const dot = plotDom.append('g').attr('display', 'none')
          dot.append('circle').attr('r', '0.25em').attr('stroke-width', '0.15em')

          const xPx = plot.scale('x')?.apply
          const yPx = plot.scale('y')?.apply
          const dataPx = props.options.marks
            .filter((mark) => mark.z)
            .flatMap((mark) => {
              return mark.data.map((data) => {
                const x = xPx ? xPx(data.index) : 0
                const y = yPx ? yPx(data.ratio * 100) : 0
                return {
                  x: x,
                  y: y,
                  title: data.title,
                  index: data.index,
                  ratio: data.ratio
                }
              })
            })

          const tooltip: Instance = tippy(dot.node())

          plotDom
            .selectAll('title')
            .nodes()
            .forEach((node) => {
              const d3Node = d3.select(node).nodes()[0]
              if ('parentNode' in d3Node && 'parentNode' in d3Node.parentNode) {
                // noinspection TypeScriptValidateTypes
                lines.set(d3.select(node).text(), d3Node.parentNode.parentNode)
              }
            })

          let mouseHasMoved = false
          let tippyEnabled = false

          function showTippy() {
            tippyEnabled = true
            dot.attr('display', null)
            tooltip.show()
          }

          tooltip.props.onShow = () => {
            if (!tippyEnabled) {
              return false
            }
          }

          tooltip.props.onHide = () => {
            if (tippyEnabled) {
              return false
            }
          }

          plotDom.on('pointerenter', () => {
            if (mouseHasMoved) {
              showTippy()
            }
          })

          plotDom.on('pointerleave', () => {
            tippyEnabled = false
            tooltip.hide()
            dot.attr('display', 'none')
            lines.forEach((line) => {
              d3.select(line).attr('stroke-opacity', '1')
            })
          })

          plotDom.on('pointermove', (event: MouseEvent) => {
            if (!mouseHasMoved) {
              mouseHasMoved = true
              showTippy()
            }
            const [ex, ey] = d3.pointer(event)
            const closest = d3.least(dataPx, (dataPoint) =>
              Math.hypot(dataPoint.x - ex, dataPoint.y - ey)
            )

            let stroke = undefined

            lines.forEach((line, title) => {
              if (title === closest.title) {
                const graphLine = d3.select(line)
                stroke = graphLine.attr('stroke')
                graphLine.attr('stroke-opacity', '1').raise()
              } else {
                d3.select(line).attr('stroke-opacity', '0.2')
              }
            })

            dot
              .attr('transform', `translate(${closest.x},${closest.y})`)
              .attr('stroke', stroke)
              .attr('fill', Color(stroke).lightness(50).rgb().string())
              .attr('display', null)
              .raise()

            tooltip.setProps({ content: closest.title })
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
