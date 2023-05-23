<template>
  <v-card class="text-start">
    <v-card-text>
      <div class="d-flex flex-wrap">
        <v-card
          flat
          width="300"
          class="mx-3 my-3"
        >
          <p class="px-0 mb-0 text-overline">
            {{ t("pages.compte.options.couleurs") }}
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
          <p class="px-0 mb-0 text-overline">
            {{ t("pages.compte.options.culture") }}
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
          <p class="px-0 mb-0 text-overline">
            {{ t("pages.compte.options.langue") }}
          </p>
          <v-divider class="mb-4" />
          <v-autocomplete
            v-model="langueChoisie"
            :items="codesLanguesDisponibles"
            :label="t('pages.compte.options.langue')"
            variant="outlined"
            density="compact"
            hide-details
            prepend-icon="mdi-earth"
            class="pb-5"
          >
            <template #item="{ item, props }">
              <item-langue
                v-bind="props"
                :code="item.value"
                :selectionnee="item.value === langue"
              />
            </template>
            <template #selection="{ item }">
              <jeton-langue 
                :code="item.value"
              />
            </template>
          </v-autocomplete>
          <!--<v-autocomplete
            :value="choixNumération"
            :items="[{ text: t('communs.auto'), value: null }, ...systèmesNum]"
            :label="t('compte.options.numération')"
            outlined
            dense
            hide-details
            prepend-icon="mdi-abacus"
            class="py-5"
            @change="(e) => changerNumération(e)"
          >
            <template v-slot:item="{ on, item }">
              <v-list-item v-on="on">
                <v-list-item-content>
                  {{ item.text || item }}
                </v-list-item-content>
                <v-list-item-action>
                  {{
                    chifreÀTexte(
                      123.45,
                      item.value === null
                        ? numLangue(langue) ||
                            (systèmesNum.includes(langue) ? langue : "latin")
                        : item
                    )
                  }}
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-autocomplete>-->
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { ref, watchEffect, watch } from 'vue';
import { useTheme } from 'vuetify';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import { utiliserLangues } from '/@/plugins/localisation/localisation';

import { utiliserÉtatThème } from '/@/état/thème';

import ItemLangue from '/@/components/langues/ItemLangueProgrès.vue';
import JetonLangue from '/@/components/langues/JetonLangue.vue';

const {useI18n, கிடைக்கும்_மொழிகளை_பயன்படுத்து} = கிளிமூக்கை_உபயோகி();
const {langue, choisirLangues} = utiliserLangues();
const {t} = useI18n();

// Thème
const état = utiliserÉtatThème();
const thème = useTheme();

const couleurThème = ref(état.couleur);

const thèmeImages = ref(état.thèmeImages);
watchEffect(()=>{
  état.couleur = couleurThème.value;
  thème.global.name.value = couleurThème.value;
});

watchEffect(()=>{
  état.thèmeImages = thèmeImages.value;
});

// Langues
const langueChoisie = ref(langue.value);
const {codesLanguesDisponibles} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();

watchEffect(()=>{
  langueChoisie.value = langue.value;
});
watch(langueChoisie, ()=>{
  if (langue.value !== langueChoisie.value)
    choisirLangues(langueChoisie.value);
});

</script>
