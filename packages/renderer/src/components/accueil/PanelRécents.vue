<template>
  <v-row>
    <v-col cols="12">
      <p class="text-h4">
        {{ t('accueil.page.récents.titre') }}
      </p>
    </v-col>
    <v-col :cols="mdAndUp ? 4 : smAndUp ? 6 : 12">
      <v-card
        class="text-start"
        style="height: 100%"
      >
        <v-card-item>
          <v-card-title>
            <v-avatar><v-icon>mdi-plus</v-icon></v-avatar>
            {{ t('accueil.page.récents.nouveau') }}
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <v-list>
            <nouvelle-bd>
              <template #activator="{props: propsActivateur}">
                <v-list-item
                  v-bind="propsActivateur"
                  :prepend-icon="icôneObjet('bd')"
                  :title="t('accueil.page.récents.nouvelleBd')"
                ></v-list-item>
              </template>
            </nouvelle-bd>
            <nouveau-projet>
              <template #activator="{props: propsActivateur}">
                <v-list-item
                  v-bind="propsActivateur"
                  :prepend-icon="icôneObjet('projet')"
                  :title="t('accueil.page.récents.nouveauProjet')"
                ></v-list-item>
              </template>
            </nouveau-projet>
            <nouvelle-nuee>
              <template #activator="{props: propsActivateur}">
                <v-list-item
                  v-bind="propsActivateur"
                  :prepend-icon="icôneObjet('nuée')"
                  :title="t('accueil.page.récents.nouvelleNuée')"
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
      :cols="mdAndUp ? 4 : smAndUp ? 6 : 12"
    >
      <carte-document-recent
        :id="r.id"
        :a="r.à"
      />
    </v-col>
    <v-col
      v-if="récentsEnPlus.length"
      :cols="mdAndUp ? 4 : smAndUp ? 6 : 12"
    >
      <v-dialog>
        <template #activator="{props: propsActivateur}">
          <v-card
            v-bind="propsActivateur"
            class="d-flex align-center text-center"
            variant="flat"
            height="100%"
          >
            <span class="pa-4 ma-auto text-h4 text-center">
              {{ t('accueil.page.récents.voirPlus') }}
              <br />
              <p class="text-h2 my-4">
                {{ t('accueil.page.récents.plusN', [récentsEnPlus.length]) }}
              </p>
            </span>
          </v-card>
        </template>
        <v-card>
          <v-card-item>
            <v-card-title>
              {{ t('accueil.page.récents.documentsRécents') }}
            </v-card-title>
          </v-card-item>
          <v-card-text style="overflow-y: auto">
            <v-list>
              <item-document-recent
                v-for="récent in récents"
                :id="récent.id"
                :key="récent.id"
                :a="récent.à"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-col>
    <v-col
      v-if="!récents.length"
      :cols="mdAndUp ? 8 : smAndUp ? 6 : 12"
    >
      <v-card
        class="d-flex align-center text-center"
        variant="flat"
        height="230"
      >
        <span class="pa-4 ma-auto text-h4 text-center text-disabled">
          {{ t('accueil.page.récents.aucunRécent') }}
        </span>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {storeToRefs} from 'pinia';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';

import {icôneObjet} from '/@/components/utils';
import NouvelleBd from '../bds/NouvelleBd.vue';
import NouveauProjet from '../projets/NouveauProjet.vue';
import NouvelleNuee from '../nuées/NouvelleNuée.vue';
import CarteDocumentRecent from './CarteDocumentRécent.vue';
import ItemDocumentRecent from './ItemDocumentRécent.vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {mdAndUp, smAndUp} = useDisplay();

const étatHistoriqueDocuments = utiliserHistoriqueDocuments();
const {récents} = storeToRefs(étatHistoriqueDocuments);

const nMaxRécents = ref(5);
const récentsÀMontrer = computed(() => {
  return récents.value.length === nMaxRécents.value
    ? récents.value
    : récents.value.slice(0, nMaxRécents.value - 1);
});

const récentsEnPlus = computed(() => {
  return récents.value.length <= nMaxRécents.value
    ? []
    : récents.value.slice(nMaxRécents.value - 1);
});
</script>
