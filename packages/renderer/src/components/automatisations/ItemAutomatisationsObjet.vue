<template>
  <v-list-item prepend-icon="mdi-lightning-bolt">
    <v-list-item-title>
      {{ t('automatisations.item.titre', nAutomatisationsObjet) }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';

const props = defineProps<{
  idObjet: string;
}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Automatisations
const automatisations = suivre(constl.automatisations.suivreAutomatisations);
const automatisationsObjet = computed(() => {
  return automatisations.value
    ? automatisations.value.filter(
        a => (a.type === 'exportation' ? a.idObjet : a.idTableau) === props.idObjet,
      )
    : undefined;
});

const nAutomatisationsObjet = computed(() => {
  return automatisationsObjet.value?.length || 0;
});
</script>
