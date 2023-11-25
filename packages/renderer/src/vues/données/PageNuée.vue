<template>
  <v-container>
    <TitrePage :titre="nomTraduit || couper(id, 50, t('communs.troisPetitsPoints'))" />
    <p>{{ id }}</p>
    <ExporterCode :id-nuee="id" />
  </v-container>
</template>

<script setup lang="ts">
import type {ClientConstellation} from '@constl/ipa';

import {inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {couper} from '/@/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import ExporterCode from '/@/components/nuées/ExporterCode.vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

// Nom de la nuée
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

enregistrerÉcoute(
  constl?.nuées.suivreNomsNuée({
    idNuée: props.id,
    f: x => (noms.value = x),
  }),
);
</script>
