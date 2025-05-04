<template>
  <v-chip
    v-bind="$attrs"
    :prepend-icon="icôneObjet('motClef')"
    variant="outlined"
    size="small"
    label
  >
    <slot name="nom">{{ nomTraduit || t('motsClefs.sansNom') }}</slot>
    <slot default />
  </v-chip>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {icôneObjet, utiliserConstellation} from '/@/components/utils';

import {மொழிகளைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom du mot-clef
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: computed(() => props.id)});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
