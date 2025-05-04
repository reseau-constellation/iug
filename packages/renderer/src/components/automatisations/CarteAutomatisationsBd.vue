<template>
  <carte-automatisations-objet
    type-objet="bd"
    :id-objet="idBd"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    {{ t('automatisations.carte.importations') }}
    <v-divider />
    <v-list>
      <nouvelle-importation :id-bd="idBd">
        <template #activator="{props: propsActivateur}">
          <v-list-item
            v-bind="propsActivateur"
            prepend-icon="mdi-upload-outline"
            :title="t('automatisations.carte.bds.ajouterImportationTableau')"
          />
        </template>
      </nouvelle-importation>
      <item-automatisation-importation
        v-for="auto in automatisationsImportationTableau"
        :key="auto.id"
        :specification="auto"
      />
      <p
        v-if="!automatisationsImportationTableau.length"
        class="text-disabled text-h6 text-center"
      >
        {{ t('automatisations.carte.bds.aucuneImportationTableau') }}
      </p>
    </v-list>

    {{ t('automatisations.carte.bds.exportationsTableaux') }}
    <v-divider />
    <v-list>
      <nouvelle-exportation :id-bd="idBd">
        <template #activator="{props: propsActivateur}">
          <v-list-item
            prepend-icon="mdi-download-outline"
            v-bind="propsActivateur"
          >
            <v-list-item-title>
              {{ t('automatisations.carte.bds.ajouterExportationTableau') }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </nouvelle-exportation>
      <item-automatisation-exportation
        v-for="auto in automatisationsExportationTableau"
        :key="auto.id"
        :specification="auto"
      />
      <p
        v-if="!automatisationsExportationTableau.length"
        class="text-disabled text-h6 text-center"
      >
        {{ t('automatisations.carte.bds.aucuneExportationTableau') }}
      </p>
    </v-list>
  </carte-automatisations-objet>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';

import type {automatisation as typeAutomatisation} from '@constl/ipa';
import CarteAutomatisationsObjet from './CarteAutomatisationsObjet.vue';
import ItemAutomatisationExportation from './ItemAutomatisationExportation.vue';
import ItemAutomatisationImportation from './ItemAutomatisationImportation.vue';
import NouvelleExportation from '/@/components/automatisations/NouvelleExportation.vue';
import NouvelleImportation from '/@/components/automatisations/NouvelleImportation.vue';

const props = defineProps<{
  idBd: string;
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Automatisations
const automatisations = suivre(constl.automatisations.suivreAutomatisations);

// Cas spécial pour les bases de données - on inclut aussi les tableaux !
const tableauxBd = suivre(constl.bds.suivreTableauxBd, {
  idBd: computed(() => props.idBd),
});

const automatisationsTableaux = computed(() => {
  const idsÀInclure = (tableauxBd.value || []).filter(t => t.id).map(t => t.id);
  return automatisations.value?.filter(a =>
    idsÀInclure.includes(a.type === 'exportation' ? a.idObjet : a.idTableau),
  );
});

const automatisationsImportationTableau = computed(() => {
  return (automatisationsTableaux.value?.filter(a => a.type === 'importation') ||
    []) as typeAutomatisation.SpécificationImporter[];
});
const automatisationsExportationTableau = computed(() => {
  return (automatisationsTableaux.value?.filter(a => a.type === 'exportation') ||
    []) as typeAutomatisation.SpécificationExporter[];
});
</script>
