<template>
  <item-regle
    :regle="regle.règle"
    :effacable="effaçable"
    :autorisation-modifier="autorisationModifier"
    @effacer="() => émettre('effacer')"
  >
    <source-regle-colonne :source="regle.source" />
  </item-regle>
</template>
<script setup lang="ts">
import type {valid} from '@constl/ipa';

import {computed} from 'vue';

import ItemRegle from './ItemRègle.vue';
import SourceRegleColonne from './SourceRègleColonne.vue';

const props = defineProps<{
  regle: valid.règleColonne;
  autorisationModifier: boolean;
}>();
const émettre = defineEmits<{
  (é: 'effacer'): void;
}>();

const effaçable = computed(() => {
  return props.regle.règle.règle.typeRègle !== 'catégorie' && props.regle.source.type === 'tableau';
});
</script>
