<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      :min-width="mdAndUp ? 500 : 300"
      class="mx-auto"
    >
      <v-card-item>
        <v-card-title>
          {{ titre }}
        </v-card-title>
        <v-card-subtitle v-if="sousTitre">
          {{ sousTitre }}
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <ListeNoms
          :noms-initiaux="nomsInitiaux"
          :texte-aucun-nom="texteAucunNom"
          :indice-langue="indiceLangue"
          :indice-nom="indiceNom"
          :etiquette-nom="etiquetteNom"
          :autorisation-modification="autorisationModification"
          :longue="longue"
          @ajuster-noms="ajusterNoms"
        ></ListeNoms>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <btn-annuler @click="fermer" />
        <btn-sauvegarder
          v-if="autorisationModification"
          :actif="nomsChangés"
          @click="() => sauvegarder()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import deepEqual from 'deep-equal';
import {computed, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';
import ListeNoms from './ListeNoms.vue';

import BtnAnnuler from '/@/components/communs/BtnAnnuler.vue';
import BtnSauvegarder from '/@/components/communs/BtnSauvegarder.vue';

const {mdAndUp} = useDisplay();

const props = defineProps<{
  titre: string;
  sousTitre: string;
  nomsInitiaux: {[lng: string]: string} | undefined;
  etiquetteNom: string;
  indiceNom: string;
  indiceLangue: string;
  texteAucunNom: string;
  autorisationModification: boolean;
  longue?: boolean;
}>();
const émettre = defineEmits<{
  (é: 'ajusterNoms', noms: {[lng: string]: string}): void;
}>();

// Navigation générale
const dialogue = ref(false);
const fermer = () => {
  dialogue.value = false;
  nomsChoisis.value = props.nomsInitiaux || {};
};
const sauvegarder = () => {
  émettre('ajusterNoms', nomsChoisis.value);
  dialogue.value = false;
};

// Gestion noms
const nomsChoisis = ref<{[langue: string]: string}>(props.nomsInitiaux || {});
watchEffect(() => {
  nomsChoisis.value = props.nomsInitiaux || {};
});
const ajusterNoms = (noms: {[langue: string]: string}) => {
  nomsChoisis.value = noms;
};
const nomsChangés = computed(() => {
  return !deepEqual(nomsChoisis.value, props.nomsInitiaux);
});
</script>
