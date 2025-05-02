<template>
  <EpinglerProjet :id-projet="epingle.idObjet">
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
              {{ nomTraduit || t('projets.sansNom') }}
              <lien-objet :id="epingle.idObjet" />
              <carte-projet :id="epingle.idObjet">
                <template #activator="{props: propsActivateurCarte}">
                  <v-btn
                    v-bind="propsActivateurCarte"
                    icon="mdi-dots-horizontal"
                    size="small"
                    variant="flat"
                  />
                </template>
              </carte-projet>
            </v-list-item-title>
            <jeton-part-epingle
              icone="mdi-save-outline"
              :dispositifs="props.epingle.épingle.base"
              :statut="statutÉpingle?.base"
              indice="épingler.indicesJetons.projet"
            >
              {{ t('épingler.jetons.projet') }}
            </jeton-part-epingle>
            <jeton-part-epingle
              icone="mdi-table-multiple"
              :dispositifs="props.epingle.épingle.bds.base"
              :statut="statutÉpingle?.bds?.base"
              indice="épingler.indicesJetons.bds"
            >
              {{ t('épingler.jetons.bds') }}
            </jeton-part-epingle>
            <jeton-part-epingle
              icone="mdi-database"
              :dispositifs="props.epingle.épingle.bds.données.tableaux"
              :statut="statutÉpingle?.bds?.données?.tableaux"
              indice="épingler.indicesJetons.données"
            >
              {{ t('épingler.jetons.données') }}
            </jeton-part-epingle>
            <jeton-part-epingle
              icone="mdi-image-multiple-outline"
              :dispositifs="props.epingle.épingle.bds.données.fichiers"
              :statut="statutÉpingle?.bds?.données?.fichiers"
              indice="épingler.indicesJetons.documents"
            >
              {{ t('épingler.jetons.documents') }}
            </jeton-part-epingle>
          </v-list-item>
        </template>
      </v-tooltip>
    </template>
  </EpinglerProjet>
</template>

<script setup lang="ts">
import type {favoris} from '@constl/ipa';
import {suivre} from '@constl/vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref, watchEffect} from 'vue';
import LienObjet from '../communs/LienObjet.vue';
import {icôneObjet, utiliserConstellation} from '../utils';
import JetonPartEpingle from './JetonPartÉpingle.vue';
import EpinglerProjet from './ÉpinglerProjet.vue';
import CarteProjet from '../projets/CarteProjet.vue';

const props = defineProps<{epingle: favoris.ÉpingleFavorisAvecId<favoris.ÉpingleProjet>}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Noms objet
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: props.epingle.idObjet});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

// Type objet
const icôneTypeItem = icôneObjet('projet');

// Statut sur ce dispositif
const statutÉpingle = ref<favoris.BooléenniserPropriétés<favoris.ÉpingleProjet>>();
watchEffect(async () => {
  statutÉpingle.value = await constl.favoris.résoudreÉpinglesSurDispositif({
    épingle: props.epingle.épingle,
  });
});
</script>
