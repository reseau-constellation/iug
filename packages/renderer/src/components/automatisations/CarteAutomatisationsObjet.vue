<template>
  <v-dialog>
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
        <v-card-title>{{ t('automatisations.carte.titre') }}</v-card-title>
      </v-card-item>
      <v-card-text>
        <span v-if="(typeObjet === 'bd' || typeObjet == 'tableau') && monAutorisation">
          {{ t('automatisations.carte.importations') }}
          <v-divider />
          <v-list>
            <v-list-item prepend-icon="mdi-plus">
              <importer-ou-exporter
                :info-objet="{id: idObjet, typeObjet}"
                type="importation"
                automatiser
              >
                <v-list-item-title>
                  {{ t('automatisations.carte.ajouterImportation') }}
                </v-list-item-title>
              </importer-ou-exporter>
            </v-list-item>
            <item-automatisation
              v-for="auto in automatisationsImportationObject"
              :key="auto.id"
              :spécification="auto"
            />
            <v-list-item v-if="!automatisationsImportationObject.length">
              <v-list-item-title>
                {{ t('automatisations.carte.aucuneImportation') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </span>

        {{ t('automatisations.carte.exportations') }}
        <v-divider />
        <v-list>
          <v-list-item prepend-icon="mdi-plus">
            <importer-ou-exporter
              :info-objet="{id: idObjet, typeObjet}"
              type="exportation"
              automatiser
            >
              <v-list-item-title>
                {{ t('automatisations.carte.ajouterExportation') }}
              </v-list-item-title>
            </importer-ou-exporter>
          </v-list-item>
          <item-automatisation
            v-for="auto in automatisationsExportationObject"
            :key="auto.id"
            :spécification="auto"
          />
          <v-list-item v-if="!automatisationsExportationObject.length">
            <v-list-item-title>
              {{ t('automatisations.carte.aucuneExportation') }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {bds} from '@constl/ipa';

import {computed, ref, onMounted} from 'vue';
import {useDisplay} from 'vuetify';

import {constellation, enregistrerÉcoute, suivre} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import ItemAutomatisation from './ItemAutomatisation.vue';
import ImporterOuExporter from '../importerExporter/ImporterOuExporter.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const props = defineProps<{
  idObjet: string;
  typeObjet: 'nuée' | 'projet' | 'bd' | 'tableau';
}>();

const constl = constellation();

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: props.idObjet});

// Automatisations
const automatisations = suivre(constl.automatisations.suivreAutomatisations);

// Cas spécial pour les bases de données - on inclut aussi les tableaux !
const tableauxBd = ref<bds.infoTableauAvecId[]>();
onMounted(() => {
  if (props.typeObjet === 'bd') {
    enregistrerÉcoute(
      constl.bds.suivreTableauxBd({
        idBd: props.idObjet,
        f: x => (tableauxBd.value = x),
      }),
    );
  }
});

const automatisationsObject = computed(() => {
  const idsÀInclure =
    props.typeObjet === 'bd'
      ? [props.idObjet, ...[(tableauxBd.value || []).filter(t => t.id)]]
      : [props.idObjet];
  return automatisations.value?.filter(a =>
    idsÀInclure.includes(a.type === 'exportation' ? a.idObjet : a.idTableau),
  );
});
const automatisationsImportationObject = computed(() => {
  return automatisationsObject.value?.filter(a => a.type === 'importation') || [];
});
const automatisationsExportationObject = computed(() => {
  return automatisationsObject.value?.filter(a => a.type === 'exportation') || [];
});
</script>
