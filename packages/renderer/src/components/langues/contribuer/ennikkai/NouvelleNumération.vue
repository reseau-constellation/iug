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
          {{ t('ennikkai.nouvelle.titre') }}
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
            {{ t('ennikkai.nouvelle.instructionNom') }}
            <v-text-field
              v-model="nom"
              :label="t('ennikkai.nouvelle.étiquetteNom')"
              :hint="t('ennikkai.nouvelle.indiceNom')"
              :rules="[règleNomUnique]"
              class="py-2"
              variant="outlined"
            />
          </v-timeline-item>
          <v-expand-transition>
            <v-timeline-item v-if="nom">
              {{ t('ennikkai.nouvelle.instructionType') }}
              <v-select
                v-model="typeSystème"
                :items="[
                  {value: 'இடஞ்சார்', title: t('ennikkai.type.இடஞ்சார்')},
                  {value: 'அடிமானம்', title: t('ennikkai.type.அடிமானம்')},
                ]"
                :label="t('ennikkai.nouvelle.étiquetteTypeSystème')"
                class="py-2"
                variant="outlined"
              />
            </v-timeline-item>
          </v-expand-transition>

          <v-expand-transition>
            <v-timeline-item v-if="nom && typeSystème">
              {{ t('ennikkai.nouvelle.instructionSymboles') }}
              <v-text-field
                v-model="symboles"
                :label="t('ennikkai.nouvelle.étiquetteSymboles')"
                :rules="[règleSymbolesUniques]"
                class="py-2"
                variant="outlined"
              />
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item v-if="nom && typeSystème === 'அடிமானம்' && symboles">
              <p class="mb-4">
                {{ t('ennikkai.nouvelle.instructionBases') }}
              </p>
              <item-base-numeration
                v-for="b of Object.keys(bases)"
                :key="b"
                :val="bases[b]"
                :symbole="b"
                @effacer="({symbole}) => effacerBase({symbole})"
                @modifier="({symbole, val}) => modifierBase({symbole, val})"
              />
              <v-row>
                <v-col
                  :cols="5"
                  class="py-0"
                >
                  <v-text-field
                    v-model="symboleNouvelleBase"
                    variant="outlined"
                    density="compact"
                    :label="t('ennikkai.nouvelle.étiquetteSymboleBase')"
                    :hint="t('ennikkai.nouvelle.indiceSymboleBase')"
                    @blur="() => ajoutNouvelleBase()"
                  >
                  </v-text-field>
                </v-col>
                <v-col
                  :cols="5"
                  class="py-0"
                >
                  <v-text-field
                    v-model="valNouvelleBase"
                    variant="outlined"
                    density="compact"
                    :label="t('ennikkai.nouvelle.étiquetteValeurBase')"
                    :hint="t('ennikkai.nouvelle.indiceValeurBase')"
                    @blur="() => ajoutNouvelleBase()"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item
              v-if="typeSystème === 'இடஞ்சார்' ? symboles : Object.keys(bases).length"
            >
              <p>{{ t('ennikkai.nouvelle.instructionUnicode') }}</p>
              <v-btn
                class="my-2"
                variant="outlined"
                append-icon="mdi-open-in-new"
                :text="t('ennikkai.nouvelle.btnUnicode')"
                @click="() => ouvrirLien(urlAideUnicode)"
              ></v-btn>
              <v-text-field
                v-model="unicode"
                :label="t('ennikkai.nouveau.étiquetteUnicode')"
                :hint="t('ennikkai.nouveau.indiceUnicode')"
                class="py-2"
                variant="outlined"
              />
            </v-timeline-item>
          </v-expand-transition>
          <v-expand-transition>
            <v-timeline-item v-if="prêtÀAjouter">
              <p>{{ t('ennikkai.nouvelle.instructionConfirmation') }}</p>
              <v-btn
                class="mt-2"
                variant="outlined"
                :loading="suggestionEnCours"
                :text="'Confirmer'"
                @click="() => proposer()"
              />
            </v-timeline-item>
          </v-expand-transition>
        </v-timeline>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          :disabled="!prêtÀAjouter"
          :text="'Confirmer'"
          @click="() => proposer()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {type எண்_வகை} from 'ennikkai';

