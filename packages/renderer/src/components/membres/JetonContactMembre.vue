<template>
  <v-chip
    variant="outlined"
    :prepend-icon="icône"
    @click="copierContact"
  >
    {{ contactFormatté }}
  </v-chip>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {utiliserNumération} from '/@/plugins/localisation/localisation';

import {copier} from '/@/utils';

const props = defineProps<{type: string; contact: string}>();

const {formatterNuméro} = utiliserNumération();

const icône = computed(() => {
  switch (props.type) {
    case 'courriel':
      return 'mdi-email-outline';
    case 'téléphone':
      return 'mdi-phone';
    case 'whatsapp':
      return 'mdi-whatsapp';
    case 'telegram':
      return 'mdi-send';
    default:
      return 'mdi-account';
  }
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

const copierContact = async () => {
  await copier(props.contact);
};
</script>
