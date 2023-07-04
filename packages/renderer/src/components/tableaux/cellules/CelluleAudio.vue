<template>
  <v-icon icon="mdi-audio" />
  <TexteTronqué
    :texte="val.cid"
    :longueur-max="10"
  />
</template>
<script setup lang="ts">
import TexteTronqué from '/@/components/communs/TexteTronqué.vue';

defineProps<{val: {cid: string; ext: string}}>();
</script>
