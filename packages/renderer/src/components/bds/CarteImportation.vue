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
        <v-card-title> Importation </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-file-input v-model="fichier"></v-file-input>
        <v-row v-if="donnéesFichier">
          <v-col :cols="5">
            <v-select
              v-model="choixColTableau"
              :items="colonnesTableau.map(c => c.id)"
              variant="outlined"
              hide-details
            >
              <template #item="{item, props: propsItem}">
                <ItemVariable
                  v-bind="propsItem"
                  :id="colonnesTableau.find(c => c.id === item.raw)!.variable"
                />
              </template>

              <template #selection="{item}">
                <JetonVariable :id="colonnesTableau.find(c => c.id === item.raw)!.variable" />
              </template>
            </v-select>
          </v-col>
          <v-col :cols="5">
            <v-select
              v-model="choixColFichier"
              :items="colonnes"
              variant="outlined"
              hide-details
            ></v-select>
          </v-col>
          <v-col :cols="2">
            <v-btn
              icon="mdi-check"
              variant="flat"
              @click="ajouterCorrespondance"
            />
          </v-col>
        </v-row>
        <v-row
          v-for="crsp in correspondances"
          :key="crsp.colTableau"
        >
          <v-col :cols="5">
            <JetonVariable :id="colonnesTableau.find(c => c.id === crsp.colTableau)!.variable" />
          </v-col>
          <v-col :cols="5">
            <v-chip
              variant="outlined"
              label
              size="small"
            >
              {{ crsp.colFichier }}
            </v-chip>
          </v-col>
          <v-col :cols="2">
            <v-btn
              icon="mdi-delete"
              variant="flat"
              @click="() => effacerCorrespondance(crsp.colTableau)"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="mx-auto"
          color="primary"
          variant="text"
          append-icon="mdi-import"
          :disabled="!correspondances.length"
          @click="importer"
        >
          Importer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {tableaux} from '@constl/ipa';

import {ref} from 'vue';
import {useDisplay} from 'vuetify';
import {constellation} from '../utils';
import {watchEffect} from 'vue';
import Papa from 'papaparse';
import JetonVariable from '../variables/JetonVariable.vue';
import ItemVariable from '../variables/ItemVariable.vue';

const {mdAndUp} = useDisplay();

const dialogue = ref(false);

const constl = constellation();

const props = defineProps<{
  idTableau: string;
  colonnesTableau: tableaux.InfoColAvecCatégorie[];
}>();

// Données
const fichier = ref<File[]>();
const colonnes = ref<string[]>();
const donnéesFichier = ref<{[clef: string]: number}[]>();
watchEffect(async () => {
  if (fichier.value?.length) {
    const texte = new TextDecoder().decode(await fichier.value[0].arrayBuffer());
    const json = Papa.parse(texte, {
      header: true,
      dynamicTyping: true,
    }).data;
    colonnes.value = [...new Set(json.map((x: string) => Object.keys(x)).flat())] as string[];
    donnéesFichier.value = json;
  }
});

// Importation
const correspondances = ref<{colFichier: string; colTableau: string}[]>([]);
const choixColFichier = ref<string>();
const choixColTableau = ref<string>();
const ajouterCorrespondance = () => {
  if (choixColFichier.value && choixColTableau.value) {
    correspondances.value = [
      ...correspondances.value,
      {colFichier: choixColFichier.value, colTableau: choixColTableau.value},
    ];
  }
  choixColFichier.value = undefined;
  choixColTableau.value = undefined;
};
const effacerCorrespondance = (colTableau: string) => {
  correspondances.value = correspondances.value.filter(c => c.colTableau !== colTableau);
};
const importer = async () => {
  const donnéesÀImporter = donnéesFichier.value?.map(d =>
    Object.fromEntries(
      Object.entries(d)
        .filter(([_, val]) => val !== null)
        .map(([clef, val]) => [
          correspondances.value.find(c => c.colFichier === clef)?.colTableau || clef,
          val,
        ]),
    ),
  );

  if (donnéesÀImporter)
    await constl.tableaux.importerDonnées({
      idTableau: props.idTableau,
      données: donnéesÀImporter,
    });
};
</script>
