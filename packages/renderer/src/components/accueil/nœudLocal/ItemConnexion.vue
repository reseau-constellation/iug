<template>
  <v-list-item>
    <v-list-item>
      <template #title>{{ id }}</template>
      <template #append>
        <v-icon @click="() => révoquerAccès()">mdi-delete</v-icon>
      </template>
    </v-list-item>
  </v-list-item>
</template>
  <script setup lang="ts">
  import {utiliserServeurLocalConstellation} from '/@/components/utils';
  
  const props = defineProps<{
    id: string;
  }>();
  
  const serveurLocal = utiliserServeurLocalConstellation();
  
  const révoquerAccès = async () => {
    await serveurLocal.révoquerAccèsServeur({idRequête: props.id});
  };
  
  </script>