<template>
  <v-card
    class="text-start"
    style="height: 100%"
  >
    <v-card-item>
      <v-card-title>
        <v-avatar>
          <v-icon>{{ icôneTypeItem }}</v-icon>
        </v-avatar>{{ nomTraduit || t('communs.baseCarteObjet.sansNom') }}
      </v-card-title>
      <v-card-subtitle>{{ texteVuIlYA }}</v-card-subtitle>
    </v-card-item>
    <v-card-text class="align-center text-center">
      <image-editable
        class="my-0"
        :src-image="srcImg"
        :img-defaut="imgDéfaut"
        :editable="false"
        :taille-avatar="mdAndUp ? 175 : 100"
        :max-taille-image="300"
      />

      <v-btn
        class="mx-auto"
        color="primary"
        variant="text"
        append-icon="mdi-open-in-new"
        @click="$router.push(encodeURI(`/données/${typeObjet}/${encodeURIComponent(id)}`))"
      >
        ouvrir
      </v-btn>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
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
import {computed} from 'vue';
import { useDisplay } from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, icôneObjet, suivre} from '../utils';
import {utiliserIlYA} from '../membres/utils';
import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';
import ImageEditable from '../communs/ImageEditable.vue';
import { utiliserImagesDéco } from '/@/composables/images';

const props = defineProps<{id: string; a: number}>();

const { mdAndUp } = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {obtImageDéco} = utiliserImagesDéco();

const constl = constellation();

// Solution temporaire pour Constellation qui ne sait pas de quel type est l'objet
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: props.id}, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

const historiqueDocuments = utiliserHistoriqueDocuments();

const typeObjet = suivre(constl.suivreTypeObjet, {idObjet: props.id});
const icôneTypeItem = computed(() => {
  const icône = icôneObjet(typeObjet.value);
  return icône || 'mdi-file-document-outline';
});

// À faire : différencier par type d'objet
const image = suivre(constl.bds.suivreImage, {idBd: props.id});
const srcImg = computed(() => {
  if (image.value) {
    return URL.createObjectURL(new Blob([image.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
const imgDéfaut = obtImageDéco('logoBD');

const {texte: texteVuIlYA} = utiliserIlYA({vuÀ: props.a, t});

const effacerDeLHistorique = () => historiqueDocuments.effacer({id: props.id});
</script>
