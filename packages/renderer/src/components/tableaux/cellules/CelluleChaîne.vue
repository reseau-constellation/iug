<template>
  <template v-if="editable">
  </template>
  <template v-else>
    <TexteTronqué
      v-if="texteTraduit"
      :texte="texteTraduit"
      :longueur-max="30"
    />
    <v-skeleton-loader
      v-else-if="valValide"
      type="text"
    />
  </template>
</template>
<script setup lang="ts">
import type { types } from '@constl/ipa';
import {type ComputedRef, computed} from 'vue';
import {suivre} from '@constl/vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';
import {adresseOrbiteValide} from '@constl/utils-ipa';

import TexteTronqué from '/@/components/communs/TexteTronqué.vue';
// import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';

const props = defineProps<{val?: types.élémentsBd, editable: boolean}>();

const constl = utiliserConstellation();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();

const valValide = computed(()=>{
  if (typeof props.val === 'string' && adresseOrbiteValide(props.val)) return props.val;
  else return undefined;
});

// Texte traduit
const textes: ComputedRef<{[langue: string]: string}> = suivre(constl.suivreBdDic, {id: valValide});
const texteTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(textes);

</script>
