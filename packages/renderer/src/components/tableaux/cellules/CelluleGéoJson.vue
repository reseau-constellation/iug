<template>
  <v-dialog
    v-if="editable || valValide"
    v-model="dialogue"
  >
    <template #activator="{props: propsActivateur}">
      <v-icon
        v-bind="propsActivateur"
        :icon="
          editable
            ? valValide
              ? 'mdi-map-marker'
              : 'mdi-map-marker-plus-outline'
            : 'mdi-map-marker-outline'
        "
      />
    </template>
    <v-card class="mx-auto">
      <v-tabs
        v-if="editable"
        v-model="onglet"
      >
        <v-tab value="éditer">
          {{ editable ? 'Éditer' : 'Texte'
          }}<v-icon
            :icon="editable ? 'mdi-pencil' : 'mdi-xml'"
            end
          />
        </v-tab>
        <v-tab value="visualiser">
          Visualiser<v-icon
            icon="mdi-map-outline"
            end
          />
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-tabs-window v-model="onglet">
          <v-tabs-window-item value="éditer">
            <v-textarea
              v-model="valFinaleTexte"
              :readonly="!editable"
              :error="!!valFinaleTexte && !valFinaleValide"
              variant="outlined"
            />
          </v-tabs-window-item>
          <v-tabs-window-item value="visualiser">
            <visualisateur-geo-json :geojson="valFinale" />
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="editable"
          @click="() => sauvegarder()"
        >
          Sauvegarder
        </v-btn>
        <v-btn @click="() => (dialogue = false)">Fermer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {types} from '@constl/ipa';

import gjv from 'geojson-validation';
import {computed, ref, watchEffect} from 'vue';
import VisualisateurGeoJson from './VisualisateurGéoJSON.vue';

const props = defineProps<{val?: types.élémentsBd; editable: boolean}>();
const émettre = defineEmits<{(é: 'modifiee', args: {val?: types.élémentsBd}): void}>();

const valValide = computed<types.élémentsBd | undefined>(() => {
  if (gjv.valid(props.val)) return props.val;
  else return undefined;
});

// Navigation
const dialogue = ref(false);
const onglet = ref<'éditer' | 'visualiser'>('éditer');
watchEffect(() => {
  onglet.value = computed(() => props.editable).value ? 'éditer' : 'visualiser';
});

// Édition
const valFinaleTexte = ref<string>();
watchEffect(() => {
  if (valValide.value) valFinaleTexte.value = JSON.stringify(valValide, undefined, 2);
  else valFinaleTexte.value = undefined;
});
const valFinale = computed(() => {
  if (!valFinaleTexte.value) return undefined;
  try {
    return JSON.parse(valFinaleTexte.value);
  } catch {
    return undefined;
  }
});
const valFinaleValide = computed(() => gjv.valid(valFinale.value));
const sauvegarder = () =>
  émettre('modifiee', {val: valFinale.value?.length ? valFinale.value : undefined});
</script>
