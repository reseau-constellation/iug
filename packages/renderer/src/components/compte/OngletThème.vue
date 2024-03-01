<template>
  <v-card class="text-start">
    <v-card-text>
      <div class="d-flex flex-wrap">
        <v-card
          flat
          width="300"
          class="mx-3 my-3"
        >
          <p class="px-0 mb-0 font-weight-bold">
            {{ t('pages.compte.options.couleurs') }}
          </p>
          <v-divider class="mb-4" />
          <v-switch
            v-model="couleurThème"
            color="primary"
            true-value="dark"
            false-value="light"
            inset
            :label="t('pages.compte.options.thèmeNuit')"
          >
            <template #prepend>
              <v-icon
                :icon="couleurThème === 'dark' ? 'mdi-weather-night' : 'mdi-white-balance-sunny'"
                :color="couleurThème === 'dark' ? 'primary' : undefined"
              />
            </template>
          </v-switch>
        </v-card>

        <v-card
          flat
          width="300"
          class="mx-3 my-3"
        >
          <p class="px-0 mb-0 font-weight-bold">
            {{ t('pages.compte.options.culture') }}
          </p>
          <v-divider class="mb-4" />
          <v-radio-group
            v-model="thèmeImages"
            :label="t('pages.compte.options.thèmeImages')"
            class="mt-0"
          >
            <v-radio
              value="unDraw"
              :label="t('pages.compte.options.unDraw')"
            />

            <v-radio
              value="வவவ"
              :label="t('pages.compte.options.வவவ')"
            />
          </v-radio-group>
        </v-card>

        <v-card
          flat
          width="300"
          class="mx-3 my-3"
        >
          <p class="px-0 mb-0 font-weight-bold">
            {{ t('pages.compte.options.langue') }}
          </p>
          <v-divider class="mb-4" />
          <v-autocomplete
            v-model="langueChoisie"
            :items="கிடைக்கும்_மொழி_குறியீடுகள்"
            :label="t('pages.compte.options.langue')"
            variant="outlined"
            density="compact"
            hide-details
            prepend-icon="mdi-earth"
            class="pb-5"
          >
            <template #item="{item, props}">
              <item-langue
                v-bind="props"
                :code="item.value"
                :selectionnee="item.value === மொழி"
              />
            </template>
            <template #selection="{item}">
              <jeton-langue :code="item.value" />
            </template>
          </v-autocomplete>
          <v-autocomplete
            v-model="choixNumération"
            :items="[null, ...எண்ணுரு_முறைமைகள்]"
            :label="t('compte.options.numération')"
            variant="outlined"
            density="compact"
            hide-details
            prepend-icon="mdi-abacus"
            class="py-5"
          >
            <template #selection="{item}">
              <jetonNumération :code="item.value" />
            </template>
            <template #item="{props, item}">
              <ItemNumération
                v-bind="props"
                :code="item.value"
              />
            </template>
          </v-autocomplete>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import {ref, watchEffect, watch} from 'vue';
import {useTheme} from 'vuetify';

import {
  கிளிமூக்கை_பயன்படுத்து,
  மொழிகளைப்_பயன்படுத்து,
  எண்களைப்_பயன்படுத்து,
} from '@lassi-js/kilimukku-vue';

import {utiliserÉtatThème} from '/@/état/thème';

import ItemLangue from '/@/components/langues/ItemLangueProgrès.vue';
import JetonLangue from '/@/components/langues/JetonLangue.vue';
import ItemNumération from '/@/components/langues/ItemNumération.vue';
import JetonNumération from '/@/components/langues/JetonNumération.vue';

const {கிடைக்கும்_மொழிகளை_பயன்படுத்து, மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொழி, மொழிகளை_தேர்ந்தெடுக்கொள்ளு} = மொழிகளைப்_பயன்படுத்து();

const {தேர்ந்தெடுத்தப்பட்ட_எண்ணுரு, எண்ணுரு_முறைமைகள்} = எண்களைப்_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Thème
const état = utiliserÉtatThème();
const thème = useTheme();

const couleurThème = ref(état.couleur);

const thèmeImages = ref(état.thèmeImages);
watchEffect(() => {
  état.couleur = couleurThème.value;
  thème.global.name.value = couleurThème.value;
});

watchEffect(() => {
  état.thèmeImages = thèmeImages.value;
});

// Langues
const langueChoisie = ref(மொழி.value);
const {கிடைக்கும்_மொழி_குறியீடுகள்} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();

watchEffect(() => {
  langueChoisie.value = மொழி.value;
});
watch(langueChoisie, () => {
  if (மொழி.value !== langueChoisie.value) மொழிகளை_தேர்ந்தெடுக்கொள்ளு(langueChoisie.value);
});

// Numération
const choixNumération = ref(தேர்ந்தெடுத்தப்பட்ட_எண்ணுரு.value);
</script>
