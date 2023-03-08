<template>
  <v-card>
    <ImageProfil :id="id" />
    <v-card-item>
      <v-card-title>{{ nomTraduit || t('communs.anonyme') }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <division-carte :titre="t('membres.bds')" />
      <SérieJetons
        v-if="bdsMembre"
        :items="bdsMembre"
        :n-max="5"
      >
        <template #jeton="{id: idBd}">
          <JetonBd :id="idBd" />
        </template>
        <template #itemListe="{id: idBd}">
          <ItemBd
            :id="idBd"
            :montrer-anonymes="true"
          />
        </template>
      </SérieJetons>

      <division-carte :titre="t('membres.projets')" />
      <SérieJetons
        v-if="projetsMembre"
        :items="projetsMembre"
        :n-max="5"
      >
        <template #jeton="{id: idProjet}">
          <JetonProjet :id="idProjet" />
        </template>
        <template #itemListe="{id: idProjet}">
          <ItemProjet
            :id="idProjet"
            :montrer-anonymes="true"
          />
        </template>
      </SérieJetons>

      <division-carte :titre="t('membres.nuées')" />
      <SérieJetons
        v-if="nuéesMembre"
        :items="nuéesMembre"
        :n-max="5"
      >
        <template #jeton="{id: idNuée}">
          <JetonNuée :id="idNuée" />
        </template>
        <template #itemListe="{id: idNuée}">
          <ItemNuée
            :id="idNuée"
            :montrer-anonymes="true"
          />
        </template>
      </SérieJetons>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';

import {ref, inject} from 'vue';

import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/composables/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import SérieJetons from '/@/components/communs/SérieJetons.vue';
import ItemBd from '/@/components/bds/ItemBd.vue';
import JetonBd from '/@/components/bds/JetonBd.vue';
import JetonProjet from '/@/components/projets/JetonProjet.vue';
import ItemProjet from '/@/components/projets/ItemProjet.vue';
import JetonNuée from '/@/components/nuées/JetonNuée.vue';
import ItemNuée from '/@/components/nuées/ItemNuée.vue';
import ImageProfil from '../communs/ImageProfil.vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Nom
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.profil?.suivreNoms({
    f: x => (noms.value = x),
  }),
);

// Bds
const bdsMembre = ref<string[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreBdsMembre({
    idCompte: props.id,
    f: bds => (bdsMembre.value = bds),
  }),
);

// Projets
const projetsMembre = ref<string[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreProjetsMembre({
    idCompte: props.id,
    f: projets => (projetsMembre.value = projets),
  }),
);

// Nuées
const nuéesMembre = ref<string[]>();
/*enregistrerÉcoute(
  constl?.réseau?.suivreNuéesMembre({
    idCompte: props.id,
    f: nuées => (nuéesMembre.value = nuées),
  }),
);
*/
</script>
