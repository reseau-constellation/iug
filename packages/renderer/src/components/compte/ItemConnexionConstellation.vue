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
import {suivre} from '@constl/vue';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {utiliserConstellation} from '/@/components/utils';

import {useNow} from '@vueuse/core';
import ImageProfil from '/@/components/communs/ImageProfil.vue';
import JetonConfiance from '/@/components/membres/JetonConfiance.vue';

const props = defineProps<{compte: string; dispositifs: réseau.statutDispositif[]}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Nom d'utilisatrice
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.profil.suivreNoms, {idCompte: computed(() => props.compte)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Nombre de dispositifs
const maintenant = useNow();
const nDispositifsEnLigne = computed(() => {
  return props.dispositifs.filter(d => !d.vuÀ || maintenant.value.getTime() - d.vuÀ <= 1000 * 10)
    .length;
});
</script>
