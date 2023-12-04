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
      <v-list>
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
        <v-text-field
          v-model="rechercheLangue"
          density="compact"
          prepend-inner-icon="mdi-magnify"
          autofocus
          hide-details
          @click.stop
        ></v-text-field>
        <v-list
          class="overflow-y-auto"
          max-height="400px"
          min-width="200px"
        >
          <item-langue
            v-for="code in languesDisponibles"
            :key="code"
            :code="code"
            :selectionnee="code === மொழி"
            @click="() => மொழிகளை_தேர்ந்தெடுக்கொள்ளு(code)"
          />
        </v-list>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script setup lang="ts">
import {useRtl} from 'vuetify';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import type {ClientConstellation} from '@constl/ipa';

import ItemLangue from '/@/components/langues/ItemLangueProgrès.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import ContribuerTraductions from './contribuer/ContribuerTraductions.vue';
import {inject, ref} from 'vue';
import { computed } from 'vue';

const constl = inject<ClientConstellation>('constl');

const constellationPrète = ref(false);
constl?.obtIdCompte().then(() => (constellationPrète.value = true));

const {கிடைக்கும்_மொழிகளை_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொழிகளும்_குறியீடுகளும்} = கிடைக்கும்_மொழிகளை_பயன்படுத்து({});
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const {isRtl} = useRtl();

const {மொழி, மொழிகளை_தேர்ந்தெடுக்கொள்ளு} = மொழிகளைப்_பயன்படுத்து();

// Recherche
const rechercheLangue = ref<string>();
const languesDisponibles = computed(()=>{
  return மொழிகளும்_குறியீடுகளும்.value.filter(
    lng => (!rechercheLangue.value) || lng.குறியீடு.includes(rechercheLangue.value) || lng.மொழி.includes(rechercheLangue.value),
  ).map(lng=>lng.குறியீடு);
});

</script>

<style></style>
