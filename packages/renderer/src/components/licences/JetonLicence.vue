<template>
  <v-chip
    variant="outlined"
    label
  >
    <template #prepend>
      <v-icon
        start
        :color="licenceApprouvée ? 'primary' : 'error'"
      >
        {{ licenceApprouvée ? 'mdi-scale-balance' : 'mdi-alert' }}
      </v-icon>
    </template>
    {{
      licenceApprouvée
        ? t(`licences.info.${licence}.abr`)
        : licence
          ? licence
          : t('licences.jetonAucune')
    }}
  </v-chip>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {suivre} from '@constl/vue';

import {utiliserConstellation} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const props = defineProps<{licence: string | undefined}>();

// Info licence
const infoLicences = suivre(constl.licences.suivreLicences);
const licenceApprouvée = computed(() => {
  return (
    props.licence && infoLicences.value && Object.keys(infoLicences.value).includes(props.licence)
  );
});
</script>
