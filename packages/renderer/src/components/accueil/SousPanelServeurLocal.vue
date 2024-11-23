<template>
  <v-card
    class="text-start"
    style="height: 100%"
  >
    <v-card-item>
      <v-card-title>
        <v-avatar><v-icon>mdi-transit-connection-horizontal</v-icon></v-avatar>
        {{ t('accueil.page.connectivité.serveurLocal.titre') }}
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-list>
        <v-list-item>
          <div class="text-disabled">
            Pour connecter Constellation à des applis externes.
          </div>
        </v-list-item>
        <v-list-item>
          <v-switch
            v-model="contrôleServeur"
            class="mx-2"
            density="compact"
            hide-details
            true-icon="mdi-check"
            false-icon="mdi-close"
            :color="contrôleServeur ? 'secondary' : undefined"
            :readonly="changementEnCours"
            :loading="changementEnCours"
            :label="t(`accueil.page.connectivité.serveurLocal.${contrôleServeur ? 'activé' : 'désactivé'}`)"
          />
        </v-list-item>
        <v-list-item prepend-icon="mdi-lan">
          {{ t('accueil.page.connectivité.serveurLocal.requêtes', nRequêtes || 0) }}
        </v-list-item>
        <div class="text-center">
          <controles-serveur-local>
            <template #activator="{props: propsActivateur}">
              <v-btn
                v-bind="propsActivateur"
                class="mx-auto"
                variant="outlined"
                prepend-icon="mdi-toggle-switch-outline"
              >
                {{ t('accueil.page.connectivité.serveurLocal.gérer') }}
              </v-btn>
            </template>
          </controles-serveur-local>
        </div>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {utiliserServeurLocalConstellation} from '../utils';

import ControlesServeurLocal from './ContrôlesServeurLocal.vue';
import { watchEffect } from 'vue';

const serveurLocal = utiliserServeurLocalConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Contrôles
const contrôleServeur = ref(false);
const changementEnCours = computed(()=>{
  return contrôleServeur.value !== (étatServeur.value?.état === 'actif');
});

watchEffect(async ()=> {
  if (contrôleServeur.value && étatServeur.value?.état === 'fermé') {
    await serveurLocal.initialiser();
  } else {
    await serveurLocal.fermer();
  };
});

// Serveur local
const requêtesServeurLocal = suivre(serveurLocal.suivreRequêtesAuthServeur.bind(serveurLocal));
const nRequêtes = computed(() => requêtesServeurLocal.value?.length);

const étatServeur = suivre(serveurLocal.suivreÉtatServeur.bind(serveurLocal));
</script>
