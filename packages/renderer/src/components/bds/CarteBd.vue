<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
    @ajuster-noms="ajusterNoms"
    @ajuster-descriptions="ajusterDescriptions"
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
    <GérerMotsClefsObjet
      v-if="monAutorisation && motsClefs"
      :originaux="motsClefs"
      @sauvegarder="x => sauvegarderMotsClefs(x)"
    />

    <division-carte
      :titre="t('bds.carteBd.tableaux')"
      :en-attente="!tableaux"
    />
    <ItemTableau
      v-for="tableau in tableauxOrdonnés"
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
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {infoAuteur} from '@constl/ipa/dist/src/utils';
import type {infoTableauAvecId} from '@constl/ipa/dist/src/bds';

import {computed, inject, ref} from 'vue';

import {enregistrerÉcoute} from '/@/composables/utils';
import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import SérieJetons from '/@/components/communs/SérieJetons.vue';
import JetonLicence from '/@/components/licences/JetonLicence.vue';

import JetonVariable from '/@/components/variables/JetonVariable.vue';
import ItemVariable from '/@/components/variables/ItemVariable.vue';
import JetonMotClef from '/@/components/motsClefs/JetonMotClef.vue';
import ItemMotClef from '/@/components/motsClefs/ItemMotClef.vue';
import ItemTableau from '/@/components/tableaux/ItemTableau.vue';

import GérerMotsClefsObjet from '../motsClefs/GérerMotsClefsObjet.vue';
import DivisionCarte from '../communs/DivisionCarte.vue';
import JetonRéplications from '../communs/JetonRéplications.vue';
import JetonQualité from './JetonQualité.vue';
import CarteMotClef from '/@/components/motsClefs/CarteMotClef.vue';
import CarteVariable from '/@/components/variables/CarteVariable.vue';
import DialogueLicence from '../licences/DialogueLicence.vue';
import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

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

const ajusterNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const langue of àEffacer) {
    await constl?.bds?.effacerNomBd({id: props.id, langue});
  }
  await constl?.bds?.ajouterNomsBd({
    id: props.id,
    noms: àAjouter,
  });
};

// Descriptions mot-clef
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.bds?.suivreNomsBd({
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
    await constl?.bds?.effacerDescrBd({id: props.id, langue});
  }
  await constl?.bds?.ajouterDescriptionsBd({
    id: props.id,
    descriptions: àAjouter,
  });
};

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
const tableauxOrdonnés = computed(() => {
  const listeTableaux = tableaux.value;
  listeTableaux?.sort((a, b) =>
    a.position && b.position ? (a.position > b.position ? 1 : -1) : 0,
  );
  return listeTableaux || [];
});
</script>
