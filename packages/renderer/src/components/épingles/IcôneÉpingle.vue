<template>
  <v-tooltip :text="texteIndice">
    <template #activator="{props: propsActivateur}">
      <v-icon
        v-bind="{props: propsActivateur}"
        :icon="icône"
      ></v-icon>
    </template>
    {{ texteIndice }}
  </v-tooltip>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {utiliserConstellation} from '/@/components/utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Statut favoris
const statutFavoris = suivre(constl.favoris.suivreÉtatFavori, {idObjet: computed(() => props.id)});

const estÉpingléSurCeDispositif = suivre(constl.favoris.suivreEstÉpingléSurDispositif, {
  idObjet: computed(() => props.id),
});

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
