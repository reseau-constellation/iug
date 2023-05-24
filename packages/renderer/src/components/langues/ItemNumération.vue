<template>
  <v-list-item>
    <template #prepend>
      <v-icon
        v-if="code === numération"
        color="primary"
      >
        mdi-check-bold
      </v-icon>
    </template>

    <template #title>
      {{ code || t('communs.auto') }}
    </template>

    <template #append>
      {{ numéroFormatté }}
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserNumération} from '/@/plugins/localisation/localisation';

const props = defineProps<{code: string}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const {numération, formatterChiffre} = utiliserNumération();

const numéroFormatté = formatterChiffre(123.45, props.code);
</script>
