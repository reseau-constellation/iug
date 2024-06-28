<template>
  <v-list-item>
    <template #prepend>
      <ImageProfil :id="compte" />
    </template>
    <v-list-item-title>
      {{ nomTraduit || t('communs.anonyme') }}
      <jeton-confiance
        :id="compte"
        style-jeton="icône"
      />
    </v-list-item-title>
    <v-list-item-subtitle>
      {{
        t('pages.compte.connexions.dispositifs', {
          nDispositifs: dispositifs.length,
          nDispositifsEnLigne,
        })
      }}
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script setup lang="ts">
import type {réseau} from '@constl/ipa';

import {computed} from 'vue';
import {utiliserConstellation, suivre} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import ImageProfil from '/@/components/communs/ImageProfil.vue';
import JetonConfiance from '/@/components/membres/JetonConfiance.vue';

const props = defineProps<{compte: string; dispositifs: réseau.statutDispositif[]}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Nom d'utilisatrice
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.profil.suivreNoms, {idCompte: props.compte});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Nombre de dispositifs
const nDispositifsEnLigne = computed(() => {
  return props.dispositifs.filter(d => !d.vuÀ).length;
});
</script>
