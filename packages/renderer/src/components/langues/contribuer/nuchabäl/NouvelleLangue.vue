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
      :width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t('nuchabäl.langue.nouvelle.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="flat"
            size="small"
            @click="() => fermer()"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text style="overflow-y: auto">
        <v-timeline
          side="end"
          dot-color="primary"
          size="small"
          truncate-line="both"
          align="start"
        >
          <v-timeline-item>
            <p class="mb-2">{{ t('nuchabäl.langue.nouvelle.instructionÉchantillon') }}</p>
            <v-textarea
              v-model="propositionÉchantillon"
              :rows="3"
              clearable
              variant="outlined"
              @blur="texteÉchantillon = propositionÉchantillon"
              @keydown.enter="texteÉchantillon = propositionÉchantillon"
            ></v-textarea>
            <v-expand-transition>
              <div
                v-if="!propositionÉchantillon"
                class="text-end"
              >
                <v-btn
                  variant="outlined"
                  :append-icon="isRtl ? 'mdi-arrow-left' : 'mdi-arrow-right'"
                  @click="
                    () => {
                      texteÉchantillon = propositionÉchantillon;
                      sauterÉchantillon = true;
                    }
                  "
                >
                  {{ t('nuchabäl.langue.nouvelle.sauterÉchantillon') }}
                </v-btn>
              </div>
            </v-expand-transition>
          </v-timeline-item>
          <v-expand-transition>
            <v-timeline-item v-if="codeNuchabälLangueSelonTexteÉchantillon">
              <p>
                {{ t('nuchabäl.langue.nouvelle.instructionExistante', {nom: nomNuchabälLangueSelonTexteÉchantillon}) }}
              </p>
              <v-chip
                class="mt-2 mx-2"
                variant="outlined"
                label
                size="large"
                @click="() => utiliserSuggestionÉchantillonLangue()"
              >
                {{ t('nuchabäl.oui') }}
              </v-chip><v-chip
                class="mt-2 mx-2"
                :variant="suggestionLangueSelonÉchantillonIgnorée ? 'tonal' : 'outlined'"
                label
                size="large"
                :color="suggestionLangueSelonÉchantillonIgnorée ? 'primary' : undefined"
                @click="() => (ignorerSuggestionLangue = codeNuchabälLangueSelonTexteÉchantillon)"
              >
                {{ t('nuchabäl.non') }}
              </v-chip>
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item
              v-if="
                (!codeNuchabälLangueSelonTexteÉchantillon ||
                  suggestionLangueSelonÉchantillonIgnorée) &&
                  suggestionÉcriture
              "
            >
              {{ codeNuchabälLangueSelonTexteÉchantillon }}
              <p>
                {{ t('nuchabäl.langue.nouvelle.instructionÉcritureExistante', {nom: nomÉcritureProposée || suggestionÉcriture}) }}
              </p>
              <v-chip-group
                v-model="utiliserSuggestionÉcriture"
                selected-class="text-primary"
                mandatory
              >
                <v-chip
                  class="mt-2 mx-2"
                  label
                  size="large"
                  :value="true"
                >
                  {{ t('nuchabäl.oui') }}
                </v-chip><v-chip
                  class="mt-2 mx-2"
                  label
                  size="large"
                  :value="false"
                >
                  {{ t('nuchabäl.non') }}
                </v-chip>
              </v-chip-group>
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item
              v-if="
                sauterÉchantillon ||
                  utiliserSuggestionÉcriture === false ||
                  (!écritureInconnue && texteÉchantillon && !suggestionÉcriture)
              "
            >
              <p>{{ t('nuchabäl.langue.nouvelle.instructionÉcriture') }}</p>
              <selecteur-ecriture
                class="mt-2"
                @selectionnee="({code}) => (écriture = code)"
              />
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item v-if="écritureInconnue">
              <p>
                {{ t('nuchabäl.langue.nouvelle.instructionNouvelleÉcriture') }}
              </p>
              <nouvelle-ecriture @suggestion="({code}) => (écriture = code)">
                <template #activator="{props}">
                  <v-btn
                    v-bind="props"
                    class="mt-2 mx-2"
                    variant="outlined"
                  >
                    {{ t('nuchabäl.écriture.nouvelle.btn') }}
                  </v-btn>
                </template>
              </nouvelle-ecriture>
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item v-if="écriture">
              {{ t('nuchabäl.langue.nouvelle.instructionNom') }}
              <v-text-field
                v-model="propositionNomLangue"
                variant="outlined"
                class="mt-2"
                :hint="t('nuchabäl.langue.nouvelle.indiceNom')"
                :rules="[règleÉcritureNomLangue]"
                @blur="() => (nomLangue = propositionNomLangue)"
                @keydown.enter="() => (nomLangue = propositionNomLangue)"
              ></v-text-field>
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item v-if="nomLangue">
              {{ t('nuchabäl.langue.nouvelle.instructionCode') }}
              <v-text-field
                v-model="propositionCodeLangue"
                variant="outlined"
                class="mt-2"
                :rules="[règleÉcritureCodeLangue, règleCodeLangueUnique, règleCodeLangueCourt]"
                @blur="() => (codeLangue = propositionCodeLangue)"
                @keydown.enter="() => (codeLangue = propositionCodeLangue)"
              ></v-text-field>
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item v-if="codeLangue">
              {{ t('nuchabäl.langue.nouvelle.instructionNumération') }}
              <v-autocomplete
                v-model="numération"
                :items="எண்ணுரு_முறைமைகள்"
                :label="t('nuchabäl.numération')"
                variant="outlined"
                density="compact"
                hide-details
                prepend-icon="mdi-abacus"
              >
                <template #selection="{item}">
                  <JetonNumeration :code="item.value" />
                </template>
                <template #item="{props, item}">
                  <ItemNumeration
                    v-bind="props"
                    :code="item.value"
                  />
                </template>
                <template #append>
                  <nouvelle-numeration @suggestion="({système}) => (numération = système)">
                    <template #activator="{props: propsActivateur}">
                      <v-icon
                        v-bind="propsActivateur"
                        icon="mdi-plus"
                      />
                    </template>
                  </nouvelle-numeration>
                </template>
              </v-autocomplete>
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item v-if="codeLangue && numération">
              <p class="mb-2">
                {{ t('nuchabäl.langue.nouvelle.instructionCodes') }}
              </p>
              <v-text-field
                v-model="codeGl"
                variant="outlined"
                density="compact"
              >
                <template #prepend> {{ t('nuchabäl.écriture.codes.gl') }} </template>
                <template #append>
                  <v-icon
                    v-if="urlRechercheGlottologue"
                    icon="mdi-open-in-new"
                    @click="ouvrirLien(urlRechercheGlottologue)"
                  />
                </template>
              </v-text-field>
              <v-text-field
                v-model="codeI1"
                variant="outlined"
                density="compact"
              >
                <template #prepend> {{ t('nuchabäl.écriture.codes.i1') }}</template>
                <template #append>
                  <v-icon
                    v-if="urlRechercheISO6391"
                    icon="mdi-open-in-new"
                    @click="ouvrirLien(urlRechercheISO6391)"
                  />
                </template>
              </v-text-field>
              <v-text-field
                v-model="codeI2"
                variant="outlined"
                density="compact"
              >
                <template #prepend>{{ t('nuchabäl.écriture.codes.i2') }} </template>
                <template #append>
                  <v-icon
                    v-if="urlRechercheISO6392"
                    icon="mdi-open-in-new"
                    @click="ouvrirLien(urlRechercheISO6392)"
                  />
                </template>
              </v-text-field>
              <v-text-field
                v-model="codeI3"
                variant="outlined"
                density="compact"
              >
                <template #prepend> {{ t('nuchabäl.écriture.codes.i3') }} </template>
                <template #append>
                  <v-icon
                    v-if="urlRechercheISO6393"
                    icon="mdi-open-in-new"
                    @click="ouvrirLien(urlRechercheISO6393)"
                  />
                </template>
              </v-text-field>
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item v-if="prêtÀSuggérer">
              <p>{{ t('nuchabäl.langue.nouvelle.instructionConfirmation', {nom: nomLangue}) }}</p>
              <v-btn
                class="mt-2"
                variant="outlined"
                :loading="suggestionEnCours"
                :text="t('nuchabäl.langue.nouvelle.btnAjout')"
                @click="() => créerSuggestion()"
              />
            </v-timeline-item>
          </v-expand-transition>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {type Ref, computed, ref, watchEffect, watch} from 'vue';
import {useDisplay, useRtl} from 'vuetify';
import {suivre} from '@constl/vue';

import {எண்களைப்_பயன்படுத்து, கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import {détecterLangue, utiliserNuchabäl} from '/@/components/utils';
import type {types} from '@constl/ipa';
import NouvelleEcriture from './NouvelleÉcriture.vue';
import SelecteurEcriture from '/@/components/langues/SélecteurÉcriture.vue';
import ItemNumeration from '/@/components/langues/ItemNumération.vue';
import JetonNumeration from '/@/components/langues/JetonNumération.vue';
import NouvelleNumeration from '../ennikkai/NouvelleNumération.vue';

import {ouvrirLien} from '/@/utils';

const nuchabäl = utiliserNuchabäl();

const émettre = defineEmits<{
  (e: 'suggestion', args: {code: string}): void;
}>();

const {எண்ணுரு_முறைமைகள்} = எண்களைப்_பயன்படுத்து();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {mdAndUp} = useDisplay();
const {isRtl} = useRtl();

// Navigation
const dialogue = ref(false);

// Texte échantillon
const propositionÉchantillon = ref<string>();
const texteÉchantillon = ref<string>();
const sauterÉchantillon = ref(false);

watchEffect(() => {
  if (!propositionÉchantillon.value) texteÉchantillon.value = undefined;
});
watchEffect(() => {
  if (propositionÉchantillon.value) sauterÉchantillon.value = false;
});

const codeIsoLangueSelonTexteÉchantillon = ref<string>();
watchEffect(async () => {
  if (texteÉchantillon.value) {
    const détecté = await détecterLangue({texte: texteÉchantillon.value});
    if (détecté) codeIsoLangueSelonTexteÉchantillon.value = détecté;
    return;
  }
  codeIsoLangueSelonTexteÉchantillon.value = undefined;
});

const nomNuchabälLangueSelonTexteÉchantillon = suivre(
  async ({
    runuk,
    runukulem,
    f,
  }: {
    runuk: string;
    runukulem: string;
    f: types.schémaFonctionSuivi<string | undefined>;
  }) => {
    const fRetour = nuchabäl.tatzeqelbejRubiChabäl({runuk, runukulem, sm: f});
    return async () => fRetour();
  },
  {runuk: codeIsoLangueSelonTexteÉchantillon, runukulem: 'iso'},
);

const codeNuchabälLangueSelonTexteÉchantillon = suivre(
  async ({chabäl, f}: {chabäl: string; f: types.schémaFonctionSuivi<string | undefined>}) => {
    const fRetour = nuchabäl.tatzeqelbejRunukChabäl({chabäl, sm: f});
    return async () => fRetour();
  },
  {chabäl: nomNuchabälLangueSelonTexteÉchantillon},
);

const ignorerSuggestionLangue = ref<string>();
const suggestionLangueSelonÉchantillonIgnorée = computed(() => {
  return (
    codeNuchabälLangueSelonTexteÉchantillon.value &&
    codeNuchabälLangueSelonTexteÉchantillon.value === ignorerSuggestionLangue.value
  );
});

const utiliserSuggestionÉchantillonLangue = () => {
  const code = codeNuchabälLangueSelonTexteÉchantillon.value;
  if (!code) return;
  suggérer({code});
};

// Écriture
const écriture = ref<string>();
watch(propositionÉchantillon, () => {
  écriture.value = undefined;
});

const suggestionÉcriture = computed(() => {
  if (!texteÉchantillon.value) return;
  const écrituresDisponibles = nuchabäl.konojelTzibanem;

  let proposition: string | undefined = undefined;
  let nMax = 0;
  for (const écr of écrituresDisponibles) {
    const exprégÉcriture = nuchabäl.rutzibTzibanem({runuk: écr});
    if (!exprégÉcriture) continue;
    const correspondance = texteÉchantillon.value.match(new RegExp(exprégÉcriture, 'g'));
    if (correspondance && écr.length > nMax) {
      proposition = écr;
      nMax = écr.length;
    }
  }
  return proposition;
});

const écritureInconnue = computed(() => {
  return texteÉchantillon.value && !suggestionÉcriture.value;
});

const utiliserSuggestionÉcriture = ref<boolean>();
watchEffect(() => {
  if (utiliserSuggestionÉcriture.value) {
    écriture.value = suggestionÉcriture.value;
  } else if (utiliserSuggestionÉcriture.value === false) {
    écriture.value = undefined;
  }
});

watch(propositionÉchantillon, () => {
  utiliserSuggestionÉcriture.value = undefined;
});

const nomÉcritureProposée = suivre(
  async ({runuk, f}: {runuk: string; f: types.schémaFonctionSuivi<string | undefined>}) => {
    const fRetour = nuchabäl.tatzeqelbejRubiTzibanem({runuk, sm: f});
    return async () => fRetour();
  },
  {runuk: suggestionÉcriture},
);

const nomÉcriture = suivre(
  async ({runuk, f}: {runuk: string; f: types.schémaFonctionSuivi<string | undefined>}) => {
    const fRetour = nuchabäl.tatzeqelbejRubiTzibanem({runuk, sm: f});
    return async () => fRetour();
  },
  {runuk: écriture},
);

// Nom langue
const propositionNomLangue = ref<string>();
const nomLangue = ref<string>();
watch(texteÉchantillon, () => {
  propositionNomLangue.value = undefined;
});
watch(écriture, () => {
  propositionNomLangue.value = undefined;
});
watchEffect(() => {
  if (!propositionNomLangue.value) nomLangue.value = undefined;
});

// Code langue
const propositionCodeLangue = ref<string>();
const codeLangue = ref<string>();
watch(propositionNomLangue, () => {
  propositionCodeLangue.value = undefined;
});
watchEffect(() => {
  if (!propositionCodeLangue.value) codeLangue.value = undefined;
});
const règleCodeLangueUnique = computed<string | true>(() => {
  const codesExistants = nuchabäl.konojelChabäl;
  if (propositionCodeLangue.value && codesExistants.includes(propositionCodeLangue.value)) {
    const nomLangueExistante = nuchabäl.rubiChabäl({runuk: propositionCodeLangue.value});
    return t('nuchabäl.langue.nouvelle.erreurCodeExistant', {langue: nomLangueExistante});
  }
  return true;
});
const règleCodeLangueCourt = computed<string | true>(() => {
  if (propositionCodeLangue.value && [...propositionCodeLangue.value].length > 5) {
    return t('nuchabäl.langue.nouvelle.erreurCodeTropLong');
  }
  return true;
});

// Numération
const numération = ref<string>();
watchEffect(() => {
  if (écriture.value) {
    numération.value = nuchabäl.rajilanïkTzibanem({runuk: écriture.value});
  } else {
    numération.value = undefined;
  }
});

// Codes ISO et Glottologue
const codeGl = ref<string>();
const codeI1 = ref<string>();
const codeI2 = ref<string>();
const codeI3 = ref<string>();

const urlRechercheGlottologue = ref<string>();
const urlRechercheISO6391 = ref<string>(
  'https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-1  ',
);
const urlRechercheISO6392 = ref<string>('https://fr.wikipedia.org/wiki/Liste_des_codes_ISO_639-2');
const urlRechercheISO6393 = ref<string>('https://iso639-3.sil.org/code_tables/639/data');
watchEffect(() => {
  if (nomLangue.value) {
    urlRechercheGlottologue.value = `https://glottolog.org/glottolog?name=${nomLangue.value}&namequerytype=part&multilingual=on`;
  } else {
    urlRechercheGlottologue.value = undefined;
  }
});

// Règles
const génRègleÉcriture = (texte: Ref<string | undefined>) =>
  computed<string | true>(() => {
    if (!écriture.value || !texte.value) return true;
    const exprégÉcriture = nuchabäl.rutzibTzibanem({runuk: écriture.value});
    if (!exprégÉcriture) return true;
    const erreurLangue = !texte.value.match(new RegExp(exprégÉcriture, 'g'));

    return erreurLangue ? t('nuchabäl.langue.nouvelle.erreurÉcriture', {écriture: nomÉcriture.value}) : true;
  });
const règleÉcritureNomLangue = génRègleÉcriture(propositionNomLangue);
const règleÉcritureCodeLangue = génRègleÉcriture(propositionCodeLangue);

// Suggestion
const suggestionEnCours = ref(false);
const prêtÀSuggérer = computed(() => {
  if (codeLangue.value && nomLangue.value && écriture.value && numération.value)
    return {
      code: codeLangue.value,
      nom: nomLangue.value,
      écriture: écriture.value,
      numération: numération.value,
      codeGl: codeGl.value,
      codeI1: codeI1.value,
      codeI2: codeI2.value,
      codeI3: codeI3.value,
    };
  return undefined;
});
const créerSuggestion = async () => {
  const vals = prêtÀSuggérer.value;
  if (!vals) return;
  await nuchabäl.tachilabejChabäl({
    rubiChabäl: vals.nom,
    runukChabäl: vals.code,
    rutzibanemChabäl: vals.écriture,
    rajilanïkChabäl: vals.numération,
    gl: vals.codeGl,
    i1: vals.codeI1,
    i2: vals.codeI2,
    i3: vals.codeI3,
  });
  suggérer({code: vals.code});
};
const suggérer = ({code}: {code: string}) => {
  émettre('suggestion', {code});
  fermer();
};
const fermer = () => {
  dialogue.value = false;

  propositionÉchantillon.value = undefined;
  texteÉchantillon.value = undefined;

  suggestionEnCours.value = false;
};
</script>
