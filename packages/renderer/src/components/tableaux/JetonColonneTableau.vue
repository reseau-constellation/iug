<template>
  <v-chip
    label
    variant="outlined"
  >
    {{ nomVariable || info.id }}
  </v-chip>
</template>
<script setup lang="ts">
import type {tableaux} from '@constl/ipa';
import {suivre} from '@constl/vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {utiliserConstellation} from '../utils';

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const constl = utiliserConstellation();

const props = defineProps<{info: tableaux.InfoCol}>();

const nomsVariable = suivre(constl.variables.suivreNomsVariable, {
  idVariable: computed(() => props.info.variable),
});
const nomVariable = அகராதியிலிருந்து_மொழிபெயர்ப்பு(nomsVariable);
</script>
