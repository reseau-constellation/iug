<template>
  <v-list-item>
    <v-list-item-title> </v-list-item-title>
    <v-switch />
    <v-list-item-action>
      <v-btn
        icon="mdi-delete"
        @click="effacerColonne"
      />
    </v-list-item-action>
  </v-list-item>
</template>
<script setup lang="ts">
defineProps<{
  id: string;
  idVariable: string;
  index?: boolean;
  modificationPermise: boolean;
}>();
const émettre = defineEmits<{
  (é: 'modifier-colonne', info: {idVariable: string; index?: boolean}): void;
  (é: 'effacer-colonne'): void;
}>();

const effacerColonne = () => émettre('effacer-colonne');
</script>
