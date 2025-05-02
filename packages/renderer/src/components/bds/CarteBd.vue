<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :image="image || imageDéfaut"
    :auteurs="auteurs"
    :fichiers-epinglables="true"
    @ajuster-noms="ajusterNoms"
    @ajuster-descriptions="ajusterDescriptions"
    @effacer="effacerBd"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>

    <template #epingler="{activateur, epingle}">
      <epingler-bd :id-bd="id">
        <template #activator="{props: propsActivateur}">
          <component
            :is="activateur"
            v-bind="propsActivateur"
            :id="id"
            :epingle="epingle"
          />
        </template>
      </epingler-bd>
    </template>

    <division-carte
      :titre="t('bds.info')"
      :en-attente="false"
    />

    <dialogue-licence
      :licence="licence"
      :licence-contenu="licenceContenu"
      :permission-modifier="!!monAutorisation"
      @changer-licence="changerLicence"
    >
      <template #activator="{props: propsActivateur}">
        <jeton-licence
          v-bind="propsActivateur"
          class="me-2 mb-2"
          :licence="licence"
        />
      </template>
    </dialogue-licence>

    <jeton-qualite
      :id="id"
      class="me-2 mb-2"
    />
    <carte-replications-objet :id="id">
      <template #activator="{props: propsActivateur}">
        <jeton-replications
          v-bind="propsActivateur"
          :id="id"
          class="me-2 mb-2"
        />
      </template>
    </carte-replications-objet>

    <division-carte
      :titre="t('bds.variables')"
      :en-attente="!variables"
    />
    <serie-jetons
      :n-max="5"
      :items="variables"
    >
      <template #jeton="{id: idVariable}">
        <carte-variable :id="idVariable">
          <template #activator="{props: propsActivateur}">
            <JetonVariable
              v-bind="propsActivateur"
              :id="idVariable"
            />
          </template>
        </carte-variable>
      </template>
      <template #itemListe="{id: idVariable}">
        <carte-variable :id="idVariable">
          <template #activator="{props: propsActivateur}">
            <ItemVariable
              v-bind="propsActivateur"
              :id="idVariable"
            />
          </template>
        </carte-variable>
      </template>
    </serie-jetons>
    <v-skeleton-loader
      v-if="!variables"
      type="chip@3"
    />
    <p
      v-else-if="!variables.length"
      class="mb-2 text-center text-disabled"
    >
      {{ t('bds.aucuneVariable') }}
    </p>

    <division-carte
      :titre="t('bds.motsClefs')"
      :en-attente="!motsClefs"
    />
    <serie-jetons
      :n-max="5"
      :items="motsClefs"
    >
      <template #jeton="{id: idMotClef}">
        <carte-mot-clef :id="idMotClef">
          <template #activator="{props: propsActivateur}">
            <JetonMotClef
              v-bind="propsActivateur"
              :id="idMotClef"
            />
          </template>
        </carte-mot-clef>
      </template>
      <template #itemListe="{id: idMotClef}">
        <carte-mot-clef :id="idMotClef">
          <template #activator="{props: propsActivateur}">
            <ItemMotClef
              v-bind="propsActivateur"
              :id="idMotClef"
            />
          </template>
        </carte-mot-clef>
      </template>
    </serie-jetons>

    <v-skeleton-loader
      v-if="!motsClefs"
      type="chip@3"
    />
    <span v-else>
      <p
        v-if="!motsClefs.length"
        class="mb-2 text-center text-disabled"
      >
        {{ t('bds.aucunMotClef') }}
        <EditeurMotsClefs
          v-if="monAutorisation"
          :originaux="motsClefs"
          @sauvegarder="x => sauvegarderMotsClefs(x)"
        />
      </p>
      <EditeurMotsClefs
        v-else-if="monAutorisation"
        :originaux="motsClefs"
        @sauvegarder="x => sauvegarderMotsClefs(x)"
      />
    </span>

    <division-carte
      :titre="t('bds.tableaux')"
      :en-attente="!tableaux"
    />
    <ItemTableau
      v-for="tableau in tableaux"
      :id="tableau.id"
      :key="tableau.clef"
    />
    <v-skeleton-loader
      v-if="!tableaux"
      type="list-item-avatar-two-line@2"
    />
    <p v-else-if="!tableaux.length">{{ t('bds.aucunTableau') }}</p>

    <template #pied>
      <v-btn
        variant="outlined"
        append-icon="mdi-open-in-new"
        color="primary"
        @click="$router.push(encodeURI(`/données/bd/${encodeURIComponent(id)}`))"
      >
        {{ t('bds.ouvrirBd') }}
      </v-btn>
    </template>
  </base-carte-objet>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import {utiliserConstellation} from '/@/components/utils';

