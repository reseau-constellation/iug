<template>
  <v-list-item prepend-icon="mdi-check">
    <p>{{ t(infoRègle) }}</p>
    <slot />
    <template #append>
      <v-icon
        v-if="effacable && autorisationModifier"
        icon="mdi-delete"
        color="error"
        variant="flat"
        @click="() => émettre('effacer')"
      />
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {texteInfoRègle} from './utils';

const props = defineProps<{
  regle: valid.règleVariableAvecId;
  effacable: boolean;
  autorisationModifier: boolean;
}>();
const émettre = defineEmits<{
  (é: 'effacer'): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Info
const infoRègle = computed(() => {
  const {règle} = props.regle;
  return texteInfoRègle({règle, t});
});
</script>
