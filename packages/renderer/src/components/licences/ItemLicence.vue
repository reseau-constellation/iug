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
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const props = defineProps<{licence: string | undefined}>();

// Info licence
const infoLicences = suivre(constl.licences.suivreLicences);
const licenceApprouvée = computed(() => {
  return !!(
    props.licence &&
    infoLicences.value &&
    Object.keys(infoLicences.value).includes(props.licence)
  );
});
</script>
