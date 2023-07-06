<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
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
        @click="$router.push(encodeURI(`/données/bd/${encodeURIComponent(id)}`))"
      >
        {{ t('nuées.carteNuée.ouvrirNuée') }}
      </v-btn>
    </div>
  </base-carte-objet>
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';
import type {utils} from '@constl/ipa';

import {inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Nom de la nuée
const noms = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.nuées?.suivreNomsNuée({
    idNuée: props.id,
    f: x => (noms.value = x),
  }),
);

const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const langue of àEffacer) {
    await constl?.nuées?.effacerNomNuée({id: props.id, langue});
  }
  await constl?.nuées?.ajouterNomsNuée({
    id: props.id,
    noms: àAjouter,
  });
};

// Descriptions nuée
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.nuées?.suivreDescriptionsNuée({
    idNuée: props.id,
    f: x => (descriptions.value = x),
  }),
);

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl?.nuées?.effacerDescriptionNuée({id: props.id, langue});
  }
  await constl?.nuées?.ajouterDescriptionsNuée({
    id: props.id,
    descriptions: àAjouter,
  });
};

// Auteurs
const auteurs = ref<utils.infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursBd({
    idBd: props.id,
    f: x => (auteurs.value = x),
  }),
);

// Effacer
const effacerNuée = async () => {
  await constl?.nuées?.effacerNuée({id: props.id});
};
</script>
