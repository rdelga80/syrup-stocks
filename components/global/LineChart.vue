<template>
  <svg width="500" height="400"></svg>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropOptions } from '@nuxtjs/composition-api'
import * as d3 from 'd3'
import { formatDate, formatNumber } from '@/assets/js/utilities'

import { FormattedAggregatedStockExchange } from '@/store'

export default defineComponent({
  name: 'LineChart',
  props: {
    chartData: {
      type: Array,
      required: true
    } as PropOptions<FormattedAggregatedStockExchange[]>
  },
  
  setup(props) {
    const generateLineChart = async () => {

      const svg = d3.select('svg'),
            margin = 200,
            width = svg.attr('width') - margin,
            height = svg.attr('height') - margin
      
      const x = d3.scaleBand().range([0, width]).padding(0.1),
            y = d3.scaleLinear().range([height, 0])
      
      const g = svg.append('g')
                  .attr('transform', `translate(${100},${100})`)
      
      // const csvData = await d3.csv('/aggregated_stock_exchange.csv', data => ({
      //   date: formatDate(data.date),
      //   totalRev: formatNumber(data.total_rev, true),
      //   totalVol: formatNumber(data.total_vol)
      // }))

      const parseDate = d3.timeFormat('%m-%d-%Y')


      d3.csv('/aggregated_stock_exchange.csv').then(data => {
        data.forEach(d => {
          d.date = parseDate(new Date(d.date))
          d.total_rev = +d.total_rev
          d.total_vol = +d.total_vol
        })

        // console.log(data)

        x.domain(data.map(d => d.total_date))
        y.domain([0, d3.max(data, d => d.total_rev)])

        g.append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(x).ticks(5))
        
        // g.append('g')
        //   .call(d3.axisLeft(y).tickFormat(d => `$${d}`).ticks(10))
        //   .append('text')
        //   .attr('y', 6)
        //   .attr('dy', '0.71em')
        //   .attr('text-anchor', 'end')
        //   .text('value')
      })
    }

    onMounted(() => {
      generateLineChart()
    })
  }
})
</script>

