<template>
  <v-list-item
    v-show="visible"
    class="text-start"
    density="compact"
  >
    <template #prepend>
      <image-profil :id="compte" />
    </template>
    <template #title>
      {{ nomTraduit || t('communs.anonyme') }}
    </template>
    <template #append>
      <lien-objet :id="compte" />
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';

import LienObjet from '../communs/LienObjet.vue';
import ImageProfil from '/@/components/communs/ImageProfil.vue';

const props = defineProps<{compte: string; montrerAnonymes: boolean}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Nom d'utilisatrice
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.profil.suivreNoms, {idCompte: computed(() => props.compte)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Visibilité
const visible = computed(() => {
  return props.montrerAnonymes || nomTraduit.value;
});
</script>
