<template>
  <ItemErreurRègleColonneBornes
    v-if="erreur.détails === 'colonneBornesInexistante'"
    :erreur="erreur"
    :id-tableau="idTableau"
  />
  <ItemErreurRègleColonneCatég
    v-else-if="erreur.détails === 'colonneCatégInexistante'"
    :erreur="erreur"
    :id-tableau="idTableau"
  />
  <ItemErreurRègleVariableBornes
    v-else-if="erreur.détails === 'variableBornesNonPrésente'"
    :erreur="erreur"
    :id-tableau="idTableau"
  />
  <v-list-item v-else>
    <v-list-item-title>
      {{ t('règles.erreursRègles.erreurInconnue') }}
    </v-list-item-title>
    <v-list-item-subtitle>
      {{ idTableau }}
    </v-list-item-subtitle>
  </v-list-item>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import ItemErreurRègleColonneBornes from './ItemErreurRègleColonneBornes.vue';
import ItemErreurRègleColonneCatég from './ItemErreurRègleColonneCatég.vue';
import ItemErreurRègleVariableBornes from './ItemErreurRègleVariableBornes.vue';

defineProps<{
  idTableau: string;
  erreur:
    | valid.erreurRègleBornesColonneInexistante
    | valid.erreurRègleBornesVariableNonPrésente
    | valid.erreurRègleCatégoriqueColonneInexistante;
}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
</script>
