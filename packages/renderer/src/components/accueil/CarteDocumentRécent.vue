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
    <v-card-text class="d-flex align-center text-center">
      <v-btn
        class="ma-auto"
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
        effacer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import {computed} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, icôneObjet, écouter} from '../utils';
import {utiliserIlYA} from '../membres/utils';
import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';

const props = defineProps<{id: string; a: number}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const constl = constellation();

// Solution temporaire pour Constellation qui ne sait pas de quel type est l'objet
const noms = écouter(constl.motsClefs.suivreNomsMotClef, {idMotClef: props.id}, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

const historiqueDocuments = utiliserHistoriqueDocuments();

const typeObjet = écouter(constl.suivreTypeObjet, {idObjet: props.id});
const icôneTypeItem = computed(() => {
  const icône = icôneObjet(typeObjet.value);
  return icône || 'mdi-file-document-outline';
});

const {texte: texteVuIlYA} = utiliserIlYA({vuÀ: props.a, t});

const effacerDeLHistorique = () => historiqueDocuments.effacer({id: props.id});
</script>
