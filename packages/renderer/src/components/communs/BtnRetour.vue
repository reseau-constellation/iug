<template>
  <v-btn
    v-show="visible"
    variant="text"
    :disabled="!actif"
    :prepend-icon="isRtl ? 'mdi-chevron-right' : 'mdi-chevron-left'"
    @click="() => émettre('retour')"
  >
    {{ t('communs.retour') }}
  </v-btn>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useRtl} from 'vuetify';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {isRtl} = useRtl();

defineProps<{
  visible: boolean;
  actif: boolean;
}>();

const émettre = defineEmits<{
  (é: 'retour'): void;
}>();
</script>
