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
import {utiliserNumération} from '/@/plugins/localisation/localisation';

import {obtIcôneContact} from './utils';

const props = defineProps<{type: string; contact: string}>();

const {formatterNuméro} = utiliserNumération();

const icône = computed(() => {
  return obtIcôneContact({type: props.type});
});
const numéroFormatté = formatterNuméro(props.contact);
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
