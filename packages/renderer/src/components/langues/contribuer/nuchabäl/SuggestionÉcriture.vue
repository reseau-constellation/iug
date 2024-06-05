<template>
  <item-ecriture
    :nom="suggestion.பரிந்துரை.rubiTzib"
    :code="suggestion.பரிந்துரை.runukTzib"
    :direction="suggestion.பரிந்துரை.rucholanemTzib"
    ,
    :numeration="suggestion.பரிந்துரை.rajilanïkTzib"
  >
    {{ t('nuchabäl.suggestion.par') }} <jeton-membre :compte="suggestion.பங்கேற்பாளர்" />
  </item-ecriture>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import type {பிணையம்_பரிந்துரை} from '@lassi-js/kili';

import ItemEcriture from './ItemÉcriture.vue';
import JetonMembre from '/@/components/membres/JetonMembre.vue';

import type {RucholajEtamabälTzibanem} from 'nuchabal';

defineProps<{suggestion: பிணையம்_பரிந்துரை<RucholajEtamabälTzibanem>}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
</script>
