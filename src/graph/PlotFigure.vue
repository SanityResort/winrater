<script setup lang="ts">
import * as Plot from '@observablehq/plot'
import { computed, h, ref, withDirectives } from 'vue'
import type { BaseType } from 'd3'
import * as d3 from 'd3'
import Color from 'color'
import tippy, { Content, Instance } from 'tippy.js'

const props = defineProps(['options'])

const lines = new Map<string, BaseType>()

let stroke = ref('rgb(0, 0,0)')
const tooltipGradient = computed(() => {
  return (
    'linear-gradient(to bottom, ' +
    stroke.value +
    ', ' +
    new Color(stroke.value).lighten(0.2).rgb() +
    ')'
  )
})

const tooltipColor = computed(() => {
  return new Color(stroke.value).isLight() ? 'black' : 'white'
})

let closest = ref({ x: 0, y: 0, title: '', index: 0, ratio: 0 })

type DataPoint = {
  x: number
  y: number
  title: string
  index: number
  ratio: number
}

let tooltip: Instance

// this allows to create the plot using the render tag in template
// noinspection JSUnusedGlobalSymbols
const render = () => {
  return withDirectives(h('div'), [
    [
      {
        unmounted() {
          if (tooltip) {
            tooltip.destroy()
          }
        },
        mounted(el) {
          const plot = Plot.plot(props.options)
          el.append(plot)

          const plotDom = d3.select(plot)
          plotDom
            .attr('style', 'background:var(--color-element-background)')
            .attr('font-size', '1em')
          const dot = plotDom.append('g').attr('display', 'none')
          dot.append('circle').attr('r', '0.25em').attr('stroke-width', '0.15em').attr('id', 'dot')

          const xPx = plot.scale('x')?.apply
          const yPx = plot.scale('y')?.apply
          const dataPx: DataPoint[] = props.options.marks
            .filter((mark: any) => mark.z)
            .flatMap((mark: any) => {
              return mark.data.map((data: DataPoint) => {
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

          tooltip = tippy('#dot')[0]

          plotDom
            .selectAll('title')
            .nodes()
            .forEach((node) => {
              const d3Node = d3.select(node).nodes()[0]
              if (
                d3Node &&
                'parentNode' in d3Node &&
                d3Node.parentNode &&
                'parentNode' in d3Node.parentNode &&
                d3Node.parentNode.parentNode
              ) {
                // noinspection TypeScriptValidateTypes
                lines.set(d3.select(node).text(), d3Node.parentNode.parentNode as BaseType)
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
            if (tippyEnabled || (tooltip && tooltip.state && tooltip.state.isDestroyed)) {
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
            const foundPoint = d3.least(dataPx, (dataPoint) =>
              Math.hypot(dataPoint.x - ex, dataPoint.y - ey)
            )
            if (foundPoint) {
              closest.value = foundPoint
            }

            lines.forEach((line, title) => {
              if (title === closest.value.title) {
                const graphLine = d3.select(line)
                stroke.value = graphLine.attr('stroke')
                graphLine.attr('stroke-opacity', '1').raise()
              } else {
                d3.select(line).attr('stroke-opacity', '0.2')
              }
            })

            dot
              .attr('transform', `translate(${closest.value.x},${closest.value.y})`)
              .attr('stroke', stroke.value)
              .attr('fill', Color(stroke.value).lighten(0.1).rgb().string())
              .attr('display', null)
              .raise()

            tooltip.setProps({ content: document.getElementById('tooltip-content') as Content })
          })
        }
      }
    ]
  ])
}
</script>
<template>
  <div id="tooltip">
    <div id="tooltip-content">
      <div id="title" :style="{ background: tooltipGradient, color: tooltipColor }">
        {{ closest.title }}
      </div>
      <div id="content">
        <div class="contentItem">Win% {{ Math.round(closest.ratio * 10000) / 100 }}</div>
        <div class="contentItem">Match #{{ closest.index }}</div>
      </div>
    </div>
  </div>
  <!--suppress HtmlUnknownTag -->
  <render />
</template>

<style scoped>
#tooltip {
  display: none;
}

#tooltip-content {
  border: 1px black solid;
  border-radius: var(--border-radius-element);
}

#title {
  border-start-start-radius: var(--border-radius-element);
  border-start-end-radius: var(--border-radius-element);
  padding: 0.2em;
  text-align: center;
}
#content {
  background: white;
  border-end-start-radius: var(--border-radius-element);
  border-end-end-radius: var(--border-radius-element);
  padding: 0.25em;
}
</style>
