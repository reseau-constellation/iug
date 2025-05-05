<template>
  <selecteur-objet
    :multiples="multiples"
    :originaux="originaux"
    :resultats-recherche="résultats"
    :on-travaille="onTravaille"
    :texte-etiquette-recherche="t('motsClefs.recherche.étiquette')"
    :texte-aucun-résultat="t('motsClefs.recherche.aucunRésultat')"
    @selectionnee="ids => (idsMotsClefsSélectionnés = ids)"
    @requete-modifiee="r => (requête = r)"
  >
    <template #résultat="{résultat, click}">
      <ResultatRechercheMotClef
        :résultat="résultat"
        @click="click"
      />
    </template>
    <template #jeton-objet="{id, deselectionner}">
      <carte-mot-clef :id="id">
        <template #activateur="{props: propsActivateur}">
          <jeton-mot-clef
            v-bind="{props: propsActivateur}"
            :id="id"
            class="me-1 mb-1"
          >
            <v-icon
              class="ms-2"
              icon="mdi-close"
              size="small"
              variant="flat"
              @click="() => deselectionner({id})"
            />
          </jeton-mot-clef>
        </template>
      </carte-mot-clef>
    </template>
    <template #nouveau="{nouveau}">
      <nouveau-mot-clef @nouveau="nouveau">
        <template #activateur="{props: propsActivateur}">
          <v-list-item
            v-bind="propsActivateur"
            :title="t('motsClefs.nouveau.btn')"
            prepend-icon="mdi-plus"
          >
          </v-list-item>
        </template>
      </nouveau-mot-clef>
    </template>
  </selecteur-objet>
</template>
<script setup lang="ts">
import {rechercher} from '@constl/vue';
import {ref, watchEffect} from 'vue';

import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';
import ResultatRechercheMotClef from '/@/components/recherche/RésultatRechercheMotClef.vue';

import {utiliserConstellation} from '/@/components/utils';

import CarteMotClef from './CarteMotClef.vue';
import JetonMotClef from './JetonMotClef.vue';
import NouveauMotClef from './NouveauMotClef.vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
defineProps<{multiples: boolean; originaux?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsMotsClefs: string[]): void;
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Sélection
const idsMotsClefsSélectionnés = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsMotsClefsSélectionnés.value);
});

// Contrôles recherche
const requête = ref('');
const {résultats, onTravaille} = rechercher(constl.recherche.rechercherMotsClefsSelonTexte, {
  texte: requête,
});
</script>
