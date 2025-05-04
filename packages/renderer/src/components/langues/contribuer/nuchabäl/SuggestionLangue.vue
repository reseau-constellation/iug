<template>
  <item-langue
    :nom="suggestion.பரிந்துரை.rubiChabäl"
    :code="suggestion.பரிந்துரை.runukChabäl"
    :écriture="suggestion.பரிந்துரை.rutzibanemChabäl"
    :numération="suggestion.பரிந்துரை.rajilanïkChabäl"
    :codes="{
      i1: suggestion.பரிந்துரை.i1,
      i2: suggestion.பரிந்துரை.i2,
      i3: suggestion.பரிந்துரை.i3,
      gl: suggestion.பரிந்துரை.gl,
    }"
  >
    {{ t('nuchabäl.suggestion.par') }} <jeton-membre :compte="suggestion.பங்கேற்பாளர்" />
  </item-langue>
</template>
<script setup lang="ts">
import type {பிணையம்_பரிந்துரை} from '@lassi-js/kili';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import ItemLangue from './ItemLangue.vue';
import JetonMembre from '/@/components/membres/JetonMembre.vue';

import type {RucholajEtamabälChabäl} from 'nuchabal';

defineProps<{suggestion: பிணையம்_பரிந்துரை<RucholajEtamabälChabäl>}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
</script>
