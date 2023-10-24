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
import type {automatisation} from '@constl/ipa';
import type {ClientConstellation} from '@constl/ipa';

import {inject, ref} from 'vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import TitrePage from '/@/components/communs/TitrePage.vue';
import {utiliserImagesDéco} from '/@/composables/images';
import ImporterOuExporter from '/@/components/importerExporter/ImporterOuExporter.vue';
import ItemAutomatisation from '/@/components/automatisations/ItemAutomatisation.vue';
import {enregistrerÉcoute} from '../components/utils';

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {obtImageDéco} = utiliserImagesDéco();

const imgAutomatisations = obtImageDéco('automatisation');

// Automatisations
const automatisations = ref<automatisation.SpécificationAutomatisation[]>();
enregistrerÉcoute(
  constl?.automatisations.suivreAutomatisations({
    f: x => (automatisations.value = x),
  }),
);
</script>
