<template>
  <EpinglerMotClef :id-mot-clef="epingle.idObjet">
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
              {{ nomTraduit || t('motClefs.sansNom') }}
              <lien-objet :id="epingle.idObjet" />
            </v-list-item-title>
            <jeton-part-epingle
              icone="mdi-save-outline"
              :dispositifs="props.epingle.épingle.base"
              :statut="statut"
            >
              MotClef
            </jeton-part-epingle>
          </v-list-item>
        </template>
      </v-tooltip>
    </template>
  </EpinglerMotClef>
</template>

<script setup lang="ts">
import type {favoris} from '@constl/ipa';
import {suivre} from '@constl/vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref, watchEffect} from 'vue';
import LienObjet from '../communs/LienObjet.vue';
import {icôneObjet, utiliserConstellation} from '../utils';
import JetonPartEpingle from './JetonPartÉpingle.vue';
import EpinglerMotClef from './ÉpinglerMotClef.vue';

const props = defineProps<{epingle: favoris.ÉpingleFavorisAvecId<favoris.ÉpingleMotClef>}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Noms objet
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: props.epingle.idObjet});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Type objet
const icôneTypeItem = icôneObjet('motClef');

// Statut sur ce dispositif
const statut = ref<boolean>();
watchEffect(async () => {
  statut.value = (
    await constl.favoris.résoudreÉpinglesSurDispositif({épingle: props.epingle.épingle})
  ).base;
});
</script>
