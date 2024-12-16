<template>
  <EpinglerNuee :id-nuee="epingle.idObjet">
    <template #activator="{props: propsActivateurCarteÉpingle}">
      <v-tooltip
        open-delay="200"
        location="bottom"
      >
        <template #activator="{props: propsActivateurIndice}">
          <v-list-item v-bind="{...propsActivateurCarteÉpingle, ...propsActivateurIndice}">
            <template #prepend>
              <v-icon>{{ icôneTypeItem }}</v-icon>
            </template>
            <v-list-item-title>
              {{ nomTraduit || t('nuées.sansNom') }}
              <lien-objet :id="epingle.idObjet" />
            </v-list-item-title>
            <jeton-part-epingle
              icone="mdi-save-outline"
              :dispositifs="props.epingle.épingle.base"
              :statut="statutÉpingle?.base"
            >
              Nuée
            </jeton-part-epingle>
            <jeton-part-epingle
              icone="mdi-database"
              :dispositifs="props.epingle.épingle.données.base"
              :statut="statutÉpingle?.données?.base"
            >
              Bases de données
            </jeton-part-epingle>
            <jeton-part-epingle
              icone="mdi-table-multiple"
              :dispositifs="props.epingle.épingle.données.données.tableaux"
              :statut="statutÉpingle?.données?.données?.tableaux"
            >
              Données
            </jeton-part-epingle>
            <jeton-part-epingle
              icone="mdi-image-multiple-outline"
              :dispositifs="props.epingle.épingle.données.données.fichiers"
              :statut="statutÉpingle?.données?.données?.fichiers"
            >
              Documents
            </jeton-part-epingle>
          </v-list-item>
        </template>
      </v-tooltip>
    </template>
  </EpinglerNuee>
</template>
  
<script setup lang="ts">
import type {favoris} from '@constl/ipa';
import {suivre} from '@constl/vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import LienObjet from '../communs/LienObjet.vue';
import {icôneObjet, utiliserConstellation} from '../utils';
import EpinglerNuee from './ÉpinglerNuée.vue';
import JetonPartEpingle from './JetonPartÉpingle.vue';
import { ref, watchEffect } from 'vue';
  
const props = defineProps<{epingle: favoris.ÉpingleFavorisAvecId<favoris.ÉpingleNuée>}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Noms objet
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: props.epingle.idObjet});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Type objet
const icôneTypeItem = icôneObjet('nuée');

// Statut sur ce dispositif
const statutÉpingle = ref<favoris.BooléenniserPropriétés<favoris.ÉpingleNuée>>();
watchEffect(async () => {
  statutÉpingle.value = await constl.favoris.résoudreÉpinglesSurDispositif({épingle: props.epingle.épingle});
});
</script>
  