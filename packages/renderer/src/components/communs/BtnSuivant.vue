<template>
  <v-btn
    v-show="visible"
    color="primary"
    variant="flat"
    :disabled="!actif"
    :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
    @click="() => émettre('suivant')"
  >
    {{ t('communs.suivant') }}
  </v-btn>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useRtl} from 'vuetify';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {isRtl} = useRtl();

defineProps<{
  visible: boolean;
  actif: boolean;
}>();

const émettre = defineEmits<{
  (é: 'suivant'): void;
}>();
</script>
