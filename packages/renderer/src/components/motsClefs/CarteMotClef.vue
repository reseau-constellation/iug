<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
    :fichiers-epinglables="false"
    icone="mdi-key"
    @ajuster-noms="nms => ajusterNoms(nms)"
    @ajuster-descriptions="descrs => ajusterDescriptions(descrs)"
    @effacer="effacerMotClef"
  >
    <template #activateur="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>

    <template #epingler="{activateur, epingle}">
      <epingler-mot-clef :id-mot-clef="id">
        <template #activateur="{props: propsActivateur}">
          <component
            :is="activateur"
            v-bind="propsActivateur"
            :id="id"
            :epingle="epingle"
          />
        </template>
      </epingler-mot-clef>
    </template>
  </base-carte-objet>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed} from 'vue';
import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import {utiliserConstellation} from '/@/components/utils';
import EpinglerMotClef from '/@/components/épingles/ÉpinglerMotClef.vue';
import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

// Nom mot-clef
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: computed(() => props.id)}, {});

const ajusterNoms = async (nouveauxNoms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: noms.value,
    nouvelles: nouveauxNoms,
  });
  for (const langue of àEffacer) {
    await constl.motsClefs.effacerNomMotClef({
      idMotClef: props.id,
      langue,
    });
  }
  return await constl.motsClefs.sauvegarderNomsMotClef({
    idMotClef: props.id,
    noms: àAjouter,
  });
};

// Descriptions mot-clef
const descriptions = suivre(
  constl.motsClefs.suivreDescriptionsMotClef,
  {idMotClef: computed(() => props.id)},
  {},
);

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl.motsClefs.effacerDescriptionMotClef({
      idMotClef: props.id,
      langue,
    });
  }
  return await constl.motsClefs.sauvegarderDescriptionsMotClef({
    idMotClef: props.id,
    descriptions: àAjouter,
  });
};

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursMotClef, {
  idMotClef: computed(() => props.id),
});

// Effacer
const effacerMotClef = async () => {
  await constl.motsClefs.effacerMotClef({idMotClef: props.id});
};
</script>
