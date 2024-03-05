<template>
  <selecteur-objet
    :multiples="multiples"
    :originaux="originales"
    :resultats-recherche="résultats"
    :on-travaille="onTravaille"
    :texte-etiquette-recherche="t('nuées.recherche.étiquette')"
    :texte-aucun-résultat="t('nuées.recherche.aucunRésultat')"
    @selectionnee="ids => idsNuéesSélectionnées = ids"
    @requête-modifiee="(r) => requête = r"
  >
    <template #résultat="{résultat, click}">
      <ResultatRechercheNuée
        :résultat="résultat"
        @click="click"
      />
    </template>
    <template #jeton-objet="{id, deselectionner}">
      <carte-nuée :id="id">
        <template #activator="{props: propsActivateur}">
          <jeton-nuée
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
          </jeton-nuée>
        </template>
      </carte-nuée>
    </template>
    <template #nouveau="{nouveau}">
      <nouvelle-nuée @nouveau="nouveau">
        <template #activator="{props: propsActivateur}">
          <v-list-item
            v-bind="propsActivateur"
            :title="t('nuées.nouveau.btn')"
            prepend-icon="mdi-plus" 
          >
          </v-list-item>
        </template>
      </nouvelle-nuée>
    </template>
  </selecteur-objet>
</template>
<script setup lang="ts">
import {ref, watchEffect} from 'vue';

import ResultatRechercheNuée from '/@/components/recherche/RésultatRechercheNuée.vue';
import SelecteurObjet from '/@/components/communs/SélecteurObjet.vue';

import {constellation, rechercher} from '/@/components/utils';

import JetonNuée from './JetonNuée.vue';
import CarteNuée from './CarteNuée.vue';
import NouvelleNuée from './NouvelleNuée.vue';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

defineProps<{multiples: boolean; originales?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsNuées: string[]): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();

// Sélection
const idsNuéesSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsNuéesSélectionnées.value);
});

// Contrôles recherche
const requête = ref();
const {résultats, onTravaille} = rechercher({
  requête: requête,
  fRecherche: constl.recherche.rechercherNuéesSelonTexte,
  clefRequête: 'texte',
});
</script>
