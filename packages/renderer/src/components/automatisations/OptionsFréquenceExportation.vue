<template>
  <v-select
    v-model="typeFréquence"
    :class="mdAndUp? ['mb-4']: ['mb-2']"
    :items="optionsFréquence"
    variant="outlined"
    density="compact"
    hide-details
  >
    <template #item="{props: propsItem, item}">
      <v-list-item
        v-bind="{...propsItem, title: t(item.title)}"
        :disabled="isBrowser && (item.value === 'manuelle' || item.value === 'dynamique')"
      >
        <span v-if="isBrowser && (item.value === 'manuelle' || item.value === 'dynamique')">
          <v-icon
            size="small"
            start
          >mdi-alert-outline</v-icon>
          {{ t('automatisations.fréquence.pasSurNavig') }}</span>
      </v-list-item>
    </template>
    <template #selection="{item}">
      {{ t(item.raw.sélection) }}
    </template>
    <template
      v-if="mdAndUp"
      #append
    >
      <v-expand-x-transition>
        <div
          v-if="typeFréquence==='fixe'"
          class="d-flex"
        >
          <v-text-field
            v-model="choixFréquenceFixe" 
            variant="outlined"
            density="compact"
            hide-details
            :rules="[règleNumérique, règleEntierPositif]"
          >
          </v-text-field>
          <v-select
            v-model="choixUnitéFréquenceFixe"
            :items="optionsUnitésFréquenceFixe"
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
      v-if="typeFréquence==='fixe'"
      class="d-flex mb-4"
    >
      <v-text-field
        v-model="choixFréquenceFixe" 
        variant="outlined"
        density="compact"
        hide-details
        :rules="[règleNumérique, règleEntierPositif]"
      >
      </v-text-field>
      <v-select
        v-model="choixUnitéFréquenceFixe"
        :items="optionsUnitésFréquenceFixe"
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
import type { automatisation } from '@constl/ipa';
import { எண்ணிக்கையை_கண்டுப்பிடி, கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import { ref, computed, watchEffect } from 'vue';
import { useDisplay } from 'vuetify';
import { isBrowser } from 'wherearewe';

const fréquence = defineModel<automatisation.fréquence>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const எண்ணிக்கை = எண்ணிக்கையை_கண்டுப்பிடி();

const optionsFréquence = [{
    value: 'manuelle',
    title: 'automatisations.fréquence.manuelle',
      sélection: 'automatisations.exportation.fréquence.sélection.manuelle',
    }, 
    {
    value: 'dynamique',
    title: 'automatisations.fréquence.dynamique',
      sélection: 'automatisations.exportation.fréquence.sélection.dynamique',
    }, 
    {
      value: 'fixe',
      title: 'automatisations.fréquence.fixe',
      sélection: 'automatisations.exportation.fréquence.sélection.fixe',
}];

const typeFréquence = ref<'manuelle' | 'dynamique' | 'fixe'>(isBrowser ? 'manuelle' : 'fixe');

const choixFréquenceFixe = ref(fréquence.value?.type === 'fixe' ? fréquence.value.détails.n.toString() : '1');
const choixFréquenceFixeNumérique = computed(()=> எண்ணிக்கை.எண்ணுக்கு({உரை: choixFréquenceFixe.value}));

const choixUnitéFréquenceFixe = ref<automatisation.fréquenceFixe['détails']['unités']>('jours');
const optionsUnitésFréquenceFixe: automatisation.fréquenceFixe['détails']['unités'][] = [
  'années',
  'mois',
  'semaines',
  'jours',
  'heures',
  'minutes',
  'secondes',
  'millisecondes',
];

const règleNumérique = (val: string) => {
  try {
    எண்ணிக்கை.எண்ணுக்கு({உரை: val});
    return true;
  } catch {
    return t('règles.numérique');
  }
};
const entier = (x: number): boolean => (x | 0) === x;
const règleEntierPositif = () => {
  return (choixFréquenceFixeNumérique.value !== undefined && choixFréquenceFixeNumérique.value > 0 && entier(choixFréquenceFixeNumérique.value)) ? true : t('règles.nombreEntierPositif');
};

watchEffect(()=>{
  switch (typeFréquence.value) {
    case 'manuelle':{
      const nouvelleFréquence: automatisation.fréquenceManuelle = {
        type: 'manuelle',
      };
      fréquence.value = nouvelleFréquence;
      break;
    };
    case 'dynamique':{
      const nouvelleFréquence: automatisation.fréquenceDynamique = {
        type: 'dynamique',
      };
      fréquence.value = nouvelleFréquence;
      break;
    };
    case 'fixe':{
      const nouvelleFréquence: automatisation.fréquenceFixe = {
        type: 'fixe',
        détails: {
          unités: choixUnitéFréquenceFixe.value,
          n: choixFréquenceFixeNumérique.value,
        },
      };
      fréquence.value = nouvelleFréquence;
      break;
    }
  
    default:
        break;
  }
});


</script>