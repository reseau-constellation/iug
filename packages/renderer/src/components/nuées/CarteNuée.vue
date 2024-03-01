<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
    :fichiers-epinglables="true"
    @ajuster-noms="nms => ajusterNoms(nms)"
    @ajuster-descriptions="descrs => ajusterDescriptions(descrs)"
    @effacer="() => effacerNuée()"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>

    <v-divider class="mb-2" />
    <div class="text-center">
      <v-btn
        variant="outlined"
        append-icon="mdi-open-in-new"
        @click="$router.push(encodeURI(`/données/nuée/${encodeURIComponent(id)}`))"
      >
        {{ t('nuées.carteNuée.ouvrirNuée') }}
      </v-btn>
    </div>
  </base-carte-objet>
</template>
<script setup lang="ts">
import {constellation, suivre} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Nom de la nuée
const noms = suivre(constl.nuées.suivreNomsNuée, {idNuée: props.id}, {});

const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const langue of àEffacer) {
    await constl.nuées.effacerNomNuée({idNuée: props.id, langue});
  }
  await constl.nuées.sauvegarderNomsNuée({
    idNuée: props.id,
    noms: àAjouter,
  });
};

// Descriptions nuée
const descriptions = suivre(constl.nuées.suivreDescriptionsNuée, {idNuée: props.id}, {});

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl.nuées.effacerDescriptionNuée({idNuée: props.id, langue});
  }
  await constl.nuées.sauvegarderDescriptionsNuée({
    idNuée: props.id,
    descriptions: àAjouter,
  });
};

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursBd, {idBd: props.id});

// Effacer
const effacerNuée = async () => {
  await constl.nuées.effacerNuée({idNuée: props.id});
};
</script>
