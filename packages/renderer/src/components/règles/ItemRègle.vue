<template>
  <v-list-item>
    <v-list-item-title>
      {{ t(typeRègle) }}
    </v-list-item-title>
    <v-list-item-subtitle>
      {{ t(infoRègle) }}
    </v-list-item-subtitle>
    <v-list-item-action>
      <v-btn
        v-if="effacable"
        icon="mdi-delete"
        color="error"
        variant="outlined"
        @click="() => émettre('effacer')"
      />
    </v-list-item-action>
  </v-list-item>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';
import {computed} from 'vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{regle: valid.règleVariableAvecId; effacable?: boolean}>();
const émettre = defineEmits<{
  (é: 'effacer'): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Titre
const typeRègle = computed(() => {
  switch (props.regle.règle.typeRègle) {
    case 'catégorie':
      return 'règles.types.catégorie';
    case 'bornes':
      return 'règles.types.bornes';
    case 'existe':
      return 'règles.types.existe';
    case 'valeurCatégorique':
      return 'règles.types.valeurCatégorique';
    default:
      return '';
  }
});

// Info
const infoRègle = computed(() => {
  const {règle} = props.regle;
  switch (règle.typeRègle) {
    case 'catégorie':
      return t('règles.infos.catégorie', {
        categorie: t(`variables.catégories.${règle.détails.catégorie.catégorie}`),
      });
    case 'bornes':
      return t('règles.infos.bornes', {val: règle.détails.val, op: règle.détails.op});
    case 'existe':
      return 'règles.infos.existe';
    case 'valeurCatégorique':
      return 'règles.infos.valeurCatégorique';
    default:
      return '';
  }
});
</script>
