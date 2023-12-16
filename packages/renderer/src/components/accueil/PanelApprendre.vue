<template>
  <v-card
    class="text-start"
    variant="outlined"
    height="175"
  >
    <v-card-item>
      <v-card-title>
        {{ t('accueil.page.apprendre.titre') }}
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-btn class="ma-2">Suivre un tutoriel</v-btn>
      <v-btn
        class="ma-2"
        @click="()=>ouvrirLien(URL_DOCUMENTATION)"
      >
        Lire la documentation
      </v-btn>
    </v-card-text>
  </v-card>
</template>
<script lang="ts" setup>
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import { ouvrirLien } from '/@/utils';
import  {URL_DOCUMENTATION}  from  '/@/consts';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});


</script>
