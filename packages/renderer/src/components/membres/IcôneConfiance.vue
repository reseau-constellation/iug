<template>
  <v-icon
    :color="couleurIcône"
    start
  >
    {{ icône }}
  </v-icon>
</template>
<script setup lang="ts">
import {computed} from 'vue';

const props = defineProps<{
  confiance: number;
  cestMoi: boolean;
}>();

const icône = computed(() => {
  if (props.confiance < 0) {
    return 'mdi-cancel';
  } else {
    return props.cestMoi ? 'mdi-check' : 'mdi-hands-pray';
  }
});
const couleurIcône = computed(() => {
  if (props.confiance < 0) {
    return 'error';
  } else if (props.confiance === 1) {
    return 'success';
  } else {
    return `rgba(22, 151, 246, ${0.1 + props.confiance * 0.9})`;
  }
});
</script>
