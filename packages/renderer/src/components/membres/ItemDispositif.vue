<template>
  <v-list-item>
    <template #prepend>
      <v-icon>
        <v-badge
          v-if="couleurPointActivité"
          dot
          :color="couleurPointActivité"
          location="bottom end"
        >
          <v-icon>{{ icôneDispositif }}</v-icon>
        </v-badge>
        <v-icon v-else>{{ icôneDispositif }}</v-icon>
      </v-icon>
    </template>
    <template #title> {{ nomDispositif || t('dispositifs.sansNom') }} </template>
    <template #subtitle> {{ sousTitre }} </template>
    <jeton-membre
      v-if="idCompte"
      :compte="idCompte"
    />
    <slot />
    <template #append>
      <lien-objet :id="idDispositif" />
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type {ClientConstellation} from '@constl/ipa';

import {computed, inject, ref} from 'vue';

import LienObjet from '../communs/LienObjet.vue';
import {obtIcôneDispositifDeType, utiliserIlYA, utiliserNomEtTypeDispositif} from './utils';
import JetonMembre from './JetonMembre.vue';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import {onMounted} from 'vue';

const props = defineProps<{idDispositif: string; idCompte?: string; vuA?: number}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const constl = inject<ClientConstellation>('constl');

// Info dispositif
const {nomDispositif, typeDispositif} = utiliserNomEtTypeDispositif({
  idDispositif: props.idDispositif,
  idCompte: props.idCompte,
});

// Icône
const icôneDispositif = computed(() => {
  return obtIcôneDispositifDeType(typeDispositif.value);
});

// Activité
const {ilYAMs: vuIlYA, texte: texteVuIlYA} = utiliserIlYA({vuÀ: props.vuA, t});
const ceDispositif = ref<string>();
onMounted(async () => {
  ceDispositif.value = await constl?.obtIdDispositif();
});

const sousTitre = computed(() => {
  if (props.idDispositif === ceDispositif.value) {
    return t('dispositifs.ceDispositif');
  } else {
    return texteVuIlYA.value;
  }
});

const couleurPointActivité = computed(() => {
  if (vuIlYA.value === undefined || vuIlYA.value <= 1000 * 60 * 5) {
    return 'success';
  } else if (vuIlYA.value <= 1000 * 60 * 30) {
    return 'warning';
  }
  return undefined;
});
</script>
