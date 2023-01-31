<template>
  <v-list-item>
    <v-list-item-title>
      <v-row>
        <v-col cols="4">
          <v-autocomplete
            v-model="nouvelleLangue"
            hide-details
            density="compact"
            variant="outlined"
            item-title="lng"
            item-value="code"
            :items="listeLanguesEtCodes"
            :label="indiceLangue"
          ></v-autocomplete>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model="nouveauNom"
            hide-details
            density="compact"
            variant="outlined"
            :label="indiceNom"
            @blur="sauvegarder"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-list-item-title>

    <template #append>
      <v-btn
        icon="mdi-delete"
        variant="text"
        @click="effacer"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from 'vue';
import {utiliserLangues} from '/@/composables/langues';

const {utiliserListeLanguesEtCodes} = utiliserLangues();
const listeLanguesEtCodes = utiliserListeLanguesEtCodes();

const props = defineProps<{
  langue: string;
  nom: string;
  id: string;
  indiceNom: string;
  indiceLangue: string;
}>();
const emit = defineEmits<{
  (é: 'changerNom', info: {id: string; nom: string; lng: string}): void;
  (é: 'effacer', info: {id: string}): void;
}>();

// Initialisation
const nouveauNom = ref<string>('');
const nouvelleLangue = ref<string>('');
onMounted(() => {
  nouveauNom.value = props.nom;
  nouvelleLangue.value = props.langue;
});

// Changements
const effacer = () => {
  emit('effacer', {id: props.id});
};
const sauvegarder = () => {
  if (!nouvelleLangue.value || !nouveauNom.value) return;
  const nom = nouveauNom.value.trim();
  if (nom === props.nom.trim() && nouvelleLangue.value === props.langue) return;
  emit('changerNom', {id: props.id, nom: nouveauNom.value, lng: nouvelleLangue.value});
};
watchEffect(() => {
  if (nouvelleLangue.value !== props.langue) sauvegarder();
});
</script>
