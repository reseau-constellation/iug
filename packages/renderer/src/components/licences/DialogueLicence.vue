<template>
  <v-dialog
    v-model="dialogue"
    scrollable
    max-width="400"
  >
    <template #activator="{props: propsActivateur}">
      <slot v-bind="{propsActivateur}"></slot>
    </template>

    <v-card>
      <v-card-title class="headline">
        {{ obtNomLicence(licenceChoisie) }}
        <v-menu
          v-if="permissionModifier"
          transition="slide-y-transition"
          bottom
          offset-x
          min-width="225"
        >
          <template #activator="{props: propsMenu}">
            <v-btn
              v-bind="propsMenu"
              class="mx-2"
              icon="mdi-pencil"
              size="small"
            />
          </template>
          <v-list
            class="overflow-y-auto"
            style="max-height: 300px"
          >
            <v-list-item
              v-for="l in licences"
              :key="l"
              @click="licenceChoisie = l"
            >
              <v-list-item-avatar>
                <v-icon v-if="l === licence">mdi-check</v-icon>
              </v-list-item-avatar>
              <v-list-item-content :class="{'font-weight-bold': l === licence}">
                {{ obtNomLicence(l) }}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-divider />

      <v-card-text>
        <p class="mt-3 mb-0">
          <v-icon small>mdi-alert-circle-outline</v-icon>
          {{ t('licences.avertissement') }}
        </p>
        <div class="text-center">
          <v-btn
            class="mx-auto my-3"
            outlined
            small
            :disabled="!obtLienLicence(licence)"
            @click="ouvrirLienLicence(licence)"
          >
            <v-icon left>mdi-scale-balance</v-icon>
            <div v-if="obtLienLicence(licence)">
              {{ t('licences.lire') }}
              <v-icon right>mdi-open-in-new</v-icon>
            </div>
            <div v-else>{{ t('licences.aucunLien') }}</div>
          </v-btn>
        </div>
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
          outlined
          small
          label
          class="ma-1 my-1"
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
          outlined
          small
          label
          class="ma-1 my-1"
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
          outlined
          small
          label
          class="ma-1 my-1"
        />
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          variant="outlined"
          @click="sauvegarderLicence"
        >
          {{ t('communs.sauvegarder') }}
        </v-btn>
        <v-btn
          color="secondary"
          text
          variant="outlined"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import {computed, inject, ref, watchEffect} from 'vue';

import JetonDroit from './JetonDroitLicence.vue';
import JetonLimitation from './JetonLimitationLicence.vue';
import JetonCondition from './JetonConditionLicence.vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import type {InfoLicence} from '@constl/ipa/dist/src/licences';
import {ouvrirLien} from '/@/utils';
import {enregistrerÉcoute} from '/@/composables/utils';

const props = defineProps({
  licence: {type: String, required: true},
  permissionModifier: {default: false, type: Boolean},
});
const émettre = defineEmits<{
  (é: 'changerLicence', licence: string): void;
}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Dialogue
const dialogue = ref(false);

// Changement licence
const licenceChoisie = ref(props.licence);
watchEffect(() => {
  licenceChoisie.value = props.licence;
});

// Caractéristiques licences
const infoLicences = ref<{[clef: string]: InfoLicence}>();
enregistrerÉcoute(
  constl?.suivreLicences({
    f: x => (infoLicences.value = x),
  }),
);
const licences = computed<string[]>(() => {
  return infoLicences.value ? Object.keys(infoLicences.value) : [];
});
const droits = computed(() => {
  return infoLicences.value?.[licenceChoisie.value]?.droits;
});
const conditions = computed(() => {
  return infoLicences.value?.[licenceChoisie.value]?.conditions;
});
const limitations = computed(() => {
  return infoLicences.value?.[licenceChoisie.value]?.limitations;
});

const obtNomLicence = (l: string): string => {
  return t(`licences.info.${l || 'introuvable'}.nom`);
};
const obtLienLicence = (l: string): string | undefined => {
  const clefLien = `licences.info.${l}.lien`;
  const lien = t(clefLien);
  if (lien !== clefLien) return lien;
};
const ouvrirLienLicence = (l: string) => {
  const lien = obtLienLicence(l);
  if (lien) ouvrirLien(lien);
};

// Sauvegarder
const sauvegarderLicence = () => {
  émettre('changerLicence', licenceChoisie.value);
  dialogue.value = false;
};
const fermer = () => {
  dialogue.value = false;
  licenceChoisie.value = props.licence;
};
</script>
