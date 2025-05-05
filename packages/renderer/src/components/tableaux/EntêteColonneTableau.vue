<template>
  <span @click="() => émettre('basculer-ordonner')">
    <v-hover v-slot="{isHovering, props: propsSurvole}">
      <span v-bind="propsSurvole">
        <v-skeleton-loader
          v-if="enAttenteNoms && !noms"
          type="text"
        />
        <template v-else>
          {{ nomFinal }}
        </template>
        <template v-if="ordonnable">
          <v-icon
            v-if="estOrdonnee"
            :icon="iconeOrdonner"
          ></v-icon>
          <v-icon
            v-else
            icon="mdi-arrow-up"
            :color="isHovering ? 'disabled' : 'rgba(255,255,255,0)'"
          ></v-icon>
        </template>
      </span>
    </v-hover>
  </span>
  <carte-colonne-tableau
    :id-colonne="idColonne"
    :id-variable="idVariable"
    :id-tableau="idTableau"
    :index="index"
    :regles="regles"
    :permission-modifier="permissionModifier"
    @sauvegarder="info => émettre('sauvegarder', info)"
    @effacer="() => émettre('effacer')"
  >
    <template #activateur="{props: propsActivateur}">
      <v-icon
        v-bind="propsActivateur"
        class="ms-1"
        :icon="permissionModifier ? 'mdi-pencil' : 'mdi-plus'"
        size="x-small"
      />
    </template>
  </carte-colonne-tableau>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';
import {suivre} from '@constl/vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, onMounted, ref} from 'vue';
import {utiliserConstellation} from '../utils';
import CarteColonneTableau from './CarteColonneTableau.vue';

const props = defineProps<{
  index: boolean;
  permissionModifier: boolean;
  idColonne: string;
  regles: valid.règleColonne[] | undefined;
  idVariable?: string;
  idTableau: string;
  ordonnable: boolean;
  estOrdonnee: boolean;
  iconeOrdonner: string;
}>();
const émettre = defineEmits<{
  (é: 'basculer-ordonner'): void;
  (
    é: 'sauvegarder',
    args: {
      index: boolean;
      variable?: string;
      règles: {
        nouvelles: valid.règleVariable[];
        àEffacer: string[];
      };
    },
  ): void;
  (é: 'effacer'): void;
}>();

const constl = utiliserConstellation();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Noms
const noms = suivre(constl.variables.suivreNomsVariable, {
  idVariable: computed(() => props.idVariable),
});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
const nomFinal = computed(() => {
  return nomTraduit.value || props.idColonne;
});

const enAttenteNoms = ref(true);
onMounted(() => {
  setTimeout(() => (enAttenteNoms.value = false), 5000);
});
</script>
<style scoped>
.v-icon {
  transition: color 0.2s ease-in-out;
}
</style>
