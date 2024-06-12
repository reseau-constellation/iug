<template>
  <TexteTronque
    v-if="noms"
    :texte="nomTraduit || clef"
    :longueur-max="20"
  />
  <v-skeleton-loader
    v-else
    type="text"
  />
  <carte-tableau-bd
    :id-bd="id"
    :id-tableau="id"
    :clef="clef"
    :permission-modifier="!!monAutorisation"
  >
    <template #activator="{props: propsActivateur}">
      <v-icon
        v-bind="propsActivateur"
        class="ms-2"
        icon="mdi-pencil"
        variant="flat"
        size="small"
      />
    </template>
  </carte-tableau-bd>
</template>
<script setup lang="ts">
import { மொழிகளைப்_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import { constellation, suivre } from '../utils';

import TexteTronque from '/@/components/communs/TexteTronqué.vue';
import CarteTableauBd from './CarteTableauBd.vue';

const props = defineProps<{id: string, clef: string}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const constl = constellation();

// Noms
const noms = suivre(constl.tableaux.suivreNomsTableau, {idTableau: props.id});  // À faire - voir comment utiliser constl.nuées.suivreNomsTableauNuée
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: props.id});

</script>