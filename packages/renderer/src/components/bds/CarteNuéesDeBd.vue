<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t('bds.nuées.carte.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-list>
          <nouvelle-nuee>
            <template #activateur="{props: propsActivateur}">
              <v-list-item
                v-bind="propsActivateur"
                prepend-icon="mdi-database-plus-outline"
              >
                {{ t('bds.nuées.créer') }}
              </v-list-item>
            </template>
          </nouvelle-nuee>
          <selecteur-nuee multiples>
            <template #activateur="{props: propsActivateur}">
              <v-list-item
                v-bind="propsActivateur"
                prepend-icon="mdi-database-plus-outline"
              >
                {{ t('bds.nuées.ajouter') }}
              </v-list-item>
            </template>
          </selecteur-nuee>
          <v-divider />
          <item-nuee
            v-for="idNuée in nuéesDeBd"
            :id="idNuée"
            :key="idNuée"
          />
          <div class="text-center">
            <p
              v-if="!nuéesDeBd?.length"
              class="my-4 text-h6 text-disabled"
            >
              {{ t('bds.nuées.aucuneNuée') }}
            </p>
          </div>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {suivre} from '@constl/vue';
import {utiliserConstellation} from '../utils';
import ItemNuee from '/@/components/nuées/ItemNuée.vue';
import SelecteurNuee from '/@/components/nuées/SélecteurNuée.vue';
import NouvelleNuee from '/@/components/nuées/NouvelleNuée.vue';

const props = defineProps<{idBd: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Nuées
const nuéesDeBd = suivre(constl.bds.suivreNuéesBd, {
  idBd: computed(() => props.idBd),
});
</script>
  