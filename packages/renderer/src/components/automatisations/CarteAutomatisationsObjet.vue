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
        <v-card-title class="d-flex">
          {{ t('automatisations.carte.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <span v-if="(typeObjet === 'bd' || typeObjet == 'tableau') && monAutorisation">
          {{ t('automatisations.carte.importations') }}
          <v-divider />
          <v-list>
            <nouvelle-importation :info-objet="{id: idObjet, typeObjet}">
              <template #activator="{props: propsActivateur}">
                <v-list-item
                  v-bind="propsActivateur"
                  prepend-icon="mdi-upload-outline"
                  :title="t('automatisations.carte.ajouterImportation')"
                />
              </template>
            </nouvelle-importation>
            <item-automatisation-importation
              v-for="auto in automatisationsImportationObject"
              :key="auto.id"
              :spécification="auto"
            />
            <p
              v-if="!automatisationsImportationObject.length"
              class="text-disabled text-h6 text-center"
            >
              {{ t('automatisations.carte.aucuneImportation') }}
            </p>
          </v-list>
        </span>

        {{ t('automatisations.carte.exportations') }}
        <v-divider />
        <v-list>
          <nouvelle-exportation :info-objet="{id: idObjet, typeObjet}">
            <template #activator="{props: propsActivateur}">
              <v-list-item
                prepend-icon="mdi-download-outline"
                v-bind="propsActivateur"
              >
                <v-list-item-title>
                  {{ t('automatisations.carte.ajouterExportation') }}
                </v-list-item-title>
              </v-list-item>
            </template>
          </nouvelle-exportation>
          <item-automatisation-exportation
            v-for="auto in automatisationsExportationObject"
            :key="auto.id"
            :specification="auto"
          />
          <p
            v-if="!automatisationsExportationObject.length"
            class="text-disabled text-h6 text-center"
          >
            {{ t('automatisations.carte.aucuneExportation') }}
          </p>
        </v-list>
        <slot />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';

import type {automatisation as typeAutomatisation} from '@constl/ipa';
import ItemAutomatisationExportation from './ItemAutomatisationExportation.vue';
import ItemAutomatisationImportation from './ItemAutomatisationImportation.vue';
import NouvelleExportation from '/@/components/automatisations/NouvelleExportation.vue';
import NouvelleImportation from '/@/components/automatisations/NouvelleImportation.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const props = defineProps<{
  idObjet: string;
  typeObjet: 'nuée' | 'projet' | 'bd' | 'tableau';
}>();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: computed(() => props.idObjet)});

// Automatisations
const automatisations = suivre(constl.automatisations.suivreAutomatisations);

const automatisationsObject = computed(() => {
  return automatisations.value?.filter(
    a => props.idObjet === (a.type === 'exportation' ? a.idObjet : a.idTableau),
  );
});
const automatisationsImportationObject = computed(() => {
  return (automatisationsObject.value?.filter(a => a.type === 'importation') ||
    []) as typeAutomatisation.SpécificationImporter[];
});
const automatisationsExportationObject = computed(() => {
  return (automatisationsObject.value?.filter(a => a.type === 'exportation') ||
    []) as typeAutomatisation.SpécificationExporter[];
});
</script>
