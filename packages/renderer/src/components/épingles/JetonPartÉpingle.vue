<template>
  <v-tooltip
    location="bottom"
    :text="t(`${indice}.${statut ? 'oui' : 'non'}`)"
  >
    <template #activator="{props: propsActivateur}">
      <v-chip
        v-bind="{...$attrs, ...propsActivateur}"
        :prepend-icon="icone"
        variant="outlined"
        label
      >
        <slot />
        <v-icon
          end
          :icon="icôneStatut"
        />
      </v-chip>
    </template>
  </v-tooltip>
</template>
<script setup lang="ts">
import type {favoris} from '@constl/ipa';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const props = defineProps<{
  icone: string;
  dispositifs: favoris.typeDispositifs;
  statut?: boolean;
  indice: string;
}>();

// Icône
const icôneStatut = computed(() => {
  return props.statut
    ? 'mdi-pin'
    : props.dispositifs === 'AUCUN'
      ? 'mdi-pin-off-outline'
      : 'mdi-pin-outline';
});
</script>
