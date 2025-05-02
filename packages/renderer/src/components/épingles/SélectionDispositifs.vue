<template>
  <v-select
    v-model="sélection"
    v-bind="$attrs"
    :items="optionsÉpingles"
    :prepend-inner-icon="optionsÉpingles.find(o => o.valeur === sélection)?.icône"
    item-value="valeur"
    variant="plain"
  >
    <template #selection="{item}">
      {{ t(item.raw.titre) }}
    </template>
    <template #item="{item, props: propsItem}">
      <v-list-item
        v-bind="propsItem"
        :title="t(item.raw.titre)"
        :subtitle="t(item.raw.sousTitre)"
        :prepend-icon="item.raw.icône"
      />
    </template>
  </v-select>
  <v-expand-transition>
    <v-autocomplete
      v-show="sélection === 'SPÉCIFIQUES'"
      v-model="spécifiques"
      :items="dispositifs"
      :label="t('épingler.indiceSélectionnerDispositif')"
      chips
      closable-chips
      density="compact"
      variant="outlined"
      multiple
    >
      <template #chip="{props: propsActivateur, item}">
        <jeton-dispositif
          v-bind="propsActivateur"
          :id-dispositif="item.title"
        />
      </template>

      <template #item="{props: propsActivateur, item}">
        <item-dispositif
          v-bind="propsActivateur"
          :id-dispositif="item.title"
        />
      </template>

      <template #selection="{item}">
        {{ t(item.title) }}
      </template>
    </v-autocomplete>
  </v-expand-transition>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../utils';
import {utiliserOptionsÉpingles} from './utils';
import ItemDispositif from '/@/components/membres/ItemDispositif.vue';
import JetonDispositif from '/@/components/membres/JetonDispositif.vue';

const sélection = defineModel<'AUCUN' | 'TOUS' | 'INSTALLÉ' | 'SPÉCIFIQUES' | undefined>(
  'selection',
);
const spécifiques = defineModel<string[]>('specifiques');

const constl = utiliserConstellation();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const optionsÉpingles = utiliserOptionsÉpingles();

// Dispositifs
const dispositifs = suivre(constl.suivreDispositifs);
</script>
