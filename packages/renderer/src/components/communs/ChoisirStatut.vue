<template>
  <v-select
    v-model="statut"
    :items="['active', 'obsolète', 'jouet', 'interne'] as const"
    variant="outlined"
  >
    <template #item="{item, props: propsItem}">
      <v-list-item
        v-bind="propsItem"
        :title="t(`données.statut.${item.raw}`)"
        :prepend-icon="icôneStatut(item.raw)"
      >
        <span class="text-disabled">{{ t(`données.statut.info.${item.raw}`) }}</span>
      </v-list-item>
    </template>
    <template #selection="{item}">
      <v-icon
        start
        :icon="icôneStatut(item.raw)"
      ></v-icon>
      {{ t(`données.statut.${item.raw}`) }}
    </template>
  </v-select>
  <v-expand-transition>
    <v-checkbox
      v-show="statut === 'obsolète'"
      v-model="inclureNouvelle"
      :label="t('données.statut.inclureNouvelle')"
      color="primary"
      hide-details
    />
  </v-expand-transition>
  <v-expand-transition>
    <p v-show="statut === 'obsolète' && inclureNouvelle">
      <slot
        name="sélecteur"
        :choisir-nouvelle="(id: string) => (idNouvelle = id)"
      />
    </p>
  </v-expand-transition>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {ref, watchEffect} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {icôneStatut} from '/@/components/utils';

const props = defineProps<{
  initial?: types.schémaStatut;
}>();
const émettre = defineEmits<{
  (é: 'choisir', choix: types.schémaStatut): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const statut = ref(props.initial?.statut);
const inclureNouvelle = ref<boolean>();
const idNouvelle = ref(props.initial?.idNouvelle);

watchEffect(() => {
  if (statut.value !== 'obsolète') idNouvelle.value = undefined;
});

watchEffect(() => {
  if (statut.value) {
    const statutFinal: types.schémaStatut = {statut: statut.value};
    if (idNouvelle.value) statutFinal.idNouvelle = idNouvelle.value;
    émettre('choisir', statutFinal);
  }
});

// Icône
</script>
