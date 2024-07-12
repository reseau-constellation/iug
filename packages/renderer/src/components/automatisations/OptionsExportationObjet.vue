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
  <v-autocomplete
    v-model="langues"
    :items="languesDisponibles"
    :label="t('exportations.carte.étiquetteLangues')"
    variant="outlined"
    multiple
    chips
    closable-chips
  >
  </v-autocomplete>
  <v-checkbox
    v-model="inclureDocuments"
    color="primary"
  >
    <template #label>
      {{ t('exportations.carte.étiquetteInclureDocuments') }}
      <v-tooltip
        v-if="!écranTactile"
        location="bottom"
        :text="t('exportations.carte.indiceInclureDocuments')"
      >
        <template #activator="{props: propsActivateur}">
          <v-icon
            v-bind="propsActivateur"
            icon="mdi-information-outline"
            end
          ></v-icon>
        </template>
      </v-tooltip>
    </template>
  </v-checkbox>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {computed, ref, watchEffect} from 'vue';

import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {plateforme} from '/@/utils';

const émettre = defineEmits<{
  (
    é: 'modifiee',
    args: {
      formatDoc: automatisation.formatTélécharger;
      langues: string[] | undefined;
      inclureDocuments: boolean;
    },
  ): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து, கிடைக்கும்_மொழிகளை_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {மொழி, மாற்றுமொழிகள்} = மொழிகளைப்_பயன்படுத்து();
const {மொழிகளும்_குறியீடுகளும்} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();

const {so} = plateforme();
const écranTactile = so === 'androïde' || so === 'iOS';

// Format
const formatDoc = ref<automatisation.formatTélécharger>('ods');
const optionsFormatsDoc = ['ods', 'csv', 'txt', 'xlsx', 'xls'];

const langues = ref();
const languesDisponibles = computed(() =>
  மொழிகளும்_குறியீடுகளும்.value.map(lng => ({title: lng.மொழி, value: lng.குறியீடு})),
);
watchEffect(() => {
  langues.value = [மொழி.value, ...மாற்றுமொழிகள்.value];
});

const inclureDocuments = ref(true);

// Modifications
watchEffect(() => {
  émettre('modifiee', {
    formatDoc: formatDoc.value,
    langues: langues.value,
    inclureDocuments: inclureDocuments.value,
  });
});
</script>
