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
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

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
