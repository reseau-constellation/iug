<template>
  <v-list-item prepend-icon="mdi-lightning-bolt">
    <v-list-item-title>
      {{ t('automatisations.item.titre', nAutomatisationsObjet) }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {computed, ref} from 'vue';
import {constellation, enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{
  idObjet: string;
}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Automatisations
const automatisations = ref<automatisation.SpécificationAutomatisation[]>();
enregistrerÉcoute(
  constl.automatisations.suivreAutomatisations({
    f: x => (automatisations.value = x),
  }),
);
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
