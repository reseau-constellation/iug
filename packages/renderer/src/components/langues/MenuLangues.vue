<template>
  <v-btn
    :style="'position: absolute;' + (isRtl ? 'left:' : 'right:') + '20px; top: 20px; z-index:100'"
    icon="mdi-earth"
    size="small"
  >
    <v-icon size="large"></v-icon>

    <v-menu
      activator="parent"
      offset="10px"
      min-width="225"
      :location="isRtl ? 'bottom right' : 'bottom left'"
    >
      <v-list>
        <ContribuerTraductions>
          <template #activateur="{props}">
            <v-list-item
              v-bind="props"
              :disabled="!constellationPrète"
            >
              <template #prepend>
                <v-icon> mdi-plus </v-icon>
              </template>
              <v-list-item-title>
                {{ t('kilimukku.contribuer') }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </ContribuerTraductions>
        <v-progress-linear
          v-if="!constellationPrète"
          height="1"
          color="primary"
          indeterminate
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
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useRtl} from 'vuetify';

import {
  கிடைக்கும்_மொழிகளைப்_பயன்படுத்து,
  மொழியாக்கத்தைப்_பயன்படுத்து,
} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {utiliserConstellation} from '../utils';
import ContribuerTraductions from './contribuer/ContribuerTraductions.vue';
import ItemLangue from '/@/components/langues/ItemLangueProgrès.vue';

const constl = utiliserConstellation();

const constellationPrète = ref(false);
constl.obtIdCompte().then(() => (constellationPrète.value = true));

const {மொழிகளும்_குறியீடுகளும்} = கிடைக்கும்_மொழிகளைப்_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {isRtl} = useRtl();

const {மொழி, மொழிகளை_தேர்ந்தெடுக்கொள்ளு} = மொழிகளைப்_பயன்படுத்து();

// Recherche
const rechercheLangue = ref<string>();
const languesDisponibles = computed(() => {
  return மொழிகளும்_குறியீடுகளும்.value
    .filter(
      lng =>
        !rechercheLangue.value ||
        lng.குறியீடு.includes(rechercheLangue.value) ||
        lng.மொழி.includes(rechercheLangue.value),
    )
    .map(lng => lng.குறியீடு);
});
</script>

<style></style>
