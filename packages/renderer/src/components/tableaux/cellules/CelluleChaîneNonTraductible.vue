<template>
  <TexteTronqué
    :texte="val"
    :longueur-max="10"
  />
  <!--<template #item.calories="{item}">
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
import TexteTronqué from '/@/components/communs/TexteTronqué.vue';

defineProps<{val: string}>();
</script>
