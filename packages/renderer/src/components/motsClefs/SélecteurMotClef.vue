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
      >
        <template #prepend-inner>
          <carte-mot-clef 
            v-if="!multiples && idsMotsClefsSélectionnées.length"
            :id="idsMotsClefsSélectionnées[0]"
          >
            <jeton-mot-clef
              :id="idsMotsClefsSélectionnées[0]"
            >
              <v-icon
                class="ms-2"
                icon="mdi-close"
                size="small"
                variant="flat"
                @click="() => désélectionner({id: idsMotsClefsSélectionnées[0]})"
              />
            </jeton-mot-clef>
          </carte-mot-clef>
        </template>
      </v-text-field>
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
      <v-expand-transition>
        <v-list-item
          v-show="!onTravaille && !résultatsPermisRecherche?.length"
          class="text-h6 text-center text-disabled"
        >
          {{ t('motsClefs.recherche.aucunRésultat') }}
        </v-list-item>
      </v-expand-transition>
      <ResultatRechercheMotClef
        v-for="r in résultatsPermisRecherche"
        :key="r.id"
        :résultat="r"
        @click="() => sélectionner({id: r.id})"
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
  <v-list
    v-if="multiples"
    class="mt-4"
  >
    <carte-mot-clef 
      v-for="motClef in idsMotsClefsSélectionnées"
      :id="motClef"
      :key="motClef"
    >
      <jeton-mot-clef
        :id="motClef"
      >
        <v-icon
          class="ms-2"
          icon="mdi-close"
          size="small"
          variant="flat"
          @click="() => désélectionner({id: motClef})"
        />
      </jeton-mot-clef>
    </carte-mot-clef>
  </v-list>
</template>
<script setup lang="ts">
import {computed, watchEffect, ref} from 'vue';

import ResultatRechercheMotClef from '/@/components/recherche/RésultatRechercheMotClef.vue';
import {constellation, rechercher} from '/@/components/utils';

import NouveauMotClef from './NouveauMotClef.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import JetonMotClef from './JetonMotClef.vue';
import CarteMotClef from './CarteMotClef.vue';

const props = defineProps<{multiples: boolean; interdits?: string[]}>();
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
  return résultatsRecherche.value?.filter(r => !(props.interdits || []).includes(r.id));
});

const sélectionner = ({id}: {id: string}) => {
  if (props.multiples) {
    idsMotsClefsSélectionnées.value = [...idsMotsClefsSélectionnées.value, id];
  } else {
    idsMotsClefsSélectionnées.value = [id];
  }
  requète.value = '';
};
const désélectionner = ({id}: {id: string}) => {
  idsMotsClefsSélectionnées.value = idsMotsClefsSélectionnées.value.filter(mc => mc !== id);
};
</script>
