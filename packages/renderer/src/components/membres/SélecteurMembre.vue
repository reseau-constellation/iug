<template>
  <selecteur-objet
    :multiples="multiples"
    :originaux="originales"
    :interdits="interdits"
    :resultats-recherche="résultats"
    :on-travaille="onTravaille"
    :texte-etiquette-recherche="t('membres.recherche.étiquette')"
    :texte-aucun-résultat="t('membres.recherche.aucunRésultat')"
    @selectionnee="ids => (idsProfilsSélectionnées = ids)"
    @requete-modifiee="r => (requête = r)"
  >
    <template #résultat="{résultat, click}">
      <ResultatRechercheProfil
        :résultat="résultat"
        @click="click"
      />
    </template>
    <template #jeton-objet="{id, deselectionner}">
      <carte-membre :id="id">
        <template #activator="{props: propsActivateur}">
          <jeton-membre
            :compte="id"
            v-bind="{props: propsActivateur}"
          >
            <v-icon
              class="ms-2"
              icon="mdi-close"
              size="small"
              variant="flat"
              @click="() => deselectionner({id})"
            />
          </jeton-membre>
        </template>
      </carte-membre>
    </template>
  </selecteur-objet>
</template>
<script setup lang="ts">
import {rechercher} from '@constl/vue';
import {ref, watchEffect} from 'vue';

import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';
import ResultatRechercheProfil from '/@/components/recherche/RésultatRechercheProfil.vue';

import {utiliserConstellation} from '/@/components/utils';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import CarteMembre from './CarteMembre.vue';
import JetonMembre from './JetonMembre.vue';

defineProps<{multiples: boolean; originales?: string[]; interdits?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsProfils: string[]): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Sélection
const idsProfilsSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsProfilsSélectionnées.value);
});

// Contrôles recherche
const requête = ref('');
const {résultats, onTravaille} = rechercher(constl.recherche.rechercherProfilsSelonTexte, {
  texte: requête,
});
</script>
