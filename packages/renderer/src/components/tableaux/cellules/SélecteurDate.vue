<template>
  <v-menu v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-text style="overflow-y:auto">
        <v-select label="'Calendrier'" />
        <v-select label="''" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :disabled="!modifié"
          variant="flat"
          color="primary"
          @click="sauvegarder"
        >
          {{ t('communs.sauvegarder') }}
        </v-btn>
        <v-btn
          variant="flat"
          append-icon="mdi-close"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import { computed, watchEffect, ref } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{originale?: number}>();
const émettre = defineEmits<{
  (é: 'modifiee', args: {val?: number}): void;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

// Sélection
const val = ref<number>();
const modifié = computed(()=> val.value !== props.originale);
watchEffect(()=>val.value = computed(()=>props.originale).value);

// Sauvegarder
const sauvegarder = () => {
  émettre('modifiee', {val: val.value});
  fermer();
};
const fermer = () => dialogue.value = false;
</script>