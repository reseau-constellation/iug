<template>
  <v-chip
    prepend-icon="mdi-table"
    variant="outlined"
    label
  >
    {{ nomTableau || t('tableaux.sansNom') }}
  </v-chip>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {utiliserConstellation} from '/@/components/utils';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom tableau
const noms = suivre(constl.tableaux.suivreNomsTableau, {idTableau: computed(() => props.id)});
const nomTableau = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
