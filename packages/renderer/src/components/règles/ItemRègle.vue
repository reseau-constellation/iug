<template>
  <v-list-item>
    <v-list-item-title>
      {{ typeRègle }}
    </v-list-item-title>
    <v-list-item-subtitle>
      {{ infoRègle }}
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
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{regle: valid.règleVariableAvecId; effacable?: boolean}>();
const émettre = defineEmits<{
  (é: 'effacer'): void;
}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Titre
const typeRègle = computed(() => {
  switch (props.regle.règle.typeRègle) {
    case 'catégorie':
      return t('règles.types.catégorie');
    case 'bornes':
      return t('règles.types.bornes');
    case 'existe':
      return t('règles.types.existe');
    case 'valeurCatégorique':
      return t('règles.types.valeurCatégorique');
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
        categorie: t(`variables.catégories.${règle.détails.catégorie}`),
      });
    case 'bornes':
      return t('règles.infos.bornes', {val: règle.détails.val, op: règle.détails.op});
    case 'existe':
      return t('règles.infos.existe');
    case 'valeurCatégorique':
      return t('règles.infos.valeurCatégorique');
    default:
      return '';
  }
});
</script>
