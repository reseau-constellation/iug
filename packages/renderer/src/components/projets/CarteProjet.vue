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
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <template #epingler="{activateur, epingle}">
      <epingler-projet :id-projet="id">
        <template #activator="{props: propsActivateur}">
          <component
            :is="activateur"
            v-bind="propsActivateur"
            :id="id"
            :epingle="epingle"
          />
        </template>
      </epingler-projet>
    </template>
  </base-carte-objet>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';

import {computed} from 'vue';
import BaseCarteObjet from '../communs/BaseCarteObjet.vue';
import {utiliserConstellation} from '/@/components/utils';
import EpinglerProjet from '/@/components/épingles/ÉpinglerProjet.vue';
import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

// Nom projet
const noms = suivre(constl.projets.suivreNomsProjet, {idProjet: computed(() => props.id)}, {});
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
const descriptions = suivre(
  constl.projets.suivreDescriptionsProjet,
  {idProjet: computed(() => props.id)},
  {},
);

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
const auteurs = suivre(constl.réseau.suivreAuteursProjet, {idProjet: computed(() => props.id)});

// Effacer
const effacerProjet = async () => {
  await constl.projets.effacerProjet({idProjet: props.id});
};
</script>
