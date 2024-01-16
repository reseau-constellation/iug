<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
    :fichiers-epinglables="true"
    @ajuster-noms="ajusterNoms"
    @ajuster-descriptions="ajusterDescriptions"
    @effacer="effacerProjet"
  ></base-carte-objet>
</template>
<script setup lang="ts">
import {constellation, suivre} from '/@/components/utils';
import BaseCarteObjet from '../communs/BaseCarteObjet.vue';
import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = constellation();

// Nom projet
const noms = suivre(constl.projets.suivreNomsProjet, {idProjet: props.id}, {});
const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const langue of àEffacer) {
    await constl.projets.effacerNomProjet({idProjet: props.id, langue});
  }
  await constl.projets.sauvegarderNomsProjet({
    idProjet: props.id,
    noms: àAjouter,
  });
};

// Descriptions projet
const descriptions = suivre(constl.projets.suivreDescriptionsProjet, {idProjet: props.id}, {});

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl.projets.effacerDescriptionProjet({idProjet: props.id, langue});
  }
  await constl.projets.sauvegarderDescriptionsProjet({
    idProjet: props.id,
    descriptions: àAjouter,
  });
};

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursProjet, {idProjet: props.id});

// Effacer
const effacerProjet = async () => {
  await constl.projets.effacerProjet({idProjet: props.id});
};
</script>
