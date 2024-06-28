<template>
  <v-chip
    class="mb-2 me-2"
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
import {utiliserConstellation, icôneObjet, suivre} from '/@/components/utils';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

// Nom du mot-clef
const noms = suivre(constl.motsClefs.suivreNomsMotClef, {idMotClef: props.id});
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
</script>
