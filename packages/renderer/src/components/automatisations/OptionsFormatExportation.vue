<template>
  <v-select
    v-model="formatDoc"
    :items="optionsFormatsDoc"
    :label="t('exportations.carte.étiquetteFormatDoc')"
    class="mt-2"
    variant="outlined"
  >
    <template #selection="{item}">
      {{ t(`exportations.format.${item.raw}`) }}
    </template>
    <template #item="{item, props: propsItem}">
      <v-list-item
        v-bind="propsItem"
        :title="t(`exportations.format.${item.raw}`)"
      >
      </v-list-item>
    </template>
  </v-select>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref} from 'vue';

defineModel<automatisation.formatTélécharger>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const formatDoc = ref<automatisation.formatTélécharger>('ods');
const optionsFormatsDoc = ['ods', 'csv', 'txt', 'xlsx', 'xls'];
</script>
