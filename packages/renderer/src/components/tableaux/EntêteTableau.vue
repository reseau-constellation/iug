<template>
  <TexteTronque
    :texte="nomTraduit || clef"
    :longueur-max="15"
  />
  <carte-tableau
    :id-tableau="id"
    :clef-tableau="clef"
    @effacer="() => émettre('effacer')"
  >
    <template #activateur="{props: propsActivateur}">
      <v-icon
        v-bind="propsActivateur"
        class="ms-2"
        icon="mdi-dots-horizontal"
        variant="flat"
        size="small"
      />
    </template>
  </carte-tableau>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../utils';
import CarteTableau from './CarteTableau.vue';

import {computed} from 'vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';

const props = defineProps<{id: string; clef: string}>();
const émettre = defineEmits<{
  (é: 'effacer'): void;
}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Noms
const noms = suivre(constl.tableaux.suivreNomsTableau, {idTableau: computed(() => props.id)}); // À faire - voir comment utiliser constl.nuées.suivreNomsTableauNuée
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
