<template>
  <carte-confiance-membre
    v-if="id !== monCompte"
    :id="id"
  >
    <template #activator="{props: propsActivateur}">
      <icone-confiance
        v-if="styleJeton === 'icône'"
        v-bind="propsActivateur"
        :confiance="confiance || 0"
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
          <icone-confiance
            :confiance="confiance || 0"
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
      <icone-confiance
        v-if="styleJeton === 'icône'"
        v-bind="propsActivateur"
        :confiance="confiance || 0"
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
          <icone-confiance
            :confiance="confiance || 0"
            :cest-moi="id === monCompte"
          />
        </template>
        {{ t(messageConfiance) }}
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import {rechercher, suivre} from '@constl/vue';
import {computed} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';

import CarteConfianceMembre from './CarteConfianceMembre.vue';
import IconeConfiance from './IcôneConfiance.vue';

const props = defineProps<{
  id: string;
  styleJeton: 'jeton' | 'icône';
}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Mon compte
const monCompte = suivre(constl.suivreIdCompte);

// Confiance
const {résultats: confiance} = rechercher(constl.réseau.suivreConfianceMonRéseauPourMembre, {
  idCompte: props.id,
  profondeur: 5,
});

// Message
const messageConfiance = computed(() => {
  const valConfiance = confiance.value || 0;
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
