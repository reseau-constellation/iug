<template>
  <v-select
    v-model="typeSauvegarde"
    :class="mdAndUp ? ['mb-4'] : ['mb-2']"
    :items="optionsTypeSauvegarde"
    variant="outlined"
    density="compact"
    hide-details
  >
    <template #item="{props: propsItem, item}">
      <v-list-item
        v-bind="{...propsItem, title: t(`automatisations.sauvegardes.sélection.${item.raw}.item`)}"
      ></v-list-item>
    </template>
    <template #selection="{item}">
      {{ t(`automatisations.sauvegardes.sélection.${item.raw}.sélection`) }}
    </template>
    <template
      v-if="mdAndUp"
      #append
    >
      <v-expand-x-transition>
        <div
          v-if="typeSauvegarde === 'n'"
          class="d-flex"
        >
          <v-text-field
            v-model="nSauvegardesTexte"
            class="mx-1 me-3"
            variant="outlined"
            hide-details
            density="compact"
          />
          <span class="my-auto">{{
            t(`automatisations.sauvegardes.sélection.n.sauvegardes`)
          }}</span>
        </div>
      </v-expand-x-transition>
      <v-expand-x-transition>
        <div
          v-if="typeSauvegarde === 'temps'"
          class="d-flex"
        >
          <v-text-field
            v-model="nFréquenceTexte"
            variant="outlined"
            density="compact"
            hide-details
          >
          </v-text-field>
          <v-select
            v-model="unitéFréquence"
            :items="optionsUnitésFréquence"
            class="ms-2"
            variant="outlined"
            density="compact"
            hide-details
          >
            <template #selection="{item}">
              {{ t(`automatisations.fréquence.unités.${item.raw}`) }}
            </template>
            <template #item="{item, props: propsItem}">
              <v-list-item
                v-bind="propsItem"
                :title="t(`automatisations.fréquence.unités.${item.raw}`)"
              />
            </template>
          </v-select>
        </div>
      </v-expand-x-transition>
    </template>
  </v-select>
  <v-expand-transition v-if="!mdAndUp">
    <div
      v-if="typeSauvegarde === 'n'"
      class="d-flex"
    >
      <v-text-field
        v-model="nSauvegardesTexte"
        class="mx-1 me-3"
        variant="outlined"
        hide-details
        density="compact"
      />
      <span class="my-auto">{{ t(`automatisations.sauvegardes.sélection.n.sauvegardes`) }}</span>
    </div>
    <div
      v-if="typeSauvegarde === 'temps'"
      class="d-flex"
    >
      <v-text-field
        v-model="nFréquenceTexte"
        variant="outlined"
        density="compact"
        hide-details
      >
      </v-text-field>
      <v-select
        v-model="unitéFréquence"
        :items="optionsUnitésFréquence"
        class="ms-2"
        variant="outlined"
        density="compact"
        hide-details
      >
        <template #selection="{item}">
          {{ t(`automatisations.fréquence.unités.${item.raw}`) }}
        </template>
        <template #item="{item, props: propsItem}">
          <v-list-item
            v-bind="propsItem"
            :title="t(`automatisations.fréquence.unités.${item.raw}`)"
          />
        </template>
      </v-select>
    </div>
  </v-expand-transition>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';
import {எண்ணிக்கையை_கண்டுப்பிடி, கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const எண்ணிக்கை = எண்ணிக்கையை_கண்டுப்பிடி();

const sauvegardes = defineModel<automatisation.copiesExportation>();

const typeSauvegarde = ref<'n' | 'temps' | 'aucune'>(
  sauvegardes.value?.type ? sauvegardes.value.type : 'aucune',
);
const optionsTypeSauvegarde = ['aucune', 'n', 'temps'];

const nSauvegardesTexte = ref(
  sauvegardes.value?.type === 'n' ? sauvegardes.value.n.toString() : '1',
);
const nSauvegardes = computed(() => எண்ணிக்கை.எண்ணுக்கு({உரை: nSauvegardesTexte.value}));

const nFréquenceTexte = ref(
  sauvegardes.value?.type === 'temps' ? sauvegardes.value.temps.détails.n.toString() : '1',
);
const nFréquence = computed(() => எண்ணிக்கை.எண்ணுக்கு({உரை: nFréquenceTexte.value}));

const unitéFréquence = ref<automatisation.fréquenceFixe['détails']['unités']>(
  sauvegardes.value?.type === 'temps' ? sauvegardes.value.temps.détails.unités : 'jours',
);
const optionsUnitésFréquence: automatisation.fréquenceFixe['détails']['unités'][] = [
  'années',
  'mois',
  'semaines',
  'jours',
  'heures',
  'minutes',
  'secondes',
  'millisecondes',
];

watchEffect(() => {
  switch (typeSauvegarde.value) {
    case 'aucune':
      sauvegardes.value = undefined;
      break;
    case 'n': {
      const nouvelleValeur: automatisation.copiesExportationN = {
        type: 'n',
        n: nSauvegardes.value,
      };
      sauvegardes.value = nouvelleValeur;
      break;
    }
    case 'temps': {
      const nouvelleValeur: automatisation.copiesExportationTemps = {
        type: 'temps',
        temps: {
          type: 'fixe',
          détails: {
            unités: unitéFréquence.value,
            n: nFréquence.value,
          },
        },
      };
      sauvegardes.value = nouvelleValeur;
      break;
    }
  }
});
</script>
