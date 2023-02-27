<template>
  <v-menu>
    <template #activator="{props}">
      <v-btn
        v-bind="props"
        icon="mdi-link"
        size="small"
        variant="flat"
      >
      </v-btn>
    </template>
    <v-list @click.stop>
      <v-list-item>
        <template #title>{{ id }}</template>
        <template #append>
          <v-btn
            :icon="copié ? 'mdi-check' : 'mdi-content-copy'"
            size="small"
            variant="flat"
            @click="copierLien"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {copier} from '/@/utils';

const props = defineProps<{id: string}>();

// Contrôles
const copié = ref(false);
const copierLien = async () => {
  await copier(props.id);
  copié.value = true;
};
</script>
