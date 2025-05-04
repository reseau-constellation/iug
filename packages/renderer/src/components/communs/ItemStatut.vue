<template>
  <v-list-item>
    <template #prepend>
      <v-icon
        start
        :color="couleur"
      >
        {{ icône }}
      </v-icon>
    </template>
    <template #title>
      {{ t(`données.statut.${statut.statut}`) }}
      <v-btn
        v-if="statut.idNouvelle"
        icon="mdi-open-in-new"
        @click="
          () =>
            $router.push(
              encodeURI(`/données/${typeObjet}/${encodeURIComponent(statut.idNouvelle as string)}`),
            )
        "
      >
        {{ t('statut.allerÀNouvelle') }}
      </v-btn>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {icôneStatut} from '../utils';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const props = defineProps<{
  typeObjet: 'bd' | 'nuée' | 'projet';
  statut: types.schémaStatut;
}>();

const couleur = computed(() => {
  switch (props.statut.statut) {
    case 'active': {
      return 'primary';
    }
    case 'jouet':
    case 'interne':
    case 'obsolète': {
      return 'warn';
    }
    default:
      return undefined;
  }
});

const icône = computed(() => {
  return icôneStatut(props.statut.statut);
});
</script>
