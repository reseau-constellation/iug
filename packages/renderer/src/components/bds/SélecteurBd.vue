<template>
  <selecteur-objet
    :multiples="multiples"
    :interdites="interdites"
    :resultats-recherche="résultats"
    :on-travaille="onTravaille"
    :texte-etiquette-recherche="t('bds.recherche.étiquette')"
    :texte-aucun-résultat="t('bds.recherche.aucunRésultat')"
    :texte-nouveau="t('bds.nouveau.btn')"
    @selectionnee="ids => idsBdsSélectionnées = ids"
    @requete-modifiee="(r) => requête = r"
  >
    <template #resultat="{resultat, click}">
      <ResultatRechercheBd
        :resultat="resultat"
        @click="click"
      />
    </template>
    <template #jeton-objet="{id}">
      <jeton-bd :id="id" />
    </template>
    <template #carte-objet="{id}">
      <carte-bd :id="id" />
    </template>
    <template #dialogue-nouveau>
      <nouvelle-bd />
    </template>
  </selecteur-objet>
</template>
<script setup lang="ts">
import {ref, watchEffect} from 'vue';

import ResultatRechercheBd from '/@/components/recherche/RésultatRechercheBd.vue';
import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';

import {constellation, rechercher} from '/@/components/utils';

import JetonBd from './JetonBd.vue';
import CarteBd from './CarteBd.vue';
import NouvelleBd from './NouvelleBd.vue';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

defineProps<{multiples: boolean; interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsBds: string[]): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();

// Sélection
const idsBdsSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsBdsSélectionnées.value);
});

// Contrôles recherche
const requête = ref();
const {résultats, onTravaille} = rechercher({
  requète: requête,
  fRecherche: constl.recherche.rechercherBdsSelonTexte,
  clefRequète: 'texte',
});
</script>
