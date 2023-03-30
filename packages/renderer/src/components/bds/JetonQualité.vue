<template>
  <v-chip
    class="mb-2 me-2"
    variant="outlined"
    label
  >
    <v-progress-circular
      :rotate="score ? 270 : undefined"
      :value="score ? score * 100 : 0"
      :indeterminate="!score"
      :color="score ? couleurScore(score).couleur : 'grey lighten-2'"
      :size="15"
      :width="3"
    />
    <span class="ms-2">
      {{ t('bds.qualité') }}:
      <span
        :style="`color:${couleurScore(score ? score : null).couleur}`"
        class="font-weight-bold"
      >
        {{ score ? t('bds.note.' + couleurScore(score).note) : t('communs.pointInterrogation') }}
      </span>
    </span>
  </v-chip>
</template>

<script setup lang="ts">
import type {infoScore} from '@constl/ipa/dist/src/bds';
import type ClientConstellation from '@constl/ipa/dist/src/client';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/composables/utils';
import {couleurScore} from '/@/utils';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Qualité BD
const qualité = ref<infoScore>();
enregistrerÉcoute(
  constl?.bds?.suivreScoreBd({
    id: props.id,
    f: x => (qualité.value = x),
  }),
);
const score = computed(() => {
  return qualité.value?.total;
});
</script>
