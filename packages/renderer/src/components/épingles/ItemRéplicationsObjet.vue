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
        {{ t('réplications.réplications', {n: nRéplications}) }}
      </span>
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import {rechercher} from '@constl/vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import {utiliserConstellation} from '/@/components/utils';

const props = defineProps<{id: string}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

const {résultats: réplications} = rechercher(constl.réseau.suivreRéplications, {
  idObjet: computed(() => props.id),
  profondeur: 10,
});

const nRéplications = computed(() => réplications.value?.dispositifs.length || 0);
</script>
