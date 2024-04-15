<template>
  <tableau-base
    :colonnes="colonnes"
    :donnees="données"
  />
</template>
<script setup lang="ts">
import type {tableaux} from '@constl/ipa';
import {constellation, suivre} from '../utils';

import TableauBase from './TableauBase.vue';

const constl = constellation();
const props = defineProps<{idTableau: string}>();

const données = suivre(constl.tableaux.suivreDonnées, {idTableau: props.idTableau});
const colonnes = suivre(constl.tableaux.suivreColonnesTableau<tableaux.InfoColAvecCatégorie>, {
  idTableau: props.idTableau,
});
</script>
