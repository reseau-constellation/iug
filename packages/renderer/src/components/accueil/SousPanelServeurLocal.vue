<template>
  <v-card
    class="text-start"
    style="height: 100%"
  >
    <v-card-item>
      <v-card-title>
        <v-avatar><v-icon>mdi-server</v-icon></v-avatar>
        {{ t('accueil.page.connectivité.serveurLocal.titre') }}
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-list>
        <v-list-item>
          <v-switch
            class="mx-2"
            density="compact"
            :label="étatServeur?.état === 'actif' ? '\'Activé\'' : '\'Désactivé\''"
          />
        </v-list-item>
        <v-list-item prepend-icon="mdi-lan">
          <template #title> 'Connections' </template>
        </v-list-item>
        <v-list-item prepend-icon="mdi-lan">
          <template #title> 'Requêtes': {{ nRequêtes || 0 }} </template>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {utiliserServeurLocalConstellation} from '../utils';

const serveurLocal = utiliserServeurLocalConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Serveur local
const requêtesServeurLocal = suivre(serveurLocal.suivreRequêtesAuthServeur.bind(serveurLocal));
const nRequêtes = computed(() => requêtesServeurLocal.value?.length);

const étatServeur = suivre(serveurLocal.suivreÉtatServeur);
</script>
