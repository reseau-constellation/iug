<template>
  <v-list-item>
    <template #prepend>
      <v-icon
        v-if="code === தேர்ந்தெடுத்தப்பட்ட_எண்ணுரு"
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
import {எண்களைப்_பயன்படுத்து, கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{code: string}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {தேர்ந்தெடுத்தப்பட்ட_எண்ணுரு, எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();

const numéroFormatté = எண்ணை_வடிவூட்டு(123.45, props.code);
</script>
