<template>
  <h1>{{ id }}</h1>
</template>
<script setup lang="ts">
import {onMounted} from 'vue';
import {utiliserHistoriqueDocuments} from '/@/état/historiqueDocuments';

const props = defineProps<{id: string}>();

const historiqueDocuments = utiliserHistoriqueDocuments();

onMounted(() => {
  historiqueDocuments.documentOuvert({id: props.id, à: Date.now()});
});
</script>
