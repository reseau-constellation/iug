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
import type {ClientConstellation} from '@constl/ipa';

import {ref, inject, computed} from 'vue';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {enregistrerÉcoute} from '/@/components/utils';

import ImageProfil from '/@/components/communs/ImageProfil.vue';
import LienObjet from '../communs/LienObjet.vue';

const props = defineProps<{compte: string; montrerAnonymes: boolean}>();

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Nom d'utilisatrice
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl?.profil.suivreNoms({
    idCompte: props.compte,
    f: x => (noms.value = x),
  }),
);

// Visibilité
const visible = computed(() => {
  return props.montrerAnonymes || nomTraduit.value;
});
</script>
