<template>
  <v-card class="text-start">
    <v-card-text>
      <p class="mt-6 font-weight-bold">
        {{ t('pages.compte.compte.mesDispositifs') }}
      </p>
      <v-divider class="my-2" />
      <v-list>
        <InviterDispositif>
          <template #activateur="{props: propsActivateur}">
            <v-list-item
              v-bind="propsActivateur"
              prepend-icon="mdi-plus"
              :title="t('dispositifs.ajouter')"
            />
          </template>
        </InviterDispositif>
        <ItemDispositif
          v-for="id in dispositifs"
          :key="id"
          :id-dispositif="id"
          :id-sfip="
            statutDispositifs?.find(d => d.infoDispositif.idDispositif === id)?.infoDispositif
              .idLibp2p
          "
          :vu-a="statutDispositifs?.find(d => d.infoDispositif.idDispositif === id)?.vuÀ"
        />
      </v-list>
      <p class="mt-6 font-weight-bold">
        {{ t('pages.compte.compte.optionsAvancées') }}
      </p>
      <v-divider class="my-2" />
      <v-card variant="outlined">
        <v-list>
          <v-list-item>
            <v-list-item-title class="font-weight-bold">
              {{ t('pages.compte.compte.titreExporterCompte') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ t('pages.compte.compte.sousTitreExporterCompte') }}
            </v-list-item-subtitle>
            <template #append>
              <ExporterCompte>
                <template #activateur="{props: propsActivateur}">
                  <v-btn
                    v-if="mdAndUp"
                    v-bind="propsActivateur"
                    append-icon="mdi-download"
                    variant="outlined"
                  >
                    {{ t('pages.compte.compte.btnExporterCompte') }}
                  </v-btn>
                  <v-btn
                    v-else
                    v-bind="propsActivateur"
                    icon="mdi-download"
                    variant="outlined"
                    size="small"
                  />
                </template>
              </ExporterCompte>
            </template>
          </v-list-item>
          <v-divider
            v-if="false"
            class="my-2"
          />
          <v-list-item v-if="false">
            <v-list-item-title class="font-weight-bold">
              {{ t('pages.compte.compte.titreRejoindreCompte') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ t('pages.compte.compte.sousTitreRejoindreCompte') }}
            </v-list-item-subtitle>
            <template #append>
              <RejoindreCompte>
                <template #activateur="{props: propsActivateur}">
                  <v-btn
                    v-if="mdAndUp"
                    v-bind="propsActivateur"
                    append-icon="mdi-account-plus-outline"
                    variant="outlined"
                  >
                    {{ t('pages.compte.compte.btnRejoindreCompte') }}
                  </v-btn>
                  <v-btn
                    v-else
                    v-bind="propsActivateur"
                    icon="mdi-account-plus-outline"
                    variant="outlined"
                    size="small"
                  />
                </template>
              </RejoindreCompte>
            </template>
          </v-list-item>
          <v-divider class="my-2" />
          <v-list-item class="text-error">
            <v-list-item-title class="font-weight-bold">
              {{ t('pages.compte.compte.titreEffacerCompte') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ t('pages.compte.compte.sousTitreEffacerCompte') }}
            </v-list-item-subtitle>
            <template #append>
              <FermerCompte>
                <template #activateur="{props: propsActivateur}">
                  <v-btn
                    v-if="mdAndUp"
                    v-bind="propsActivateur"
                    append-icon="mdi-delete"
                    variant="outlined"
                  >
                    {{ t('pages.compte.compte.btnEffacerCompte') }}
                  </v-btn>
                  <v-btn
                    v-else
                    v-bind="propsActivateur"
                    icon="mdi-delete"
                    variant="outlined"
                    size="small"
                  />
                </template>
              </FermerCompte>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {useDisplay} from 'vuetify';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import ExporterCompte from './ExporterCompte.vue';
import FermerCompte from './FermerCompte.vue';
import InviterDispositif from './InviterDispositif.vue';
import RejoindreCompte from './RejoindreCompte.vue';
import ItemDispositif from '/@/components/membres/ItemDispositif.vue';

import {utiliserConstellation} from '/@/components/utils';

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

// Dispositifs
const dispositifs = suivre(constl.suivreDispositifs);

const statutDispositifs = suivre(constl.réseau.suivreConnexionsDispositifs);
</script>
