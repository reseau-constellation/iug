<template>
  <v-chip prepend-icon="mdi-table">
    {{ nomTableau || t('tableaux.sansNom') }}
  </v-chip>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {utiliserConstellation} from '/@/components/utils';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom tableau
const noms = suivre(constl.tableaux.suivreNomsTableau, {idTableau: props.id});
const nomTableau = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
