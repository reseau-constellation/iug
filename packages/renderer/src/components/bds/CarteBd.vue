<template>
  <base-carte-objet
    :id="id"
    :nom="nom"
    :description="description"
    :auteurs="auteurs"
  >
    <division-carte :titre="t('bds.carteBd.infos')" />
    <JetonLicence
      :originale="licence"
      @changer="changerLicence"
    />
    <JetonQualité />
    <JetonRéplications />

    <division-carte :titre="t('bds.carteBd.variables')" />
    <SérieJetons
      :n-max="5"
      :items="motsClefs"
    >
      <template #jeton="{id: idVariable}">
        <JetonVariable :id="idVariable" />
      </template>
      <template #itemListe="{id: idVariable}">
        <ItemVariable :id="idVariable" />
      </template>
    </SérieJetons>

    <division-carte :titre="t('bds.carteBd.motsClefs')" />
    <SérieJetons
      :n-max="5"
      :items="motsClefs"
    >
      <template #jeton="{id: idMotsClefs}">
        <JetonMotClef :id="idMotsClefs" />
      </template>
      <template #itemListe="{id: idMotsClefs}">
        <ItemMotClef :id="idMotsClefs" />
      </template>
    </SérieJetons>
    <GérerMotsClefsObjet
      v-if="monAutorisation && motsClefs"
      :originaux="motsClefs"
      @sauvegarder="x => sauvegarderMotsClefs(x)"
    />

    <division-carte :titre="t('bds.carteBd.tableaux')" />
    <ItemTableau
      v-for="tableau in tableaux"
      :id="tableau.id"
      :key="tableau.clef"
    />
    <p v-if="!tableaux">En attente</p>
    <p v-else-if="!tableaux.length">{{ t('bds.carteBd.aucunTableaux') }}</p>
  </base-carte-objet>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {infoAuteur} from '@constl/ipa/dist/src/utils';
import type {infoTableauAvecId} from '@constl/ipa/dist/src/bds';

import {inject, ref} from 'vue';

import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/composables/utils';
import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import SérieJetons from '/@/components/communs/SérieJetons.vue';
import JetonLicence from '/@/components/licence/JetonLicence.vue';

import JetonVariable from '/@/components/variables/JetonVariable.vue';
import ItemVariable from '/@/components/variables/ItemVariable.vue';
import JetonMotClef from '/@/components/motsClefs/JetonMotClef.vue';
import ItemMotClef from '/@/components/motsClefs/ItemMotClef.vue';
import ItemTableau from '/@/components/tableaux/ItemTableau.vue';

import GérerMotsClefsObjet from '../motsClefs/GérerMotsClefsObjet.vue';
import DivisionCarte from '../communs/DivisionCarte.vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const {traduireNom} = utiliserLangues();

// Autorisation
const monAutorisation = ref<'MODÉRATEUR' | 'MEMBRE' | undefined>();
enregistrerÉcoute(
  constl?.suivrePermission({
    idObjet: props.id,
    f: x => (monAutorisation.value = x),
  }),
);

// Nom bd
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.bds?.suivreNomsBd({
    id: props.id,
    f: x => (noms.value = x),
  }),
);
const nom = traduireNom(noms);

// Descriptions mot-clef
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.bds?.suivreNomsBd({
    id: props.id,
    f: x => (descriptions.value = x),
  }),
);
const description = traduireNom(descriptions);

// Auteurs
const auteurs = ref<infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursBd({
    idBd: props.id,
    f: x => (auteurs.value = x),
  }),
);

// Licence
const licence = ref<string>();
enregistrerÉcoute(
  constl?.bds?.suivreLicence({
    id: props.id,
    f: x => (licence.value = x),
  }),
);
const changerLicence = async (nouvelleLicence: string) => {
  await constl?.bds?.changerLicenceBd({idBd: props.id, licence: nouvelleLicence});
};

// Variables
const variables = ref<string[]>();
enregistrerÉcoute(
  constl?.bds?.suivreVariablesBd({
    id: props.id,
    f: x => (variables.value = x),
  }),
);

// Mots-clefs
const motsClefs = ref<string[]>();
enregistrerÉcoute(
  constl?.bds?.suivreMotsClefsBd({
    id: props.id,
    f: x => (motsClefs.value = x),
  }),
);
const sauvegarderMotsClefs = async (àJour: string[]) => {
  const nouveaux = àJour.filter(m => !motsClefs.value?.includes(m));
  const àEnlever = motsClefs.value?.filter(m => !àJour.includes(m)) || [];
  await constl?.bds?.ajouterMotsClefsBd({
    idBd: props.id,
    idsMotsClefs: nouveaux,
  });
  await Promise.all(
    àEnlever.map(m => constl?.bds?.effacerMotClefBd({idBd: props.id, idMotClef: m})),
  );
};

// Tableaux
const tableaux = ref<infoTableauAvecId[]>();
enregistrerÉcoute(
  constl?.bds?.suivreTableauxBd({
    id: props.id,
    f: x => (tableaux.value = x.sort((a, b) => (a.position < b.position ? -1 : 1))),
  }),
);
</script>
