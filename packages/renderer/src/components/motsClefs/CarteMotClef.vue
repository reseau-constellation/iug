<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
    @ajuster-noms="nms => ajusterNoms(nms)"
    @ajuster-descriptions="descrs => ajusterDescriptions(descrs)"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
  </base-carte-objet>
</template>

<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {infoAuteur} from '@constl/ipa/dist/src/utils';
import {inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/composables/utils';
import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

// Nom mot-clef
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.motsClefs?.suivreNomsMotClef({
    id: props.id,
    f: x => (noms.value = x),
  }),
);
const ajusterNoms = async (nouveauxNoms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: noms.value,
    nouvelles: nouveauxNoms,
  });
  for (const langue of àEffacer) {
    await constl?.motsClefs?.effacerNomMotClef({
      id: props.id,
      langue,
    });
  }
  return await constl?.motsClefs?.ajouterNomsMotClef({
    id: props.id,
    noms: àAjouter,
  });
};

// Descriptions mot-clef
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.motsClefs?.suivreDescriptionsMotClef({
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
    await constl?.motsClefs?.effacerDescriptionMotClef({
      id: props.id,
      langue,
    });
  }
  return await constl?.motsClefs?.ajouterDescriptionsMotClef({
    id: props.id,
    descriptions: àAjouter,
  });
};

// Auteurs
const auteurs = ref<infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursMotClef({
    idMotClef: props.id,
    f: x => (auteurs.value = x),
  }),
);
</script>
