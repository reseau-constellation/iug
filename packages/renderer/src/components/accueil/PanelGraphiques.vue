<template>
  <v-row>
    <v-col cols="12">
      <v-card
        class="text-start"
        variant="outlined"
        height="600"
      >
        <v-card-item>
          <v-card-title>
            {{ t('accueil.page.graphiques.titre') }}
          </v-card-title>
        </v-card-item>
        <v-card-text>
          Aucune historique Nombre de bases de données Nombre de projets Nombre de nuées Nombre de
          réplications de mes données Nombre de connaissances
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
</script>
