<template>
  <v-chip :prepend-icon="icone">
    <slot />
    <v-icon
      end
      :icon="icôneStatut"
    />
  </v-chip>
</template>
<script setup lang="ts">
import type {favoris} from '@constl/ipa';
import { computed } from 'vue';

const props = defineProps<{
    icone: string;
    dispositifs: favoris.typeDispositifs;
    statut?: boolean;
}>();


// Icône
const icôneStatut = computed(()=>{
  return props.statut ? 'mdi-pin' : (props.dispositifs === 'AUCUN' ? 'mdi-pin-off-outline': 'mdi-pin-outline');
});

</script>