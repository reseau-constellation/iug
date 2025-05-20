<template>
  <v-list-item>
    <v-row>
      <v-col>
        {{ clef }}
      </v-col>
      <v-col>
        <v-text-field
          v-model="nouvelleVal"
          :readonly="!modifiable"
          @blur="sauvegarder"
        >
          {{ val }}
        </v-text-field>
      </v-col>
    </v-row>
    <template
      v-if="modifiable"
      #append
    >
      <v-icon
        icon="mdi-delete"
        @click="effacer"
      ></v-icon>
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import {ref} from 'vue';
import type {types} from '@constl/ipa';

const props = defineProps<{id: string; clef: string; val: types.élémentsBd; modifiable: boolean}>();
const émettre = defineEmits<{
  (é: 'modifiee', info: {clef: string; val: string}): void;
  (é: 'effacee'): void;
}>();

// Contrôles
const nouvelleVal = ref();
const nouvelleClef = ref(props.clef);
const sauvegarder = () => {
  émettre('modifiee', {clef: nouvelleClef.value, val: nouvelleVal.value});
};
const effacer = () => émettre('effacee');
</script>
