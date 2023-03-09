<template>
  <v-chip
    variant="outlined"
    label
    :prepend-icon="licenceApprouvée ? 'mdi-scale-balance' : 'mdi-alert'"
    :color="licenceApprouvée ? 'secondary' : 'error'"
  >
    {{ licence ? 'mdi-scale-balance' : 'mdi-alert-outline' }}
  </v-chip>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {InfoLicence} from '@constl/ipa/dist/src/licences';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/composables/utils';

const constl = inject<ClientConstellation>('constl');

const props = defineProps<{licence: string}>();

// Info licence
const infoLicences = ref<{[clef: string]: InfoLicence}>();
enregistrerÉcoute(
  constl?.suivreLicences({
    f: x => (infoLicences.value = x),
  }),
);
const licenceApprouvée = computed(() => {
  return infoLicences.value && Object.keys(infoLicences.value).includes(props.licence);
});
</script>
