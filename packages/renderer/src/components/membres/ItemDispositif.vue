<template>
  <v-list-item>
    <template #prepend>
      <v-badge
        v-if="couleurPointActivité"
        dot
        :color="couleurPointActivité"
        location="bottom end"
      >
        <v-icon>{{ icôneDispositif }}</v-icon>
      </v-badge>
      <v-icon v-else>{{ icôneDispositif }}</v-icon>
    </template>
    <template #title> {{ nomDispositif }} </template>
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
import {ref, computed, onMounted, onUnmounted} from 'vue';

import LienObjet from '../communs/LienObjet.vue';
import {obtIcôneDispositifDeType, utiliserNomEtTypeDispositif} from './utils';
import JetonMembre from './JetonMembre.vue';

const props = defineProps<{idDispositif: string; idCompte?: string; vuA?: number}>();

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
const maintenant = ref(Date.now());
let idIntervale: ReturnType<typeof setInterval>;
onMounted(() => {
  idIntervale = setInterval(() => {
    maintenant.value = Date.now();
  }, 1000);
});
onUnmounted(() => {
  if (idIntervale) clearInterval(idIntervale);
});
const vuDepuis = computed(() => {
  return props.vuA ? maintenant.value - props.vuA : undefined;
});
const couleurPointActivité = computed(() => {
  if (!vuDepuis.value) return;
  if (vuDepuis.value <= 1000 * 60 * 5) {
    return 'success';
  } else if (vuDepuis.value <= 1000 * 60 * 30) {
    return 'warning';
  }
  return undefined;
});
</script>
