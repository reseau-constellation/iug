<template>
  <v-menu>
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      >
        <v-icon
          color="error"
          icon="mdi-error"
        />
      </slot>
    </template>
    {{ erreurs }}
  </v-menu>
</template>
<script setup lang="ts">
import type {erreurValidation} from '@constl/ipa/dist/src/valid';

defineProps<{erreurs: erreurValidation[]}>();
</script>
