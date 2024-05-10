<template>
  <carte-confiance-membre
    v-if="id !== monCompte"
    :id="id"
  >
    <template #activator="{props: propsActivateur}">
      <icône-confiance
        v-if="styleJeton === 'icône'"
        v-bind="propsActivateur"
        :confiance="confiance"
        :cest-moi="id === monCompte"
      />
      <v-chip
        v-else
        v-bind="propsActivateur"
        label
        variant="outlined"
        size="small"
      >
        <template #prepend>
          <icône-confiance
            :confiance="confiance"
            :cest-moi="id === monCompte"
          />
        </template>
        {{ t(messageConfiance) }}
      </v-chip>
    </template>
  </carte-confiance-membre>
  <v-tooltip
    v-else
    :text="t(messageConfiance)"
  >
    <template #activator="{props: propsActivateur}">
      <icône-confiance
        v-if="styleJeton === 'icône'"
        v-bind="propsActivateur"
        :confiance="confiance"
        :cest-moi="id === monCompte"
      />
      <v-chip
        v-else
        v-bind="propsActivateur"
        label
        variant="outlined"
        size="small"
      >
        <template #prepend>
          <icône-confiance
            :confiance="confiance"
            :cest-moi="id === monCompte"
          />
        </template>
        {{ t(messageConfiance) }}
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import {computed} from 'vue';

import {constellation, rechercher, suivre} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import IcôneConfiance from './IcôneConfiance.vue';
import CarteConfianceMembre from './CarteConfianceMembre.vue';

const props = defineProps<{
  id: string;
  styleJeton: 'jeton' | 'icône';
}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Mon compte
const monCompte = suivre(constl.suivreIdCompte);

// Confiance
const { résultats: confiance } = rechercher(
  constl.réseau.suivreConfianceMonRéseauPourMembre,
  {idCompte: props.id, profondeur: 5},
);

// Message
const messageConfiance = computed(() => {
  const valConfiance =  confiance.value || 0;
  if (valConfiance < 0) {
    return 'membres.confiance.bloqué';
  } else if (valConfiance === 0) {
    return 'membres.confiance.inconnu';
  } else if (valConfiance < 0.33) {
    return 'membres.confiance.peuDinteraction';
  } else if (valConfiance < 0.67) {
    return 'membres.confiance.interactionMoyenne';
  } else if (valConfiance < 1) {
    return 'membres.confiance.beaucoupDinteraction';
  } else if (valConfiance === 1) {
    return props.id === monCompte.value ? t('membres.moi') : t('membres.confiance.connaissance');
  } else {
    return '';
  }
});
</script>
