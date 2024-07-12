<template>
  <selecteur-objet
    :multiples="multiples"
    :originaux="originales"
    :resultats-recherche="résultats"
    :on-travaille="onTravaille"
    :texte-etiquette-recherche="t('bds.recherche.étiquette')"
    :texte-aucun-résultat="t('bds.recherche.aucunRésultat')"
    @selectionnee="ids => (idsBdsSélectionnées = ids)"
    @requete-modifiee="r => (requête = r)"
  >
    <template #résultat="{résultat, click}">
      <ResultatRechercheBd
        :résultat="résultat"
        @click="click"
      />
    </template>
    <template #jeton-objet="{id, deselectionner}">
      <carte-bd :id="id">
        <template #activator="{props: propsActivateur}">
          <jeton-bd
            :id="id"
            v-bind="{props: propsActivateur}"
          >
            <v-icon
              class="ms-2"
              icon="mdi-close"
              size="small"
              variant="flat"
              @click="() => deselectionner({id})"
            />
          </jeton-bd>
        </template>
      </carte-bd>
    </template>
    <template #nouveau="{nouveau}">
      <nouvelle-bd @nouvelle="nouveau">
        <template #activator="{props: propsActivateur}">
          <v-list-item
            v-bind="propsActivateur"
            :title="t('bds.nouvelle.btn')"
            prepend-icon="mdi-plus"
          >
          </v-list-item>
        </template>
      </nouvelle-bd>
    </template>
  </selecteur-objet>
</template>
<script setup lang="ts">
import {rechercher} from '@constl/vue';
import {ref, watchEffect} from 'vue';

import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';
import ResultatRechercheBd from '/@/components/recherche/RésultatRechercheBd.vue';

import {utiliserConstellation} from '/@/components/utils';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import CarteBd from './CarteBd.vue';
import JetonBd from './JetonBd.vue';
import NouvelleBd from './NouvelleBd.vue';

defineProps<{multiples: boolean; originales?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsBds: string[]): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Sélection
const idsBdsSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsBdsSélectionnées.value);
});

// Contrôles recherche
const requête = ref();
const {résultats, onTravaille} = rechercher(constl.recherche.rechercherBdsSelonTexte, {
  texte: requête,
});
</script>
