<template>
  <v-tooltip :text="texteIndice">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
  </v-tooltip>
  <v-icon :icon="icône"></v-icon>
</template>
<script setup lang="ts">
import type {ClientConstellation} from '@constl/ipa';

import type {favoris} from '@constl/ipa';

import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

import {inject, ref, computed} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Statut favoris
const statutFavoris = ref<favoris.ÉlémentFavoris>();
enregistrerÉcoute(
  constl?.favoris.suivreÉtatFavori({
    idObjet: props.id,
    f: statut => (statutFavoris.value = statut),
  }),
);

const estÉpingléSurCeDispositif = ref(false);
enregistrerÉcoute(
  constl?.favoris.suivreEstÉpingléSurDispositif({
    idObjet: props.id,
    f: statut => (estÉpingléSurCeDispositif.value = statut.bd),
  }),
);

const icône = computed(() => {
  if (statutFavoris.value) {
    if (estÉpingléSurCeDispositif.value) {
      return 'mdi-pin';
    } else {
      return 'mdi-pin-outline';
    }
  }
  return 'mdi-pin-off-outline';
});

const texteIndice = computed(() => {
  if (statutFavoris.value) {
    if (estÉpingléSurCeDispositif.value) {
      return t('épingles.icône.épingléSurCeDispositif');
    } else {
      return t('épingles.icône.épingléSurDAutresDispositifs');
    }
  }
  return t('épingles.icône.pasÉpinglé');
});
</script>
