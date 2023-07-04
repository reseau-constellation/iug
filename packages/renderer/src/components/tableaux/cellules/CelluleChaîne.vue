<template>
  <TexteTronqué
    v-if="texteTraduit"
    :texte="texteTraduit"
    :longueur-max="10"
  />
  <v-skeleton-loader
    v-else
    type="chip"
  />
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';

import {inject, ref} from 'vue';

import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/components/utils';

import TexteTronqué from '/@/components/communs/TexteTronqué.vue';

const props = defineProps<{val: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {traduireNom} = utiliserLangues();

// Texte traduit
const textes = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.suivreBdDic({
    id: props.val,
    f: x => (textes.value = x as {[langue: string]: string}),
  }),
);
const texteTraduit = traduireNom(textes);
</script>
