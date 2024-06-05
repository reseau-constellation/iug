<template>
  <v-dialog>
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card>
      <v-card-text> Nom Code nuch'ab'äl Numération Expré Autres codes </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">

defineEmits<{
  (e: 'suggestion', code: {système: string}): void
}>();
</script>
