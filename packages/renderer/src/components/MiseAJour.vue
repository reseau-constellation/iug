<template>
  <v-alert
    type="success"
    variant="outlined"
    closable
  >
    {{
      t('avertissements.miseÀJour.texte', {
        versionCourante: versionAppliFormattée,
        nouvelleVersion: nouvelleVersionFormattée,
      })
    }}
    <v-btn
      class="mx-2 my-2"
      variant="outlined"
      color="primary"
      @click="ouvrirLien(urlTéléchargement)"
    >
      {{ t('avertissements.miseÀJour.télécharcher') }}
      <v-icon end>mdi-download</v-icon>
    </v-btn>
  </v-alert>
</template>

<script setup lang="ts">
import {onMounted, ref, computed} from 'vue';

import {ouvrirLien} from '/@/utils';
import {URL_TÉLÉCHARGEMENTS} from '/@/consts';
import {கிளிமூக்கை_பயன்படுத்து, எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const {பதிப்பை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();


const VERSION_APPLI = import.meta.env.VITE_APP_VERSION;

const versionAppliFormattée = பதிப்பை_வடிவூட்டு(VERSION_APPLI);

const versionPlusRécente = ref<string>();
const nouvelleVersionFormattée = computed(() => {
  if (versionPlusRécente.value) return பதிப்பை_வடிவூட்டு(versionPlusRécente.value);
  return undefined;
});

const urlTéléchargement = ref(URL_TÉLÉCHARGEMENTS);

onMounted(async () => {
  
});
</script>
