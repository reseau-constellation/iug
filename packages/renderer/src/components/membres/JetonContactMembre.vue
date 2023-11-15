<template>
  <v-chip
    class="ma-2"
    variant="outlined"
    label
    :prepend-icon="icône"
  >
    {{ contactFormatté }}
  </v-chip>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import { எண்களைப்_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

import {obtIcôneContact} from './utils';

const props = defineProps<{type: string; contact: string}>();

const {எண்_எழுத்து_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const icône = computed(() => {
  return obtIcôneContact({type: props.type});
});
const numéroFormatté = எண்_எழுத்து_வடிவூட்டு(props.contact);
const contactFormatté = computed(() => {
  switch (props.type) {
    case 'téléphone':
    case 'whatsapp':
    case 'telegram':
      return numéroFormatté.value;
    default:
      return props.contact;
  }
});
</script>
