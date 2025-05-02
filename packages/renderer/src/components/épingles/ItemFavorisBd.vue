<template>
  <EpinglerBd :id-bd="epingle.idObjet">
    <template #activator="{props: propsActivateurCarteÉpingle}">
      <v-list-item v-bind="propsActivateurCarteÉpingle">
        <template #prepend>
          <v-icon>{{ icôneTypeItem }}</v-icon>
        </template>
        <v-list-item-title>
          {{ nomTraduit || t('bds.sansNom') }}
          <lien-objet :id="epingle.idObjet" />
          <carte-bd :id="epingle.idObjet">
            <template #activator="{props: propsActivateurCarte}">
              <v-btn
                v-bind="propsActivateurCarte"
                icon="mdi-dots-horizontal"
                size="small"
                variant="flat"
              />
            </template>
          </carte-bd>
        </v-list-item-title>
        <jeton-part-epingle
          class="me-1"
          icone="mdi-content-save-outline"
          :dispositifs="props.epingle.épingle.base"
          :statut="statutÉpingle?.base"
          indice="épingler.indicesJetons.bd"
        >
          {{ t('épingler.jetons.bd') }}
        </jeton-part-epingle>
        <jeton-part-epingle
          class="mx-1"
          icone="mdi-table-multiple"
          :dispositifs="props.epingle.épingle.données.tableaux"
          :statut="statutÉpingle?.données?.tableaux"
          indice="épingler.indicesJetons.données"
        >
          {{ t('épingler.jetons.données') }}
        </jeton-part-epingle>
        <jeton-part-epingle
          class="mx-1"
          icone="mdi-image-multiple-outline"
          :dispositifs="props.epingle.épingle.données.fichiers"
          :statut="statutÉpingle?.données?.fichiers"
          indice="épingler.indicesJetons.documents"
        >
          {{ t('épingler.jetons.documents') }}
        </jeton-part-epingle>
      </v-list-item>
    </template>
  </EpinglerBd>
</template>

<script setup lang="ts">
import type {favoris} from '@constl/ipa';
import {suivre} from '@constl/vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref, watchEffect} from 'vue';
import LienObjet from '../communs/LienObjet.vue';
import {icôneObjet, utiliserConstellation} from '../utils';
import JetonPartEpingle from './JetonPartÉpingle.vue';
import EpinglerBd from './ÉpinglerBd.vue';
import CarteBd from '/@/components/bds/CarteBd.vue';

const props = defineProps<{epingle: favoris.ÉpingleFavorisAvecId<favoris.ÉpingleBd>}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Noms objet
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {
  idMotClef: computed(() => props.epingle.idObjet),
});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Type objet
const icôneTypeItem = icôneObjet('bd');

// Statut sur ce dispositif
const statutÉpingle = ref<favoris.BooléenniserPropriétés<favoris.ÉpingleBd>>();
watchEffect(async () => {
  statutÉpingle.value = await constl.favoris.résoudreÉpinglesSurDispositif({
    épingle: props.epingle.épingle,
  });
});
</script>
