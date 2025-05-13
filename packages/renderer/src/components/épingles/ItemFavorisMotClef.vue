<template>
  <EpinglerMotClef :id-mot-clef="epingle.idObjet">
    <template #activateur="{props: propsActivateurCarteÉpingle}">
      <v-list-item v-bind="propsActivateurCarteÉpingle">
        <template #prepend>
          <v-icon>{{ icôneTypeItem }}</v-icon>
        </template>
        <v-list-item-title>
          {{ nomTraduit || t('motClefs.sansNom') }}
          <lien-objet :id="epingle.idObjet" />
          <carte-mot-clef :id="epingle.idObjet">
            <template #activateur="{props: propsActivateurCarte}">
              <v-btn
                v-bind="propsActivateurCarte"
                icon="mdi-dots-horizontal"
                size="small"
                variant="flat"
              />
            </template>
          </carte-mot-clef>
        </v-list-item-title>
        <jeton-part-epingle
          icone="mdi-save-outline"
          :dispositifs="props.epingle.épingle.base"
          :statut="statut"
          indice="épingler.indicesJetons.motClef"
        >
          {{ t('épingler.jetons.motClef') }}
        </jeton-part-epingle>
      </v-list-item>
    </template>
  </EpinglerMotClef>
</template>

<script setup lang="ts">
import type {favoris} from '@constl/ipa';
import {suivre} from '@constl/vue';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref, watchEffect} from 'vue';
import LienObjet from '../communs/LienObjet.vue';
import CarteMotClef from '../motsClefs/CarteMotClef.vue';
import {icôneObjet, utiliserConstellation} from '../utils';
import JetonPartEpingle from './JetonPartÉpingle.vue';
import EpinglerMotClef from './ÉpinglerMotClef.vue';

const props = defineProps<{epingle: favoris.ÉpingleFavorisAvecId<favoris.ÉpingleMotClef>}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Noms objet
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {
  idMotClef: computed(() => props.epingle.idObjet),
});
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
