<template>
  <v-select
    v-model="licenceChoisie"
    :items="licencesDispos"
    variant="outlined"
    density="compact"
    :readonly="!permissionModifier"
  >
    <template #item="{item, props: propsItemListeLicences}">
      <v-list-item v-bind="propsItemListeLicences">
        <template #title>
          <v-list-item-title :class="{'font-weight-bold': item.value === licenceChoisie}">
            {{ obtNomLicence(item.value) }}
          </v-list-item-title>
        </template>
        <template #subtitle>{{ obtAbrLicence(item.value) }}</template>
      </v-list-item>
    </template>
    <template #selection="{item}">
      {{ obtAbrLicence(item.value) }}
    </template>
  </v-select>
  <span v-if="licence">
    <v-alert
      class="mb-3"
      type="warning"
      variant="outlined"
      density="compact"
    >
      <template #title>
        {{ t('licences.titreAvertissement') }}
        <v-spacer />
        <v-btn
          :icon="détailsAvertissement ? 'mdi-chevron-up' : 'mdi-chevron-down'"
          size="xsmall"
          variant="flat"
          @click="() => (détailsAvertissement = !détailsAvertissement)"
        ></v-btn>
      </template>

      <template #text>
        <v-expand-transition>
          <div v-show="détailsAvertissement">
            <p>
              {{ t('licences.avertissement') }}
            </p>
            <v-btn
              class="mx-auto my-3"
              variant="outlined"
              size="small"
              :disabled="!obtLienLicence(licence)"
              @click="ouvrirLienLicence(licence)"
            >
              <v-icon start>mdi-scale-balance</v-icon>
              <div v-if="obtLienLicence(licence)">
                {{ t('licences.lire') }}
                <v-icon end>mdi-open-in-new</v-icon>
              </div>
              <div v-else>{{ t('licences.aucunLien') }}</div>
            </v-btn>
          </div>
        </v-expand-transition>
      </template>
    </v-alert>
    <v-divider />

    <p class="mt-2 mb-0 text-h6">{{ t('licences.droits.sousTitre') }}</p>
    <v-skeleton-loader
      v-if="!droits"
      type="chip@3"
    />
    <p
      v-else-if="!droits.length"
      class="text--disabled"
    >
      {{ t('licences.droits.aucune') }}
    </p>
    <jeton-droit
      v-for="d in droits"
      :key="d"
      :droit="d"
    />
    <p class="mt-2 mb-0 text-h6">
      {{ t('licences.conditions.sousTitre') }}
    </p>
    <v-skeleton-loader
      v-if="!conditions"
      type="chip@3"
    />
    <p
      v-else-if="!conditions.length"
      class="text--disabled"
    >
      {{ t('licences.conditions.aucune') }}
    </p>
    <jeton-condition
      v-for="c in conditions"
      :key="c"
      :condition="c"
    />
    <p class="mt-2 mb-0 text-h6">
      {{ t('licences.limitations.sousTitre') }}
    </p>
    <v-skeleton-loader
      v-if="!limitations"
      type="chip@3"
    />
    <p
      v-else-if="!limitations.length"
      class="text--disabled"
    >
      {{ t('licences.limitations.aucune') }}
    </p>
    <jeton-limitation
      v-for="l in limitations"
      :key="l"
      :limitation="l"
    />
  </span>
  <h2
    v-else
    class="mb-2 text-center text-disabled"
  >
    {{ permissionModifier ? t('licences.choisir') : t('licences.aucune') }}
  </h2>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed, ref, watchEffect} from 'vue';

import JetonCondition from './JetonConditionLicence.vue';
import JetonDroit from './JetonDroitLicence.vue';
import JetonLimitation from './JetonLimitationLicence.vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '/@/components/utils';
import {ouvrirLien} from '/@/utils';

const props = defineProps({
  licence: {type: String, required: false, default: undefined},
  permissionModifier: {default: false, type: Boolean},
});
const émettre = defineEmits<{
  (é: 'changerLicence', licence?: string): void;
}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Avertissement
const détailsAvertissement = ref(false);

// Changement licence
const licenceChoisie = ref(props.licence);
watchEffect(() => {
  licenceChoisie.value = props.licence;
});

// Caractéristiques licences
const infoLicences = suivre(constl.licences.suivreLicences);
const licencesDispos = computed<string[]>(() => {
  return infoLicences.value ? Object.keys(infoLicences.value) : [];
});
const droits = computed(() => {
  return licenceChoisie.value ? infoLicences.value?.[licenceChoisie.value]?.droits : undefined;
});
const conditions = computed(() => {
  return licenceChoisie.value ? infoLicences.value?.[licenceChoisie.value]?.conditions : undefined;
});
const limitations = computed(() => {
  return licenceChoisie.value ? infoLicences.value?.[licenceChoisie.value]?.limitations : undefined;
});

const obtNomLicence = (l?: string): string => {
  return t(`licences.info.${l || 'introuvable'}.nom`);
};
const obtAbrLicence = (l?: string): string => {
  return t(`licences.info.${l || 'introuvable'}.abr`);
};
const obtLienLicence = (l?: string): string | undefined => {
  if (!l) return undefined;
  const clefLien = `licences.info.${l}.lien`;
  const lien = t(clefLien);
  if (lien !== clefLien) return lien;
};
const ouvrirLienLicence = (l?: string) => {
  const lien = obtLienLicence(l);
  if (lien) ouvrirLien(lien);
};

// Sauvegarder
watchEffect(() => {
  if (licenceChoisie.value !== props.licence) {
    émettre('changerLicence', licenceChoisie.value);
  }
});
</script>
