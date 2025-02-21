<template>
  <v-list-item>
    <v-list-item>
      <template #title>{{ id }}</template>
      <template #append>
        <v-icon @click="() => approuverRequête()">mdi-check</v-icon>
        <v-icon @click="() => refuserRequête()">mdi-delete</v-icon>
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

const approuverRequête = async () => {
  await serveurLocal.approuverRequêteAuthServeur({idRequête: props.id});
};
const refuserRequête = async () => {
  await serveurLocal.refuserRequêteAuthServeur({idRequête: props.id});
};
</script>
