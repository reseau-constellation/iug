<template>
  <EpinglerNuee :id-nuee="epingle.idObjet">
    <template #activateur="{props: propsActivateurCarteÉpingle}">
      <v-list-item v-bind="propsActivateurCarteÉpingle">
        <template #prepend>
          <v-icon>{{ icôneTypeItem }}</v-icon>
        </template>
        <v-list-item-title>
          {{ nomTraduit || t('nuées.sansNom') }}
          <lien-objet :id="epingle.idObjet" />
          <carte-nuee :id="epingle.idObjet">
            <template #activateur="{props: propsActivateurCarte}">
              <v-btn
                v-bind="propsActivateurCarte"
                icon="mdi-dots-horizontal"
                size="small"
                variant="flat"
              />
            </template>
          </carte-nuee>
        </v-list-item-title>
        <jeton-part-epingle
          class="me-1"
          icone="mdi-save-outline"
          :dispositifs="props.epingle.épingle.base"
          :statut="statutÉpingle?.base"
          indice="épingler.indicesJetons.nuée"
        >
          {{ t('épingler.jetons.nuée') }}
        </jeton-part-epingle>
        <jeton-part-epingle
          class="me-1"
          icone="mdi-database"
          :dispositifs="props.epingle.épingle.données.base"
          :statut="statutÉpingle?.données?.base"
          indice="épingler.indicesJetons.bds"
        >
          {{ t('épingler.jetons.bds') }}
        </jeton-part-epingle>
        <jeton-part-epingle
          class="me-1"
          icone="mdi-table-multiple"
          :dispositifs="props.epingle.épingle.données.données.tableaux"
          :statut="statutÉpingle?.données?.données?.tableaux"
          indice="épingler.indicesJetons.données"
        >
          {{ t('épingler.jetons.données') }}
        </jeton-part-epingle>
        <jeton-part-epingle
          class="me-1"
          icone="mdi-image-multiple-outline"
          :dispositifs="props.epingle.épingle.données.données.fichiers"
          :statut="statutÉpingle?.données?.données?.fichiers"
          indice="épingler.indicesJetons.documents"
        >
          {{ t('épingler.jetons.documents') }}
        </jeton-part-epingle>
      </v-list-item>
    </template>
  </EpinglerNuee>
</template>

<script setup lang="ts">
import type {favoris} from '@constl/ipa';
import {suivre} from '@constl/vue';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref, watchEffect} from 'vue';
import LienObjet from '../communs/LienObjet.vue';
import CarteNuee from '../nuées/CarteNuée.vue';
import {icôneObjet, utiliserConstellation} from '../utils';
import JetonPartEpingle from './JetonPartÉpingle.vue';
import EpinglerNuee from './ÉpinglerNuée.vue';

const props = defineProps<{epingle: favoris.ÉpingleFavorisAvecId<favoris.ÉpingleNuée>}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Noms objet
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {
  idMotClef: computed(() => props.epingle.idObjet),
});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Type objet
const icôneTypeItem = icôneObjet('nuée');

// Statut sur ce dispositif
const statutÉpingle = ref<favoris.BooléenniserPropriétés<favoris.ÉpingleNuée>>();
watchEffect(async () => {
  statutÉpingle.value = await constl.favoris.résoudreÉpinglesSurDispositif({
    épingle: props.epingle.épingle,
  });
});
</script>
