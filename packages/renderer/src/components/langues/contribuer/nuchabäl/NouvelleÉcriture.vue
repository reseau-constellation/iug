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
          {{ t('nuchabäl.écriture.nouvelle.titre') }}
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
            <p class="mb-2">
              {{ t('nuchabäl.écriture.nouvelle.instructionsÉchantillon') }}
            </p>
            <v-textarea
              v-model="propositionÉchantillon"
              :rows="3"
              clearable
              variant="outlined"
              @blur="texteÉchantillon = propositionÉchantillon"
              @keydown.enter="texteÉchantillon = propositionÉchantillon"
            ></v-textarea>
          </v-timeline-item>
          <v-slide-y-transition>
            <v-timeline-item v-if="codeÉcritureSelonÉchantillon">
              <p>
                {{
                  t('nuchabäl.écriture.nouvelle.instructionsDupliquée', {
                    nom: nomÉcritureSelonÉchantillon,
                  })
                }}
              </p>
              <v-chip
                class="mt-2 mx-2"
                variant="outlined"
                label
                size="large"
                @click="() => utiliserSuggestionÉchantillon()"
              >
                {{ t('nuchabäl.oui') }}
              </v-chip>
              <v-chip
                class="mt-2 mx-2"
                :variant="suggestionÉcritureSelonÉchantillonIgnorée ? 'tonal' : 'outlined'"
                label
                size="large"
                :color="suggestionÉcritureSelonÉchantillonIgnorée ? 'primary' : undefined"
                @click="() => (ignorerSuggestionÉcriture = codeÉcritureSelonÉchantillon)"
              >
                {{ t('nuchabäl.non') }}
              </v-chip>
            </v-timeline-item>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-timeline-item v-if="onDoitSpécifierDirection && texteÉchantillon">
              {{ t('nuchabäl.écriture.nouvelle.instructionsDirection') }}
              <v-item-group selected-class="bg-primary">
                <v-container>
                  <v-row>
                    <v-col
                      v-for="dir in ['horizontal-tb', 'vertical-rl', 'vertical-lr'] as const"
                      :key="dir"
                      :cols="6"
                      class="d-flex flex-wrap pa-1"
                    >
                      <v-item v-slot="{selectedClass, toggle}">
                        <v-locale-provider :rtl="dir.includes('rl')">
                          <v-card
                            :class="['pa-4', selectedClass]"
                            height="200"
                            width="200"
                            dark
                            @click="
                              () => {
                                toggle?.();
                                choixDirection = dir;
                              }
                            "
                          >
                            <div
                              :style="{'writing-mode': dir}"
                              dir="auto"
                            >
                              {{ couper(texteÉchantillon, 100, t('communs.troisPetitsPoints')) }}
                            </div>
                          </v-card>
                        </v-locale-provider>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-container>
              </v-item-group>
            </v-timeline-item>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-timeline-item v-if="direction">
              {{ t('nuchabäl.écriture.nouvelle.instructionsNom') }}
              <v-text-field
                v-model="propositionNomÉcriture"
                variant="outlined"
                class="mt-2"
                :hint="t('nuchabäl.écriture.nouvelle.indiceNom')"
                @blur="() => (nomÉcriture = propositionNomÉcriture)"
                @keydown.enter="() => (nomÉcriture = propositionNomÉcriture)"
              ></v-text-field>
            </v-timeline-item>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-timeline-item v-if="nomÉcriture">
              {{ t('nuchabäl.écriture.nouvelle.instructionsCode') }}
              <v-text-field
                v-model="propositionCodeÉcriture"
                variant="outlined"
                class="mt-2"
                :rules="[règleCodeÉcritureUnique, règleCodeÉcritureCourt]"
                @blur="() => (codeÉcriture = propositionCodeÉcriture)"
                @keydown.enter="() => (codeÉcriture = propositionCodeÉcriture)"
              ></v-text-field>
            </v-timeline-item>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-timeline-item v-if="codeÉcriture">
              {{ t('nuchabäl.écriture.nouvelle.instructionsNumération') }}
              <v-autocomplete
                v-model="numération"
                :items="எண்ணுரு_முறைமைகள்"
                :label="t('nuchabäl.numération')"
                variant="outlined"
                density="compact"
                hide-details
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
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-timeline-item v-if="numération">
              <p>{{ t('nuchabäl.écriture.nouvelle.instructionsExpré') }}</p>
              <v-btn
                class="my-2"
                variant="outlined"
                append-icon="mdi-open-in-new"
                :text="t('nuchabäl.écriture.nouvelle.btnExpré')"
                @click="() => ouvrirLien(urlAideExpré)"
              ></v-btn>
              <v-text-field
                v-model="expré"
                class="mt-2"
                :label="t('nuchabäl.expré')"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-timeline-item>
          </v-slide-y-transition>
          <v-slide-y-transition>
            <v-timeline-item v-if="prêtÀSuggérer">
              <p> {{ t('nuchabäl.écriture.nouvelle.confirmation', {nom: nomÉcriture}) }}</p>
              <v-btn
                class="mt-2"
                variant="outlined"
                :loading="suggestionEnCours"
                :text="t('nuchabäl.écriture.nouvelle.btnCréation')"
                @click="() => créerSuggestion()"
              />
            </v-timeline-item>
          </v-slide-y-transition>
        </v-timeline>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {computed, ref, watch, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import type {types} from '@constl/ipa';
import {எண்களைப்_பயன்படுத்து, கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {direction as détecterDirection} from 'direction';
import {utiliserNuchabäl} from '/@/components/utils';
import {couper, ouvrirLien} from '/@/utils';

import ItemNumeration from '/@/components/langues/ItemNumération.vue';
import JetonNumeration from '/@/components/langues/JetonNumération.vue';
import NouvelleNumeration from '/@/components/langues/contribuer/ennikkai/NouvelleNumération.vue';
const émettre = defineEmits<{
  (e: 'suggestion', args: {code: string}): void;
}>();

const nuchabäl = utiliserNuchabäl();
const {mdAndUp} = useDisplay();

const {எண்ணுரு_முறைமைகள்} = எண்களைப்_பயன்படுத்து();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

// Texte échantillon
const propositionÉchantillon = ref<string>();
const texteÉchantillon = ref<string>();

watchEffect(() => {
  if (!propositionÉchantillon.value?.length) texteÉchantillon.value = undefined;
});

// Code
const codeÉcritureSelonÉchantillon = computed(() => {
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

const nomÉcritureSelonÉchantillon = suivre(
  async ({runuk, f}: {runuk: string; f: types.schémaFonctionSuivi<string | undefined>}) => {
    const fRetour = nuchabäl.tatzeqelbejRubiTzibanem({runuk, sm: f});
    return async () => fRetour();
  },
  {runuk: codeÉcritureSelonÉchantillon},
);

const ignorerSuggestionÉcriture = ref<string>();
const suggestionÉcritureSelonÉchantillonIgnorée = computed(() => {
  return (
    codeÉcritureSelonÉchantillon.value &&
    codeÉcritureSelonÉchantillon.value === ignorerSuggestionÉcriture.value
  );
});

const utiliserSuggestionÉchantillon = () => {
  const code = codeÉcritureSelonÉchantillon.value;
  if (!code) return;
  suggérer({code});
};

// Nom langue
const propositionNomÉcriture = ref<string>();
const nomÉcriture = ref<string>();
watch(texteÉchantillon, () => {
  propositionNomÉcriture.value = undefined;
});
watchEffect(() => {
  if (!propositionNomÉcriture.value) nomÉcriture.value = undefined;
});

// Code écriture
const propositionCodeÉcriture = ref<string>();
const codeÉcriture = ref<string>();
watch(propositionNomÉcriture, () => {
  propositionCodeÉcriture.value = undefined;
});
watchEffect(() => {
  if (!propositionCodeÉcriture.value) codeÉcriture.value = undefined;
});

const règleCodeÉcritureUnique = computed<string | true>(() => {
  const codesExistants = nuchabäl.konojelTzibanem;
  if (propositionCodeÉcriture.value && codesExistants.includes(propositionCodeÉcriture.value)) {
    const nomÉcritureExistante = nuchabäl.rubiTzibanem({runuk: propositionCodeÉcriture.value});
    return t('nuchabäl.écriture.nouvelle.erreurCodeÉcritureExistant', {nom: nomÉcritureExistante});
  }
  return true;
});

const règleCodeÉcritureCourt = computed<string | true>(() => {
  if (propositionCodeÉcriture.value && [...propositionCodeÉcriture.value].length > 5) {
    return t('nuchabäl.écriture.nouvelle.erreurCodeTropLong');
  }
  return true;
});

// Direction
const choixDirection = ref<'horizontal-tb' | 'vertical-rl' | 'vertical-lr'>();
const direction = computed(() => {
  if (!choixDirection.value || !texteÉchantillon.value) return;
  const premierSûr = [...texteÉchantillon.value].find(c => détecterDirection(c) !== 'neutral');
  if (!premierSûr) return;
  const dàg = détecterDirection(premierSûr);
  switch (choixDirection.value) {
    case 'horizontal-tb':
      return dàg ? '←↓' : '→↓';

    case 'vertical-rl':
      return dàg ? '↓←' : '↑→';

    case 'vertical-lr':
      return dàg ? '↓→' : '↑←';

    default:
      return undefined;
  }
});
const onDoitSpécifierDirection = computed(
  () =>
    !codeÉcritureSelonÉchantillon.value ||
    ignorerSuggestionÉcriture.value === codeÉcritureSelonÉchantillon.value,
);

// Numération
const numération = ref<string>();
watchEffect(() => {
  if (codeÉcriture.value) {
    numération.value = nuchabäl.rajilanïkTzibanem({runuk: codeÉcriture.value});
  } else {
    numération.value = undefined;
  }
});

// Expré
const expré = ref<string>();
const urlAideExpré = ref('https://github.com/node-unicode/unicode-15.0.0/tree/main/Script');

// Suggestion
const suggestionEnCours = ref(false);
const prêtÀSuggérer = computed(() => {
  if (codeÉcriture.value && nomÉcriture.value && numération.value && direction.value && expré.value)
    return {
      code: codeÉcriture.value,
      nom: nomÉcriture.value,
      numération: numération.value,
      direction: direction.value,
      expré: expré.value,
    };
  return undefined;
});
const créerSuggestion = async () => {
  const vals = prêtÀSuggérer.value;
  if (!vals) return;
  suggestionEnCours.value = true;
  await nuchabäl.tachilabejTzibanem({
    runukTzib: vals.code,
    rajilanïkTzib: vals.numération,
    rubiTzib: vals.nom,
    rucholanemTzib: vals.direction,
    rutzibTzib: vals.expré,
  });
  suggérer({code: vals.code});
  fermer();
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
