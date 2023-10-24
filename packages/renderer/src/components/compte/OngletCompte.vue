<template>
  <v-card class="text-start">
    <v-card-text>
      <p class="px-0 mb-0 text-h6">
        {{ t('pages.compte.compte.mesDispositifs') }}
      </p>
      <v-divider />
      <v-list>
        <InviterDispositif>
          <template #activator="{props: propsActivateur}">
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
          :vu-a="statutDispositifs?.find(d => d.infoDispositif.idDispositif === id)?.vuÀ"
        />
      </v-list>
      <p class="px-0 mb-0 text-h6">
        {{ t('pages.compte.compte.optionsAvancées') }}
      </p>

      <v-card variant="outlined">
        <v-list>
          <v-list-item>
            <v-list-item-title>
              {{ t('pages.compte.compte.titreExporterCompte') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ t('pages.compte.compte.sousTitreExporterCompte') }}
            </v-list-item-subtitle>
            <template #append>
              <ExporterCompte>
                <template #activator="{props: propsActivateur}">
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
                  ></v-btn>
                </template>
              </ExporterCompte>
            </template>
          </v-list-item>
          <v-divider class="my-2" />
          <v-list-item>
            <v-list-item-title>
              {{ t('pages.compte.compte.titreRejoindreCompte') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ t('pages.compte.compte.sousTitreRejoindreCompte') }}
            </v-list-item-subtitle>
            <template #append>
              <RejoindreCompte>
                <template #activator="{props: propsActivateur}">
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
                  ></v-btn>
                </template>
              </RejoindreCompte>
            </template>
          </v-list-item>
          <v-divider class="my-2" />
          <v-list-item class="text-error">
            <v-list-item-title>
              {{ t('pages.compte.compte.titreEffacerCompte') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ t('pages.compte.compte.sousTitreEffacerCompte') }}
            </v-list-item-subtitle>
            <template #append>
              <FermerCompte>
                <template #activator="{props: propsActivateur}">
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
                  ></v-btn>
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
import type {réseau} from '@constl/ipa';
import type {ClientConstellation} from '@constl/ipa';

import {ref, inject} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import ItemDispositif from '/@/components/membres/ItemDispositif.vue';
import InviterDispositif from './InviterDispositif.vue';
import RejoindreCompte from './RejoindreCompte.vue';
import FermerCompte from './FermerCompte.vue';
import ExporterCompte from './ExporterCompte.vue';

import {enregistrerÉcoute} from '/@/components/utils';

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {mdAndUp} = useDisplay();

// Dispositifs
const dispositifs = ref<string[]>();
enregistrerÉcoute(
  constl?.suivreDispositifs({
    f: x => (dispositifs.value = x),
  }),
);

const statutDispositifs = ref<réseau.statutDispositif[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreConnexionsDispositifs({
    f: x => (statutDispositifs.value = x),
  }),
);
</script>
