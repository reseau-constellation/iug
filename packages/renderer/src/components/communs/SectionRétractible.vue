<template>
  <div>
    <p class="mt-2 font-weight-bold">
      {{ titre }}
      <v-btn
        :icon="ouvert ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        size="xsmall"
        variant="flat"
        @click="() => (ouvert = !ouvert)"
      ></v-btn>
    </p>
    <v-divider />
    <v-expand-transition>
      <div v-show="ouvert">
        <slot />
      </div>
    </v-expand-transition>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue';

const props = defineProps<{initial: 'ouvert' | 'fermé'; titre: string}>();
const ouvert = ref(props.initial === 'ouvert');
</script>
