<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
    @ajuster-noms="ajusterNoms"
    @ajuster-descriptions="ajusterDescriptions"
    @effacer="effacerProjet"
  ></base-carte-objet>
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';
import type {utils} from '@constl/ipa';
import {inject, ref} from 'vue';

import {enregistrerÉcoute} from '/@/components/utils';
import BaseCarteObjet from '../communs/BaseCarteObjet.vue';
import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

// Nom projet
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.projets?.suivreNomsProjet({
    id: props.id,
    f: x => (noms.value = x),
  }),
);
const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const langue of àEffacer) {
    await constl?.projets?.effacerNomProjet({id: props.id, langue});
  }
  await constl?.projets?.ajouterNomsProjet({
    id: props.id,
    noms: àAjouter,
  });
};

// Descriptions projet
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.projets?.suivreDescrProjet({
    id: props.id,
    f: x => (descriptions.value = x),
  }),
);

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl?.projets?.effacerDescrProjet({id: props.id, langue});
  }
  await constl?.projets?.ajouterDescriptionsProjet({
    id: props.id,
    descriptions: àAjouter,
  });
};

// Auteurs
const auteurs = ref<utils.infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursProjet({
    idProjet: props.id,
    f: x => (auteurs.value = x),
  }),
);

// Effacer
const effacerProjet = async () => {
  await constl?.projets?.effacerProjet({id: props.id});
};
</script>
