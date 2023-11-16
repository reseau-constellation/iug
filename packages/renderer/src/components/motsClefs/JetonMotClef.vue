<template>
  <v-chip
    class="mb-2 me-2"
    prepend-icon="mdi-key"
    variant="outlined"
    size="small"
  >
    {{ nomTraduit || t('motsClefs.sansNom') }}
  </v-chip>
</template>

<script setup lang="ts">
import type {ClientConstellation} from '@constl/ipa';

import {enregistrerÉcoute} from '/@/components/utils';

import {ref, inject} from 'vue';

import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom du mot-clef
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl?.motsClefs.suivreNomsMotClef({
    idMotClef: props.id,
    f: x => (noms.value = x),
  }),
);
</script>
