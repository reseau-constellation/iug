<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
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

    <division-carte
      :titre="t('bds.carteBd.infos')"
      :en-attente="false"
    />

    <dialogue-licence
      :licence="licence"
      :permission-modifier="!!monAutorisation"
      @changer-licence="changerLicence"
    >
      <template #activator="{props: propsActivateur}">
        <JetonLicence
          v-bind="propsActivateur"
          :licence="licence"
        />
      </template>
    </dialogue-licence>

    <JetonQualité :id="id" />
    <JetonRéplications :id="id" />

    <division-carte
      :titre="t('bds.carteBd.variables')"
      :en-attente="!variables"
    />
    <SérieJetons
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
    </SérieJetons>

    <division-carte
      :titre="t('bds.carteBd.motsClefs')"
      :en-attente="!motsClefs"
    />
    <SérieJetons
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
    </SérieJetons>
    <EditeurMotsClefs
      v-if="monAutorisation && motsClefs"
      :originaux="motsClefs"
      @sauvegarder="x => sauvegarderMotsClefs(x)"
    />

    <division-carte
      :titre="t('bds.carteBd.tableaux')"
      :en-attente="!tableaux"
    />
    <ItemTableau
      v-for="tableau in tableaux"
      :id="tableau.id"
      :key="tableau.clef"
    />
    <p v-if="!tableaux">{{ t('bds.carteBd.attenteTableaux') }}</p>
    <p v-else-if="!tableaux.length">{{ t('bds.carteBd.aucunTableaux') }}</p>

    <v-divider class="mb-2" />
    <div class="text-center">
      <v-btn
        variant="outlined"
        append-icon="mdi-open-in-new"
        @click="$router.push(encodeURI(`/données/bd/${encodeURIComponent(id)}`))"
      >
        {{ t('bds.carteBd.ouvrirBd') }}
      </v-btn>
    </div>
  </base-carte-objet>
</template>

<script setup lang="ts">
import {constellation, suivre} from '/@/components/utils';
import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import SérieJetons from '/@/components/communs/SérieJetons.vue';
import JetonLicence from '/@/components/licences/JetonLicence.vue';

import JetonVariable from '/@/components/variables/JetonVariable.vue';
import ItemVariable from '/@/components/variables/ItemVariable.vue';
import JetonMotClef from '/@/components/motsClefs/JetonMotClef.vue';
import ItemMotClef from '/@/components/motsClefs/ItemMotClef.vue';
import ItemTableau from '/@/components/tableaux/ItemTableau.vue';

import EditeurMotsClefs from '/@/components/motsClefs/ÉditeurMotsClefs.vue';
import DivisionCarte from '/@/components/communs/DivisionCarte.vue';
import JetonRéplications from '/@/components/communs/JetonRéplications.vue';
import CarteMotClef from '/@/components/motsClefs/CarteMotClef.vue';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import DialogueLicence from '/@/components/licences/DialogueLicence.vue';
import JetonQualité from './JetonQualitéBd.vue';

import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

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

// Descriptions mot-clef
const descriptions = suivre(constl.bds.suivreNomsBd, {idBd: props.id}, {});

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

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursBd, {idBd: props.id});

// Licence
const licence = suivre(constl.bds.suivreLicenceBd, {idBd: props.id});
const changerLicence = async (nouvelleLicence: string) => {
  await constl.bds.changerLicenceBd({idBd: props.id, licence: nouvelleLicence});
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
