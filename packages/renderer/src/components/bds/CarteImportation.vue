<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title>
            Importation
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-file-input v-model="fichier"></v-file-input>
        {{ test }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useDisplay } from 'vuetify';
import { constellation } from '../utils';
import { watchEffect } from 'vue';

const {mdAndUp} = useDisplay();

const dialogue = ref(false);

const constl = constellation();

// Données
const fichier = ref<File[]>();
const test = ref<string>();
const colonnes = ref<string[]>();
const donnéesFichier = ref<{[clef: string]: number}>();
watchEffect(async ()=>{
    if (fichier.value?.length) {   
        const texte = (new TextDecoder().decode(await fichier.value[0].arrayBuffer()));
        const lignes = texte.split('\n');
        test.value = lignes 
    }
})
constl.tableaux.importerDonnées({});
 
</script>