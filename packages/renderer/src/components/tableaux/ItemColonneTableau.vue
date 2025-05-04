<template>
  <v-list-item
    v-bind="$attrs"
    :title="nomVariable || info.id"
  >
    <template
      v-if="nomVariable !== info.id"
      #subtitle
    >
      {{ info.id }}
    </template>
  </v-list-item>
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
