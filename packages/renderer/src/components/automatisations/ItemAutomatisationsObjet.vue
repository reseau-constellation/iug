<template>
  <v-list-item prepend-icon="mdi-lightning-bolt">
    <v-list-item-title>
      {{ t('automatisations.item.titre', nAutomatisationsObjet) }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import {computed} from 'vue';
import {suivre} from '@constl/vue';

import {utiliserConstellation} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{
  idObjet: string;
}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

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
