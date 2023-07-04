<template>
  <v-btn
    :style="'position: absolute;' + (isRtl ? 'left:' : 'right:') + '20px; top: 20px'"
    icon="mdi-earth"
    size="small"
  >
    <v-icon size="large"></v-icon>

    <v-menu
      activator="parent"
      open-on-hover
      offset="10px"
      min-width="225"
      :location="isRtl ? 'bottom right' : 'bottom left'"
    >
      <v-list
        class="overflow-y-auto"
        max-height="500px"
        min-width="200px"
      >
        <ContribuerTraductions>
          <template #activator="{props}">
            <v-list-item
              v-bind="props"
              :disabled="!constellationPrète"
            >
              <template #prepend>
                <v-icon> mdi-plus </v-icon>
              </template>
              <v-list-item-title>
                {{ t('languesInterface.contribuer') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </ContribuerTraductions>
        <v-progress-linear
          v-if="!constellationPrète"
          height="1"
          color="primary"
          :indeterminate="!constellationPrète"
        ></v-progress-linear>
        <v-divider v-else />
        <item-langue
          v-for="code in codesLanguesDisponibles"
          :key="code"
          :code="code"
          :selectionnee="code === langue"
          @click="() => choisirLangues(code)"
        />
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import {useRtl} from 'vuetify';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

import type {client} from '@constl/ipa';

import ItemLangue from '/@/components/langues/ItemLangueProgrès.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import ContribuerTraductions from './contribuer/ContribuerTraductions.vue';
import {inject, ref} from 'vue';

const constl = inject<client.ClientConstellation>('constl');

const constellationPrète = ref(false);
constl?.obtIdCompte().then(() => (constellationPrète.value = true));

const {useI18n, கிடைக்கும்_மொழிகளை_பயன்படுத்து} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const {isRtl} = useRtl();

const {langue, choisirLangues} = utiliserLangues();
const {codesLanguesDisponibles} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();
</script>

<style></style>
