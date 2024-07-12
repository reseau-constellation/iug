<template>
  <v-container class="text-center">
    <TitrePage
      :titre="t('pages.automatisations.titre')"
      :image="imgAutomatisations"
      :sous-titre="t('pages.automatisations.sousTitre')"
    />
    <v-list class="text-start">
      <ImporterOuExporter automatiser>
        <template #activator="{props}">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-plus"
            :title="t('pages.automatisations.ajouterNouvelle.titre')"
            :subtitle="t('pages.automatisations.ajouterNouvelle.sousTitre')"
          />
        </template>
      </ImporterOuExporter>
      <ItemAutomatisation
        v-for="auto in automatisations"
        :key="auto.id"
        :spécification="auto"
      />
    </v-list>
  </v-container>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {utiliserConstellation} from '../components/utils';
import ItemAutomatisation from '/@/components/automatisations/ItemAutomatisation.vue';
import TitrePage from '/@/components/communs/TitrePage.vue';
import ImporterOuExporter from '/@/components/importerExporter/ImporterOuExporter.vue';
import {utiliserImagesDéco} from '/@/composables/images';

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {obtImageDéco} = utiliserImagesDéco();

const imgAutomatisations = obtImageDéco('automatisation');

// Automatisations
const automatisations = suivre(constl.automatisations.suivreAutomatisations);
</script>
