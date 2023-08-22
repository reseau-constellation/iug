<template>
  <v-chip-group column>
    <!--<v-chip
      v-for="opération in opérations"
      :key="opération.toString()"
    >
    </v-chip> -->
    <v-chip prepend-icon="mdi-plus" />
  </v-chip-group>
</template>
<script setup lang="ts">
// import type {automatisation as auto} from '@constl/ipa';

// import {ref} from 'vue';

defineProps<{type: 'horoDatage' | 'intervaleTemps' | 'numérique'}>();

// const opérations = ref<auto.opérationConversionNumérique[]>();
// const systèmeNumération = ref<string>();
</script>
