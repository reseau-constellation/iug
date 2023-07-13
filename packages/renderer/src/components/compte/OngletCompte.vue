<template>
  <v-card class="text-start">
    <v-card-text>
      <p class="px-0 mb-0 text-overline">
        {{ t('pages.compte.compte.mesDispositifs') }}
      </p>
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
          :vu-a="statutDispositifs?.find(d => d.infoDispositif.idOrbite === id)?.vuÀ"
        />
      </v-list>
      <p class="px-0 mb-0 text-overline">
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
            <v-list-item-action>
              <ExporterCompte>
                <template #activator="{props: propsActivateur}">
                  <v-btn
                    v-bind="propsActivateur"
                    prepend-icon="mdi-download"
                  >
                    {{ t('pages.compte.compte.btnExporterCompte') }}
                  </v-btn>
                </template>
              </ExporterCompte>
            </v-list-item-action>
          </v-list-item>
          <v-list-item color="error">
            <v-list-item-title>
              {{ t('pages.compte.compte.titreEffacerCompte') }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ t('pages.compte.compte.sousTitreEffacerCompte') }}
            </v-list-item-subtitle>
            <v-list-item-action>
              <FermerCompte>
                <template #activator="{props: propsActivateur}">
                  <v-btn
                    v-bind="propsActivateur"
                    prepend-icon="mdi-delete"
                  >
                    {{ t('pages.compte.compte.btnEffacerCompte') }}
                  </v-btn>
                </template>
              </FermerCompte>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import type {client, réseau} from '@constl/ipa';
import {ref, inject} from 'vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import ItemDispositif from '/@/components/membres/ItemDispositif.vue';
import InviterDispositif from './InviterDispositif.vue';
import FermerCompte from './FermerCompte.vue';
import ExporterCompte from './ExporterCompte.vue';

import {enregistrerÉcoute} from '/@/components/utils';

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

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
