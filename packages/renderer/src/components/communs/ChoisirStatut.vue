<template>
  <v-select
    v-model="statut"
    :items="['active', 'obsolète', 'jouet', 'interne']"
  >
    <template #item="{item, props: propsItem}">
      <v-list-item
        v-bind="propsItem"
        :title="t(`données.statut.${item.raw}`)"
      >
        {{ t(`données.statut.info.${item.raw}`) }}
      </v-list-item>
    </template>
  </v-select>
  <v-checkbox
    v-show="statut === 'obsolète'"
    v-model="inclureNouvelle"
    :label="t('données.statut.inclureNouvelle')"
  />
  <span v-show="statut === 'obsolète' && inclureNouvelle">
    <slot
      name="sélecteur"
      :choisir-nouvelle="(id: string) => (idNouvelle = id)"
    />
  </span>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {ref, watchEffect} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

defineProps<{original?: types.schémaStatut}>();
const émettre = defineEmits<{
  (é: 'choisir', choix: types.schémaStatut): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const statut = ref<types.TYPES_STATUT>('active');
const inclureNouvelle = ref<boolean>();
const idNouvelle = ref<string>();

watchEffect(() => {
  if (statut.value) {
    émettre('choisir', {statut: statut.value, idNouvelle: idNouvelle.value});
  }
});
</script>
