<template>
  <v-card class="text-start">
    <v-card-item>
      <v-card-title
        v-if="noms"
        :class="{'text-disabled': !nomTraduit}"
      >
        {{ nomTraduit || t(sansNom) }}
        <v-avatar>
          <v-icon>{{ icôneTypeItem }}</v-icon>
        </v-avatar>
      </v-card-title>
      <v-card-title v-else>
        <v-skeleton-loader type="text" />
      </v-card-title>
      <v-card-subtitle>{{ texteVuIlYA }}</v-card-subtitle>
    </v-card-item>
    <v-card-text class="align-center text-center">
      <v-avatar
        class="mb-3"
        :size="mdAndUp ? 125 : 100"
      >
        <v-img
          class="my-0"
          :src="srcImg || imgDéfaut"
        />
      </v-avatar>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        class="mx-auto"
        color="primary"
        variant="text"
        append-icon="mdi-open-in-new"
        :disabled="!typeObjet"
        @click="$router.push(encodeURI(`/données/${typeObjet}/${encodeURIComponent(id)}`))"
      >
        {{ t('communs.ouvrir') }}
      </v-btn>
      <v-btn
        append-icon="mdi-close"
        @click="() => effacerDeLHistorique()"
      >
        {{ t('communs.effacer') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {useDisplay} from 'vuetify';

import {utiliserIlYA} from '../membres/utils';
import {icôneObjet, utiliserConstellation} from '../utils';
import {utiliserImagesDéco} from '/@/composables/images';
import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';
import { sourceImage } from '/@/utils';

const props = defineProps<{id: string; a: number}>();

const {mdAndUp} = useDisplay();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {obtImageDéco} = utiliserImagesDéco();

const constl = utiliserConstellation();

// Solution temporaire pour Constellation qui ne sait pas de quel type est l'objet
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: computed(() => props.id)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

const historiqueDocuments = utiliserHistoriqueDocuments();

const typeObjet = suivre(constl.suivreTypeObjet, {idObjet: computed(() => props.id)});
const icôneTypeItem = computed(() => {
  const icône = icôneObjet(typeObjet.value);
  return icône || 'mdi-file-document-outline';
});
const sansNom = computed(() => {
  return typeObjet.value ? `${typeObjet.value}s.sansNom` : 'communs.sansNom';
});

// À faire : différencier par type d'objet
const image = suivre(constl.bds.suivreImage, {idBd: computed(() => props.id)});
const srcImg = sourceImage(image);

const imgDéfaut = obtImageDéco('logoBD');

const {texte: texteVuIlYA} = utiliserIlYA({vuÀ: computed(() => props.a), t});

const effacerDeLHistorique = () => historiqueDocuments.effacer({id: props.id});
</script>
