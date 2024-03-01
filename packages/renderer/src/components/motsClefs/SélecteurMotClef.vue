<template>
  <v-menu
    location="bottom"
    transition="slide-y-transition"
  >
    <template #activator="{props: propsActivateur}">
      <v-text-field
        v-model="requète"
        v-bind="propsActivateur"
        class="pt-2"
        :label="t('motsClefs.recherche.étiquette')"
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
      />
    </template>
    <v-list>
      <v-progress-linear
        v-show="onTravaille"
        class="mb-3"
        height="1"
        color="primary"
        indeterminate
        absolute
      />
      <v-list-item
        v-show="!onTravaille && !résultatsPermisRecherche?.length"
        class="text-h6 text-center text-disabled"
      >
        {{ t('motsClefs.recherche.aucunRésultat') }}
      </v-list-item>
      <ResultatRechercheMotClef
        v-for="résultat in résultatsPermisRecherche"
        :key="résultat.id"
        :résultat="résultat"
        @click="() => sélectionner({id: résultat.id})"
      />
      <v-divider />
      <NouveauMotClef @nouveau="id => sélectionner(id)">
        <template #activator="{props: propsActivateur}">
          <v-list-item
            v-bind="propsActivateur"
            :title="t('motsClefs.nouveau.btn')"
            prepend-icon="mdi-plus"
          >
          </v-list-item>
        </template>
      </NouveauMotClef>
    </v-list>
  </v-menu>
  <v-list class="mt-4">
    <jeton-mot-clef
      v-for="motClef in idsMotsClefsSélectionnées"
      :id="motClef"
      :key="motClef"
    >
      <v-btn
        class="ms-2"
        icon="mdi-close"
        size="x-small"
        variant="flat"
        @click="() => désélectionner({id: motClef})"
      />
    </jeton-mot-clef>
  </v-list>
</template>
<script setup lang="ts">
import {ref} from 'vue';

import ResultatRechercheMotClef from '/@/components/recherche/RésultatRechercheMotClef.vue';
import {constellation, rechercher} from '/@/components/utils';
import {watchEffect} from 'vue';
import {computed} from 'vue';
import NouveauMotClef from './NouveauMotClef.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import JetonMotClef from './JetonMotClef.vue';

const props = defineProps<{multiples: boolean; interdites?: string[]}>();
const émettre = defineEmits<{
  (é: 'selectionnee', idsMotsClefs: string[]): void;
}>();

const constl = constellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Sélection
const idsMotsClefsSélectionnées = ref<string[]>([]);
watchEffect(() => {
  émettre('selectionnee', idsMotsClefsSélectionnées.value);
});

// Contrôles recherche
const requète = ref('');
const {résultats: résultatsRecherche, onTravaille} = rechercher({
  requète: requète,
  fRecherche: constl.recherche.rechercherMotsClefsSelonTexte,
  clefRequète: 'texte',
});

const résultatsPermisRecherche = computed(() => {
  return résultatsRecherche.value?.filter(r => !(props.interdites || []).includes(r.id));
});

const sélectionner = ({id}: {id: string}) => {
  idsMotsClefsSélectionnées.value = [...idsMotsClefsSélectionnées.value, id];
};
const désélectionner = ({id}: {id: string}) => {
  idsMotsClefsSélectionnées.value = idsMotsClefsSélectionnées.value.filter(mc => mc !== id);
};
</script>
