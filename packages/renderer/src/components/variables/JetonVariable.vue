<template>
  <v-chip
    class="mb-2 me-2"
    :prepend-icon="icône"
    variant="outlined"
    label
    size="small"
  >
    {{ nomTraduit || t('variables.sansNom') }}
    <slot> </slot>
  </v-chip>
</template>

<script setup lang="ts">
import {computed} from 'vue';

import {utiliserConstellation, suivre} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {icôneCatégorieVariable} from '/@/components/variables/utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Icône
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = suivre(constl.variables.suivreCatégorieVariable, {idVariable: props.id});

// Nom
const noms = suivre(constl.variables.suivreNomsVariable, {idVariable: props.id});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
