<template>
  <v-dialog
    v-model="dialogue"
    scrollable
    max-width="500"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>

    <v-card>
      <v-card-title class="d-flex">
        {{ t('licences.carte.titre') }}
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="flat"
          size="small"
          @click="dialogue = false"
        />
      </v-card-title>
      <v-divider />

      <v-card-text>
        <v-select
          v-model="licenceChoisie"
          :items="licencesDispos"
          variant="outlined"
          density="compact"
          :disabled="!permissionModifier"
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

        <p class="mt-3 mb-0">
          <v-alert
            :text="t('licences.avertissement')"
            type="warning"
            variant="outlined"
            density="compact"
          >
            <div>
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
          </v-alert>
        </p>

        <v-divider />

        <p class="mb-0 text-overline">{{ t('licences.droits.sousTitre') }}</p>
        <v-progress-circular
          v-if="!droits"
          indeterminate
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
        <p class="mb-0 text-overline">
          {{ t('licences.conditions.sousTitre') }}
        </p>
        <v-progress-circular
          v-if="!conditions"
          indeterminate
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
        <p class="mb-0 text-overline">
          {{ t('licences.limitations.sousTitre') }}
        </p>
        <v-progress-circular
          v-if="!limitations"
          indeterminate
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
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
          <v-icon end>mdi-close</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          variant="outlined"
          :disabled="!licenceChangée"
          @click="sauvegarderLicence"
        >
          {{ t('communs.sauvegarder') }}
          <v-icon end>mdi-check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type {client} from '@constl/ipa';
import type {licences} from '@constl/ipa';

import {computed, inject, ref, watchEffect} from 'vue';

import JetonDroit from './JetonDroitLicence.vue';
import JetonLimitation from './JetonLimitationLicence.vue';
import JetonCondition from './JetonConditionLicence.vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {ouvrirLien} from '/@/utils';
import {enregistrerÉcoute} from '/@/components/utils';

const props = defineProps({
  licence: {type: String, required: false},
  permissionModifier: {default: false, type: Boolean},
});
const émettre = defineEmits<{
  (é: 'changerLicence', licence: string): void;
}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Dialogue
const dialogue = ref(false);

// Changement licence
const licenceChoisie = ref(props.licence);
watchEffect(() => {
  licenceChoisie.value = props.licence;
});
const licenceChangée = computed(() => licenceChoisie.value !== props.licence);

// Caractéristiques licences
const infoLicences = ref<{[clef: string]: licences.InfoLicence}>();
enregistrerÉcoute(
  constl?.suivreLicences({
    f: x => (infoLicences.value = x),
  }),
);
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
const sauvegarderLicence = () => {
  if (licenceChoisie.value) {
    émettre('changerLicence', licenceChoisie.value);
  }
  dialogue.value = false;
};
const fermer = () => {
  dialogue.value = false;
  licenceChoisie.value = props.licence;
};
</script>
