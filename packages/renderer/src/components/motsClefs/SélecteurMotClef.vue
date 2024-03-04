<template>
  <selecteur-objet
    :multiples="multiples"
    :interdites="interdits"
    :resultats-recherche="résultats"
    :on-travaille="onTravaille"
    :texte-etiquette-recherche="t('motsClefs.recherche.étiquette')"
    :texte-aucun-résultat="t('motsClefs.recherche.aucunRésultat')"
    @selectionnee="ids => idsMotsClefsSélectionnés = ids"
    @requête-modifiee="(r) => requête = r"
  >
    <template #résultat="{résultat, click}">
      <ResultatRechercheMotClef
        :résultat="résultat"
        @click="click"
      />
    </template>
    <template #jeton-objet="{id, deselectionner}">
      <carte-mot-clef :id="id">
        <template #activator="{props: propsActivateur}">
          <jeton-mot-clef
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
          </jeton-mot-clef>
        </template>
      </carte-mot-clef>
    </template>
    <template #nouveau="{nouveau}">
      <nouveau-mot-clef @nouveau="nouveau">
        <template #activator="{props: propsActivateur}">
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
import {ref, watchEffect} from 'vue';

import ResultatRechercheMotClef from '/@/components/recherche/RésultatRechercheMotClef.vue';
import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';

import {constellation, rechercher} from '/@/components/utils';

import NouveauMotClef from './NouveauMotClef.vue';
import JetonMotClef from './JetonMotClef.vue';
import CarteMotClef from './CarteMotClef.vue';

import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

defineProps<{multiples: boolean; interdits?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsBds: string[]): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();

// Sélection
const idsMotsClefsSélectionnés = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsMotsClefsSélectionnés.value);
});

// Contrôles recherche
const requête = ref('');
const {résultats, onTravaille} = rechercher({
  requête: requête,
  fRecherche: constl.recherche.rechercherMotsClefsSelonTexte,
  clefRequête: 'texte',
});

</script>
