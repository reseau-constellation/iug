<template>
  <v-dialog v-model="dialogue">
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
      <v-card-item>
        <v-card-title></v-card-title>
        <v-card-subtitle></v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <selecteur-variable
          :multiples="false"
          :originales="[idVariable]"
          @selectionnee="(ids) => choixVariable = ids[0]"
        />
        <v-checkbox
          v-model="choixIndex"
          :disabled="!permissionModifier"
          color="primary"
        >
          <template #label>
            {{ t('colonnes.nouvelle.index') }}
            <v-tooltip :text="t('tableaux.colonnes.indiceIndex')">
              <template #activator="{props: propsActivateur}">
                <v-icon
                  v-bind="propsActivateur"
                  icon="mdi-information-outline"
                />
              </template>
            </v-tooltip>
          </template>
        </v-checkbox>
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
  </v-dialog>
</template>
<script setup lang="ts">
import type { valid } from '@constl/ipa';

import { computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';

import SelecteurVariable from '/@/components/variables/SélecteurVariable.vue';

const props = defineProps<{
  permissionModifier: boolean;
  idVariable: string;
  idColonne: string;
  regles: valid.règleColonne[];
  index: boolean;
}>();
const émettre = defineEmits<{
  (é: 'sauvegarder', args: {
    index: boolean,
    variable: string,
    règles: valid.règleVariable[]
  }): void
}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

// Index
const choixIndex = ref(props.index);
const indexModifié = computed(()=>choixIndex.value !== props.index);

// Variable
const choixVariable = ref(props.idVariable);
const variableModifiée = computed(()=>choixVariable.value !== props.idVariable);

// Règles
const choixRègles = ref(props.regles);

// Sauvegarder
const modifié = computed(() => {
  return indexModifié.value || variableModifiée.value || règlesModifiées.value;
});
const sauvegarder = () => {
  émettre('sauvegarder', {
    index: choixIndex.value,
    variable: choixVariable.value,
    règles: choixRègles.value,
  });
  fermer();
};
const fermer = () => {
  dialogue.value = false;
};

</script>
