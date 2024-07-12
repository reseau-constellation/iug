<template>
  <v-text-field
    v-if="editable"
    v-model="valFinale"
    hide-details
    density="compact"
    variant="outlined"
  />
  <texte-tronque
    v-else-if="valValide"
    :texte="valValide"
    :longueur-max="30"
  />

  <v-icon
    v-if="val && !valValide"
    size="small"
    color="error"
    icon="mdi-alert-circle-outline"
  />
  <!--  <p
    ref="texte"
    contenteditable
    @input="console.log"
  > {{ val }} </p>
  <template #item.calories="{item}">
    <p
      contenteditable
      @input="changerValeur"
      >{{ item.columns.calories }}</p
    >
  </template>
  <template #item.fat="{item}">
    <p
      contenteditable
      @input="changerValeur"
      >{{ item.columns.calories }}</p
    >
  </template> -->
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import {computed, ref, watch} from 'vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';

const props = defineProps<{val?: types.élémentsBd; editable: boolean}>();
const émettre = defineEmits<{(é: 'modifiee', args: {val?: string}): void}>();

const valValide = computed(() => (typeof props.val === 'string' ? props.val : undefined));

const valFinale = ref(valValide.value);
watch(valFinale, () => {
  émettre('modifiee', {val: valFinale.value || undefined});
});
</script>
