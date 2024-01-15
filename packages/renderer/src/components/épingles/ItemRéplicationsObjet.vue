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
import type {réseau} from '@constl/ipa';

import {ref} from 'vue';

import {constellation, enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';

const props = defineProps<{id: string}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const constl = constellation();

const réplications = ref<réseau.infoRéplications>();

enregistrerÉcoute(
  constl.réseau.suivreRéplications({
    idObjet: props.id,
    f: r => (réplications.value = r),
    profondeur: 10,
  }),
);

const nRéplications = computed(() => réplications.value?.dispositifs.length || 0);
</script>
