<template>
  <v-dialog v-mode="dialogue">
    <template #activator="{props}">
      <v-list-item
        v-bind="props"
        class="text-start"
        prepend-icon="mdi-key"
        density="compact"
      >
        <template #title>
          {{ nomTraduit || t('motsClefs.sansNom') }}
        </template>
        <template #subtitle>
          {{ descriptionTraduite || t('motsClefs.sansDescription') }}
        </template>
        <template #append>
          <lien-objet :id="id"></lien-objet>
        </template>
      </v-list-item>
    </template>
    <carte-mot-clef :id="id" />
  </v-dialog>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa';
import {enregistrerÉcoute} from '/@/composables/utils';

import {ref, inject} from 'vue';

import LienObjet from '/@/components/communs/LienObjet.vue';
import CarteMotClef from './CarteMotClef.vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {traduireNom} = utiliserLangues();

const dialogue = ref(false);

// Nom du mot-clef
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.motsClefs?.suivreNomsMotClef({
    id: props.id,
    f: x => (noms.value = x),
  }),
);

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});
const descriptionTraduite = traduireNom(descriptions);

enregistrerÉcoute(
  constl?.motsClefs?.suivreDescriptionsMotClef({
    id: props.id,
    f: x => (descriptions.value = x),
  }),
);
</script>
