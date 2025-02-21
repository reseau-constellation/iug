<template>
  <SelecteurBd
    v-if="!idBd"
    :multiples="false"
    @selectionnee="bds => (bdChoisie = bds[0])"
  />
  <v-expand-transition>
    <v-select
      v-show="bdFinale"
      v-model="idTableauSélectionné"
      class="mt-4"
      :loading="!tableaux"
      :disabled="!tableaux"
      :items="tableaux"
      :label="t('tableaux.sélection.étiquette')"
      item-value="id"
      variant="outlined"
    >
      <template #selection="{item}">
        <jeton-tableau :id="item.value" />
      </template>
      <template #item="{item, props: propsItem}">
        <item-tableau
          v-bind="Object.fromEntries(Object.entries(propsItem).filter(([c, v]) => c !== 'title'))"
          :id="item.value"
        />
      </template>
    </v-select>
  </v-expand-transition>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed, ref, watch, watchEffect} from 'vue';

import ItemTableau from './ItemTableau.vue';
import JetonTableau from './JetonTableau.vue';
import SelecteurBd from '/@/components/bds/SélecteurBd.vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../utils';

const props = defineProps<{idBd?: string}>();
const émettre = defineEmits<{
  (é: 'selectionne', idTableau?: string): void;
}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Bd
const bdChoisie = ref<string>();
const bdFinale = computed(() => bdChoisie.value || props.idBd);

// Tableaux
const tableaux = suivre(constl.bds.suivreTableauxBd, {
  idBd: bdFinale,
});

// Contrôles
const idTableauSélectionné = ref<string>();
watchEffect(() => {
  émettre('selectionne', idTableauSélectionné.value);
});

watch(bdFinale, () => (idTableauSélectionné.value = undefined));
</script>
