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
    <template #subtitle> {{ t(sousTitre) }} </template>
    <p class="mt-4" />
    <jeton-membre
      v-if="idCompte"
      :compte="idCompte"
    />
    <slot />
    <template #append>
      <lien-objet :id="idDispositif" />
      <lien-objet :id="idSfip!" />
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {onMounted} from 'vue';
import LienObjet from '../communs/LienObjet.vue';
import {utiliserConstellation} from '../utils';
import JetonMembre from './JetonMembre.vue';
import {obtIcôneDispositifDeType, utiliserIlYA, utiliserNomEtTypeDispositif} from './utils';

const props = defineProps<{
  idDispositif: string;
  idCompte?: string;
  idSfip?: string;
  vuA?: number;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Info dispositif
const {nomDispositif, typeDispositif} = utiliserNomEtTypeDispositif({
  idDispositif: computed(() => props.idDispositif),
  idCompte: computed(() => props.idCompte),
});

// Icône
const icôneDispositif = computed(() => {
  return obtIcôneDispositifDeType(typeDispositif.value);
});

// Activité
const {ilYAMs: vuIlYA, texte: texteVuIlYA} = utiliserIlYA({vuÀ: computed(() => props.vuA), t});
const ceDispositif = ref<string>();
onMounted(async () => {
  ceDispositif.value = await constl.obtIdDispositif();
});

const sousTitre = computed(() => {
  if (props.idDispositif === ceDispositif.value) {
    return 'dispositifs.ceDispositif';
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
