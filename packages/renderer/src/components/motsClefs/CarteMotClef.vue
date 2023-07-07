<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
    @ajuster-noms="nms => ajusterNoms(nms)"
    @ajuster-descriptions="descrs => ajusterDescriptions(descrs)"
    @effacer="effacerMotClef"
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
import type {client} from '@constl/ipa';
import type {utils} from '@constl/ipa';
import {inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

// Nom mot-clef
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.motsClefs?.suivreNomsMotClef({
    idMotClef: props.id,
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
      idMotClef: props.id,
      langue,
    });
  }
  return await constl?.motsClefs?.sauvegarderNomsMotClef({
    idMotClef: props.id,
    noms: àAjouter,
  });
};

// Descriptions mot-clef
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.motsClefs?.suivreDescriptionsMotClef({
    idMotClef: props.id,
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
  return await constl?.motsClefs?.sauvegarderDescriptionsMotClef({
    idMotClef: props.id,
    descriptions: àAjouter,
  });
};

// Auteurs
const auteurs = ref<utils.infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursMotClef({
    idMotClef: props.id,
    f: x => (auteurs.value = x),
  }),
);

// Effacer
const effacerMotClef = async () => {
  await constl?.motsClefs?.effacerMotClef({idMotClef: props.id});
};
</script>
