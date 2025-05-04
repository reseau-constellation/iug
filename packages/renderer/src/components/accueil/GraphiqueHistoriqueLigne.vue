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
      <slot name="action">
        <span class="mx-auto mb-6 text-h6 text-center text-disabled">
          {{ t('accueil.page.graphiques.sansDonnées') }}
        </span>
      </slot>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import {எண்களைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {
  axisBottom,
  axisLeft,
  curveBasis,
  extent,
  line,
  max,
  scaleLinear,
  scaleTime,
  select,
} from 'd3';
import {type Ref, computed, onBeforeUnmount, onMounted, reactive, ref, watchEffect} from 'vue';

const props = defineProps<{
  titre: string;
  vals?: {date: string; val: number}[];
  couleur?: string;
}>();

const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const données = computed(() =>
  (props.vals || []).map(x => ({date: new Date(parseInt(x.date)), value: x.val})),
);
const svgRef = ref(null);

const assezDeDonnées = computed(() => {
  return données.value.length > 1;
});

const formatteurs: {[chiffre: string]: Ref<string | undefined>} = {};

const formatterChiffre = (x: number): string => {
  if (!formatteurs[x.toString()]) {
    formatteurs[x.toString()] = எண்ணை_வடிவூட்டு(x);
  }
  return formatteurs[x.toString()].value || x.toString();
};

// https://dev.to/muratkemaldar/using-vue-3-with-d3-composition-api-3h1g
onMounted(() => {
  const svg = select(svgRef.value);

  watchEffect(() => {
    const {width, height} = resizeState.dimensions;
    if (!(width && height)) return;

    const x = scaleTime()
      .domain(extent(données.value, d => d.date) as [Date, Date]) // input values...
      .range([0, width]); // ... output values

    const y = scaleLinear()
      .domain([0, max(données.value, d => d.value)] as [number, number]) // input values...
      .range([height, 0]); // ... output values

    svg
      .selectAll<SVGSVGElement, unknown>('.line') // get all "existing" lines in svg
      .data([données.value]) // sync them with our data
      .join('path')

      // everything after .join() is applied to every "new" and "existing" element
      .attr('class', 'line') // attach class (important for updating)

      .attr('fill', 'none')
      .attr('stroke', props.couleur || 'steelblue')
      .attr('stroke-width', 2.5)
      .attr(
        'd',
        line<{date: Date; value: number}>()
          .x((d: {date: Date; value: number}) => x(d.date))
          .y((d: {date: Date; value: number}) => y(d.value))
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

    yAxis.tickFormat(x => formatterChiffre(x.valueOf()));
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
  return {resizeState, resizeRef};
};
const {resizeRef, resizeState} = useResizeObserver();
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
