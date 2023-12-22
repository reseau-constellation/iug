<template>
  <div class="text-center">
    <p class="pt-6 text-h6">{{ titre }}</p>
    <div
      v-show="assezDeDonnées"
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
    <v-card
      v-if="!assezDeDonnées"
      class="d-flex align-center text-center"
      variant="flat"
      height="230"
    >
      <span class="pa-4 ma-auto text-h6 text-center text-disabled">
        Il n'y a pas encore assez de données à visualiser
      </span>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watchEffect } from 'vue';
import {axisBottom, axisLeft, line, max, scaleLinear, scaleTime, select, extent, curveBasis} from 'd3';
import { computed } from 'vue';
import { எண்களைப்_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const props = defineProps<{titre: string; vals?: {date: string, val: number}[], couleur?: string}>();
const données = computed(()=>(props.vals || []).map(x=>({date: new Date(parseInt(x.date)), value: x.val})));
const data = computed(()=>props.vals ? données.value : autos.value);
const autos = ref<{date: Date, value: number}[]>([]);
const svgRef = ref(null);

const assezDeDonnées = computed(()=>{
  return data.value.length > 1;
});

// https://dev.to/muratkemaldar/using-vue-3-with-d3-composition-api-3h1g
onMounted(()=>{
    const svg = select(svgRef.value);
    if (!props.vals)
      setInterval(()=>{
        autos.value = [...autos.value, {date: new Date(), value: Math.ceil(Math.random() * 10)}];
      }, 2000);
    watchEffect(() => {
      const { width, height } = resizeState.dimensions;
      if (!(width && height)) return;

      const x = scaleTime()
          .domain(extent(data.value, d=>d.date) as [Date, Date]) // input values...
          .range([0, width]); // ... output values

        const y = scaleLinear()
          .domain([0, max(data.value, d => d.value)] as [number, number]) // input values...
          .range([height, 0]); // ... output values

        svg
          .selectAll<SVGSVGElement, unknown>('.line') // get all "existing" lines in svg
          .data([data.value]) // sync them with our data
          .join('path')

          // everything after .join() is applied to every "new" and "existing" element
          .attr('class', 'line') // attach class (important for updating)
          
          .attr('fill', 'none')
          .attr('stroke', props.couleur || 'steelblue')
          .attr('stroke-width', 2.5)
          .attr('d', line<{date: Date, value: number}>()
            .x((d: {date: Date, value: number})=> x(d.date))
            .y((d: {date: Date, value: number})=> y(d.value))
            .curve(curveBasis),
          );

        // render axes with help of scales
        // (we let Vue render our axis-containers and let D3 populate the elements inside it)
        const xAxis = axisBottom(x);
        
        svg
          .select<SVGSVGElement>('.x-axis')
          .style('transform', `translateY(${height}px)`) // position on the bottom
          .call(xAxis)
          .append('text');

        const yAxis = axisLeft(y);
        // À faire - éviter fuite mémoire
        yAxis.tickFormat(x=>எண்ணை_வடிவூட்டு(x.valueOf()).value);
        svg.select<SVGSVGElement>('.y-axis').call(yAxis);
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
<style scoped>
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