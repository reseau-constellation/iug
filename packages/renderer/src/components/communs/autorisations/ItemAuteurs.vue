<template>
  <v-list-item>
    <template #prepend>
      <v-icon
        start
        icon="mdi-account-multiple"
      />
    </template>
    <v-list-item-title>
      <v-progress-circular
        v-if="!auteurs"
        :indeterminate="!auteurs"
        color="grey lighten-2"
        :size="15"
        :width="3"
      />
      <span v-else>
        {{ auteurs ? t('communs.auteurs', {n: nAuteursFormatté}) : '' }}
      </span>
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import type {utils} from '@constl/ipa';

import {computed} from 'vue';

import {utiliserNumération} from '/@/plugins/localisation/localisation';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{
  auteurs?: utils.infoAuteur[];
}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {formatterChiffre} = utiliserNumération();

const nAuteurs = computed(() => props.auteurs?.length || 0);
const nAuteursFormatté = formatterChiffre(nAuteurs);
</script>
