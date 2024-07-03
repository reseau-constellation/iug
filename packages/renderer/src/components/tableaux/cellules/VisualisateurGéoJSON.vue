<template>
  <l-map
    v-if="valid"
    ref="map"
    :use-global-leaflet="false"
  >
    <l-tile-layer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      layer-type="base"
      name="OpenStreetMap"
    >
    </l-tile-layer>
    <l-geo-json
      :geojson="geojson"
    />
  </l-map>
  <p v-else>
    {{ 'Données GéoJSON erronnées' }}
  </p>
</template>
<script setup lang="ts">
import type {GeoJsonObject} from 'geojson';

import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LGeoJson } from '@vue-leaflet/vue-leaflet';
import { computed } from 'vue';
import gjv from 'geojson-validation';

const props = defineProps<{geojson: GeoJsonObject | GeoJsonObject[]}>();

const valid = computed(()=>{
  if (Array.isArray(props.geojson)) return props.geojson.every(x=>gjv.valid(x));
  else return gjv.valid(props.geojson);
});


</script>