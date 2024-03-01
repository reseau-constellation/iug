<template>
  <v-list-item>
    <template #prepend>
      <v-icon
        left
        icon="mdi-database-sync"
      />
    </template>
    <v-list-item-title>
      <v-skeleton-loader
        v-if="réplications === undefined"
        type="chip"
      />
      <span v-else>
        {{ t('réplications.nRéplications', nRéplications) }}
      </span>
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import {constellation, suivre} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';

const props = defineProps<{id: string}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();

const réplications = suivre(constl.réseau.suivreRéplications, {idObjet: props.id, profondeur: 10});

const nRéplications = computed(() => réplications.value?.dispositifs.length || 0);
</script>