import SerieJetons from '/@/components/communs/SérieJetons.vue';
import JetonLicence from '/@/components/licences/JetonLicence.vue';
import CarteReplicationsObjet from '/@/components/épingles/CarteRéplicationsObjet.vue';

import ItemMotClef from '/@/components/motsClefs/ItemMotClef.vue';
import JetonMotClef from '/@/components/motsClefs/JetonMotClef.vue';
import ItemTableau from '/@/components/tableaux/ItemTableau.vue';
import ItemVariable from '/@/components/variables/ItemVariable.vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';

import JetonQualite from './JetonQualitéBd.vue';
import DivisionCarte from '/@/components/communs/DivisionCarte.vue';
import JetonReplications from '/@/components/communs/JetonRéplications.vue';
import DialogueLicence from '/@/components/licences/DialogueLicence.vue';
import CarteMotClef from '/@/components/motsClefs/CarteMotClef.vue';
import EditeurMotsClefs from '/@/components/motsClefs/ÉditeurMotsClefs.vue';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import EpinglerBd from '/@/components/épingles/ÉpinglerBd.vue';

import {utiliserImagesDéco} from '/@/composables/images';
import {ajusterTexteTraductible, sourceImage} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {obtImageDéco} = utiliserImagesDéco();

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: props.id});

// Nom bd
const noms = suivre(constl.bds.suivreNomsBd, {idBd: props.id}, {});

const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const langue of àEffacer) {
    await constl.bds.effacerNomBd({idBd: props.id, langue});
  }
  await constl.bds.sauvegarderNomsBd({
    idBd: props.id,
    noms: àAjouter,
  });
};

// Descriptions bd
const descriptions = suivre(constl.bds.suivreDescriptionsBd, {idBd: props.id}, {});

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl.bds.effacerDescriptionBd({idBd: props.id, langue});
  }
  await constl.bds.sauvegarderDescriptionsBd({
    idBd: props.id,
    descriptions: àAjouter,
  });
};

// Image
const image = sourceImage(suivre(constl.bds.suivreImage, {idBd: props.id}));
const imageDéfaut = obtImageDéco('logoBD');

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursBd, {idBd: props.id});

// Licence
const licence = suivre(constl.bds.suivreLicenceBd, {idBd: props.id});
const licenceContenu = suivre(constl.bds.suivreLicenceContenuBd, {idBd: props.id});
const changerLicence = async ({
  licence: nouvelleLicence,
  licenceContenu: nouvelleLicenceContenu,
}: {
  licence: string;
  licenceContenu?: string;
}) => {
  await Promise.all([
    constl.bds.changerLicenceBd({idBd: props.id, licence: nouvelleLicence}),
    constl.bds.changerLicenceContenuBd({idBd: props.id, licenceContenu: nouvelleLicenceContenu}),
  ]);
};

// Variables
const variables = suivre(constl.bds.suivreVariablesBd, {idBd: props.id});

// Mots-clefs
const motsClefs = suivre(constl.bds.suivreMotsClefsBd, {idBd: props.id});
const sauvegarderMotsClefs = async (àJour: string[]) => {
  const nouveaux = àJour.filter(m => !motsClefs.value?.includes(m));
  const àEnlever = motsClefs.value?.filter(m => !àJour.includes(m)) || [];
  await constl.bds.ajouterMotsClefsBd({
    idBd: props.id,
    idsMotsClefs: nouveaux,
  });
  await Promise.all(àEnlever.map(m => constl.bds.effacerMotClefBd({idBd: props.id, idMotClef: m})));
};

// Tableaux
const tableaux = suivre(constl.bds.suivreTableauxBd, {idBd: props.id});

// Effacer
const effacerBd = async () => {
  await constl.bds.effacerBd({idBd: props.id});
};
</script>
