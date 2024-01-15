<template>
  <v-list-item>
    <template #prepend>
      <v-icon
        start
        :color="licenceApprouvée ? 'primary' : 'error'"
      >
        {{ licenceApprouvée ? 'mdi-scale-balance' : 'mdi-alert' }}
      </v-icon>
    </template>
    <v-list-item-title>
      {{ licenceApprouvée ? t(`licences.info.${licence}.abr`) : licence }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import type {licences} from '@constl/ipa';

import {computed, ref} from 'vue';
import {constellation, enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const props = defineProps<{licence: string | undefined}>();

// Info licence
const infoLicences = ref<{[clef: string]: licences.InfoLicence}>();
enregistrerÉcoute(
  constl.licences.suivreLicences({
    f: x => (infoLicences.value = x),
  }),
);
const licenceApprouvée = computed(() => {
  return (
    props.licence && infoLicences.value && Object.keys(infoLicences.value).includes(props.licence)
  );
});
</script>