import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {எண்ணிக்கையை_கண்டுப்பிடி, கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import ItemBaseNumeration from './ItemBaseNumération.vue';

import {ouvrirLien} from '/@/utils';

import {watchEffect} from 'vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {mdAndUp} = useDisplay();

const எண்ணிக்கை = எண்ணிக்கையை_கண்டுப்பிடி();

defineEmits<{
  (e: 'suggestion', code: {système: string}): void;
}>();

// Navigation
const dialogue = ref(false);

// Nom
const nom = ref<string>();
const règleNomUnique = computed(() => {
  if (!nom.value) return true;
  const systèmesExitants = எண்ணிக்கை.முறைமைகள்;
  return systèmesExitants.find(s => s === nom.value) ? t('ennikkai.erreurNomDupliqué') : true;
});

// Type système
const typeSystème = ref<எண்_வகை['வகை']>();
watchEffect(() => {
  if (!nom.value?.length) typeSystème.value = undefined;
});

// Autres spécifications système
const unicode = ref<string>();
const décimal = ref<string>();
const exposant = ref<string>();

const urlAideUnicode = ref<string>(
  'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/numberingSystem',
);

// Symboles
const symboles = ref<string>();
const règleSymbolesUniques = computed(() => {
  if (!symboles.value) return true;
  return [...symboles.value].length === [...new Set([...symboles.value])].length
    ? true
    : t('ennikkai.erreurSymbolesRépétés');
});

// Bases
const symboleNouvelleBase = ref<string>();
const valNouvelleBase = ref<string>();

const ajoutNouvelleBase = () => {
  if (!symboleNouvelleBase.value || !valNouvelleBase.value) return;
  modifierBase({symbole: symboleNouvelleBase.value, val: parseInt(valNouvelleBase.value)});
  symboleNouvelleBase.value = valNouvelleBase.value = undefined;
};

const bases = ref<{[base: string]: number}>({});

const modifierBase = ({symbole, val}: {symbole: string; val: number}) => {
  bases.value = {...bases.value, [symbole]: val};
};
const effacerBase = ({symbole}: {symbole: string}) => {
  bases.value = Object.fromEntries(Object.entries(bases.value).filter(([s, _v]) => s !== symbole));
};

// Suggérer
const suggestionEnCours = ref(false);
const prêtÀAjouter = computed(() => {
  if (
    nom.value &&
    typeSystème.value &&
    symboles.value?.length &&
    (typeSystème.value === 'அடிமானம்' ? Object.keys(bases.value || []).length : true)
  ) {
    return {
      nom: nom.value,
      typeSystème: typeSystème.value,
      symboles: symboles.value,
      exposant: exposant.value,
      unicode: unicode.value,
      décimal: décimal.value,
      bases: bases.value,
    };
  }
  return undefined;
});

const proposer = async () => {
  const vals = prêtÀAjouter.value;
  if (vals) {
    suggestionEnCours.value = true;
    await எண்ணிக்கை.பரிந்துரையு({
      குறியீடு: vals.nom,
      வகை: vals.typeSystème,
      ஒருங்குறி: vals.unicode,
      குறிகள்: vals.symboles,
      அடுக்குக்குறி: vals.exposant,
      அடிமானங்கள்: vals.bases ? JSON.stringify(vals.bases) : undefined,
      பிரிப்பு: vals.décimal,
    });
  }
  fermer();
};
const fermer = () => {
  dialogue.value = false;

  nom.value = typeSystème.value = symboles.value = unicode.value = undefined;
  suggestionEnCours.value = false; // au cas où
};
</script>
