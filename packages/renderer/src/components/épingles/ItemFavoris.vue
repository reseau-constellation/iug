<template>
  <CarteEpingler :id="epingle.idObjet">
    <template #activator="{props: propsActivateurCarteÉpingle}">
      <v-tooltip
        open-delay="200"
        location="bottom"
      >
        <template #activator="{props: propsActivateurIndice}">
          <v-list-item
            v-bind="{...propsActivateurCarteÉpingle, ...propsActivateurIndice}"
          >
            <template #prepend>
              <v-icon>{{ icôneTypeItem }}</v-icon>
            </template>
            <v-list-item-title>
              {{ nomTraduit || sansNom }}
              <lien-objet :id="epingle.idObjet" />
            </v-list-item-title>
            <template #append>
              <v-btn
                class="my-2"
                size="x-small"
                variant="outlined"
                icon="mdi-open-in-new"
                @click="$router.push(encodeURI(`/données/${typeObjet}/${encodeURIComponent(epingle.idObjet)}`))"
              >
              </v-btn>
            </template>
          </v-list-item>
        </template>
      </v-tooltip>
    </template>
  </CarteEpingler>
</template>

<script setup lang="ts">
import type {favoris} from '@constl/ipa';
import {computed} from 'vue';

import {மொழிகளைப்_பயன்படுத்து, கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, icôneObjet, suivre} from '../utils';
import CarteEpingler from './CarteÉpingler.vue';
import LienObjet from '../communs/LienObjet.vue';

const props = defineProps<{epingle: favoris.ÉlémentFavorisAvecObjet}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const constl = constellation();

// Noms objet
// Solution temporaire pour Constellation qui ne sait pas de quel type est l'objet
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: props.epingle.idObjet}, {});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
const sansNom = computed(()=>{
  switch (typeObjet.value) {
    case 'bd':
      return t('bds.sansNom');
    case 'motClef':
      return t('motsClefs.sansNom');
    case 'nuée':
      return t('nuées.sansNom');
    case 'variable':
      return t('variables.sansNom');
    case 'projet':
      return t('projets.sansNom');
    default:
      return t('baseCarteObjet.sansNom');
  }
});

// Type objet
const typeObjet = suivre(constl.suivreTypeObjet, {idObjet: props.epingle.idObjet});
const icôneTypeItem = computed(() => {
  return icôneObjet(typeObjet.value) || 'mdi-pin-outline';
});

</script>
