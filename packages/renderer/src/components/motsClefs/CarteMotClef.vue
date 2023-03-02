<template>
  <base-carte-objet
    :id="id"
    :nom="nom"
    :description="description"
    :auteurs="auteurs"
  ></base-carte-objet>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {infoAuteur} from '@constl/ipa/dist/src/utils';
import {inject, ref} from 'vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/composables/utils';
import BaseCarteObjet from '../communs/BaseCarteObjet.vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {traduireNom} = utiliserLangues();

// Nom mot-clef
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.motsClefs?.suivreNomsMotClef({
    id: props.id,
    f: x => (noms.value = x),
  }),
);
const nom = traduireNom(noms);

// Descriptions mot-clef
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.motsClefs?.suivreDescriptionsMotClef({
    id: props.id,
    f: x => (descriptions.value = x),
  }),
);
const description = traduireNom(descriptions);

// Auteurs
const auteurs = ref<infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursMotClef({
    idMotClef: props.id,
    f: x => (auteurs.value = x),
  }),
);
</script>
