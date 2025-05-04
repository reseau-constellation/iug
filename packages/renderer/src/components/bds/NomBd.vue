<template>
  <span>{{ nom || t('bds.sansNom') }} </span>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {utiliserConstellation} from '../utils';

const props = defineProps<{idBd: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Nom
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const noms = suivre(constl.bds.suivreNomsBd, {idBd: computed(() => props.idBd)});

const nom = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
