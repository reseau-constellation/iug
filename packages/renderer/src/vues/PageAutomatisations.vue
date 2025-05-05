<template>
  <v-container class="text-center">
    <TitrePage
      :titre="t('pages.automatisations.titre')"
      :image="imgAutomatisations"
      :sous-titre="t('pages.automatisations.sousTitre')"
    />
    <v-list class="text-start">
      <NouvelleAutomatisation automatiser>
        <template #activateur="{props}">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-plus"
            :title="t('pages.automatisations.ajouterNouvelle.titre')"
            :subtitle="t('pages.automatisations.ajouterNouvelle.sousTitre')"
          />
        </template>
      </NouvelleAutomatisation>
      <v-divider />
      <div v-if="!automatisations?.length">
        <p class="my-6 text-center text-h5 text-disabled">
          {{ t('pages.automatisations.aucune') }}
        </p>
      </div>
      <template
        v-for="auto in automatisations"
        :key="auto.id"
      >
        <CarteAutomatisationExportation
          v-if="auto.type === 'exportation'"
          :spécification="auto"
          objet-modifiable
        >
          <template #activateur="{props: propsActivateur}">
            <item-automatisation-exportation
              v-bind="propsActivateur"
              :specification="auto"
            />
          </template>
        </CarteAutomatisationExportation>
        <CarteAutomatisationImportation
          v-else
          :specification="auto"
          objet-modifiable
        >
          <template #activateur="{props: propsActivateur}">
            <item-automatisation-importation
              v-bind="propsActivateur"
              :specification="auto"
            />
          </template>
        </CarteAutomatisationImportation>
      </template>
    </v-list>
  </v-container>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../components/utils';
import CarteAutomatisationExportation from '/@/components/automatisations/CarteAutomatisationExportation.vue';
import CarteAutomatisationImportation from '/@/components/automatisations/CarteAutomatisationImportation.vue';
import ItemAutomatisationExportation from '/@/components/automatisations/ItemAutomatisationExportation.vue';
import ItemAutomatisationImportation from '/@/components/automatisations/ItemAutomatisationImportation.vue';
import NouvelleAutomatisation from '/@/components/automatisations/NouvelleAutomatisation.vue';
import TitrePage from '/@/components/communs/TitrePage.vue';
import {utiliserImagesDéco} from '/@/composables/images';

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {obtImageDéco} = utiliserImagesDéco();

const imgAutomatisations = obtImageDéco('automatisation');

// Automatisations
const automatisations = suivre(constl.automatisations.suivreAutomatisations);
</script>
