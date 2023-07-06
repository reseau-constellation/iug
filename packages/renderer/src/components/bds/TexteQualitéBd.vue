<template>
  <span class="ms-2">
    {{ t('bds.qualité') }}:
    <span
      :style="`color:${couleurScore(score ? score : null).couleur}`"
      class="font-weight-bold"
    >
      {{ score ? t('bds.note.' + couleurScore(score).note) : t('communs.pointInterrogation') }}
    </span>
  </span>
</template>

<script setup lang="ts">
import type {client, bds} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {couleurScore} from '/@/utils';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Qualité BD
const qualité = ref<bds.infoScore>();
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
