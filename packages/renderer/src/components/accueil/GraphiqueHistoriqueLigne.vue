<template>
  <div class="text-center">
    <p class="text-h6">{{titre}}</p>
    <div
      ref="resizeRef"
      class="ma-6"
    >
      <svg
        ref="svgRef"
        width="100%"
      >
        <g class="x-axis" />
        <g class="y-axis" />
      </svg>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watchEffect } from 'vue';
import {axisBottom, axisLeft, line, max, scaleLinear, scaleTime, select, extent} from 'd3';

const props = defineProps<{titre: string; vals: {[clef: string]: {à: number, val: number}[]}}>();
const data = ref<{date: Date, value: number}[]>([]);
const svgRef = ref(null);

// https://dev.to/muratkemaldar/using-vue-3-with-d3-composition-api-3h1g
onMounted(()=>{
    const svg = select(svgRef.value);
    setInterval(()=>{
      data.value = [...data.value, {date: new Date(), value: Math.ceil(Math.random() * 10)}];
    }, 2000);
    watchEffect(() => {
      const { width, height } = resizeState.dimensions;
      const x = scaleTime()
          .domain(extent(data.value, d=>d.date)) // input values...
          .range([0, width]); // ... output values

        const y = scaleLinear()
          .domain([0, max(data.value, d => d.value)]) // input values...
          .range([height, 0]); // ... output values

        svg
          .selectAll('.line') // get all "existing" lines in svg
          .data([data.value]) // sync them with our data
          .join('path')
          // .append("path")
          // .datum(data.value)
          // everything after .join() is applied to every "new" and "existing" element
          .attr('class', 'line') // attach class (important for updating)
          
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 2.5)
          .attr('d', line()
            .x(d=> x(d.date))
            .y(d=> y(d.value)),
            );

        // render axes with help of scales
        // (we let Vue render our axis-containers and let D3 populate the elements inside it)
        const xAxis = axisBottom(x);
        svg
          .select('.x-axis')
          .style('transform', `translateY(${height}px)`) // position on the bottom
          .call(xAxis)
          .append('text');

        const yAxis = axisLeft(y);
        svg.select('.y-axis').call(yAxis);
    });
});

const useResizeObserver = () => {
  // create a new ref, 
  // which needs to be attached to an element in a template
  const resizeRef = ref();
  const resizeState = reactive<{dimensions: {width?: number; height?: number}}>({
    dimensions: {},
  });

  const observer = new ResizeObserver(entries => {
    // called initially and on resize
    entries.forEach(entry => {
      resizeState.dimensions = entry.contentRect;
    });
  });

  onMounted(() => {
    // set initial dimensions right before observing: Element.getBoundingClientRect()
    resizeState.dimensions = resizeRef.value.getBoundingClientRect();
    observer.observe(resizeRef.value);
  });

  onBeforeUnmount(() => {
    observer.unobserve(resizeRef.value);
  });

  // return to make them available to whoever consumes this hook
  return { resizeState, resizeRef };
};
const { resizeRef, resizeState } = useResizeObserver();
</script>
<style>
svg {
  /* important for responsiveness */
  display: block;
  fill: none;
  stroke: none;
  width: 100%;
  height: 100%;
  overflow: visible;
}
</style>