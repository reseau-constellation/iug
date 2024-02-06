<template>
  <v-row>
    <v-col cols="12">
      <p class="text-h4">
        {{ t('accueil.page.récents.titre') }}
      </p>
      <v-card-title> </v-card-title>
    </v-col>
    <v-col :cols="mdAndUp ? 4 : (smAndUp ? 6: 12)">
      <v-card
        class="text-start"
        height="230"
      >
        <v-card-item>
          <v-card-title>
            <v-avatar><v-icon>mdi-plus</v-icon></v-avatar>Nouveau document
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-list>
            <nouvelle-bd>
              <template #activator="{props: propsActivateur}">
                <v-list-item
                  v-bind="propsActivateur"
                  :prepend-icon="icôneObjet('bd')"
                  title="Base de données"
                ></v-list-item>
              </template>
            </nouvelle-bd>
            <nouveau-projet>
              <template #activator="{props: propsActivateur}">
                <v-list-item
                  v-bind="propsActivateur"
                  :prepend-icon="icôneObjet('projet')"
                  title="Projet"
                ></v-list-item>
              </template>
            </nouveau-projet>
            <nouvelle-nuee>
              <template #activator="{props: propsActivateur}">
                <v-list-item
                  v-bind="propsActivateur"
                  :prepend-icon="icôneObjet('nuée')"
                  title="Science citoyenne"
                ></v-list-item>
              </template>
            </nouvelle-nuee>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col
      v-for="r in récentsÀMontrer"
      :key="r.id"
      :cols="mdAndUp ? 4 : (smAndUp ? 6: 12)"
    >
      <carte-document-recent
        :id="r.id"
        :a="r.à"
      />
    </v-col>
    <v-col
      v-if="récentsEnPlus.length"
      :cols="smAndUp ? 4 : 12"
    >
      <v-dialog>
        <template #activator="{props: propsActivateur}">
          <v-card
            v-bind="propsActivateur"
            class="d-flex align-center text-center"
            variant="flat"
            height="230"
          >
            <span class="pa-4 ma-auto text-h4 text-center">
              Voir plus
              <br />
              <v-icon>mdi-plus</v-icon>
            </span>
          </v-card>
        </template>
        <v-card>
          <v-card-item>
            <v-card-title>Documents récents</v-card-title>
          </v-card-item>
          <v-card-text style="overflow-y: auto">
            <v-list>
              <v-list-item
                v-for="récent in récents"
                :key="récent.id"
                :title="récent.id"
              >
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col
      v-if="!récents.length"
      :cols="mdAndUp ? 8 : 12"
    >
      <v-card
        class="d-flex align-center text-center"
        variant="flat"
        height="230"
      >
        <span class="pa-4 ma-auto text-h4 text-center text-disabled">
          Vous n'avez aucun document récemment ouvert.
        </span>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import {computed} from 'vue';
import {useDisplay} from 'vuetify';

import {storeToRefs} from 'pinia';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';

import {icôneObjet} from '/@/components/utils';
import NouvelleBd from '../bds/NouvelleBd.vue';
import NouveauProjet from '../projets/NouveauProjet.vue';
import NouvelleNuee from '../nuées/NouvelleNuée.vue';
import CarteDocumentRecent from './CarteDocumentRécent.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const {mdAndUp, smAndUp} = useDisplay();

const étatHistoriqueDocuments = utiliserHistoriqueDocuments();
const {récents} = storeToRefs(étatHistoriqueDocuments);

const nMaxRécents = 5;
const récentsÀMontrer = computed(() => {
  return récents.value.length === nMaxRécents
    ? récents.value
    : récents.value.slice(0, nMaxRécents - 1);
});

const récentsEnPlus = computed(() => {
  return récents.value.length <= nMaxRécents ? [] : récents.value.slice(nMaxRécents - 1);
});
</script>
