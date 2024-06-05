<template>
  <v-dialog>
    <v-slot></v-slot>
    <v-card>
      <v-card-text>
        <v-text-field
          v-model="nom"
          :label="t('ennikkai.nouveau.étiquetteNom')"
          :hint="t('ennikkai.nouveau.indiceNom')"
        />
        <v-expand-transition>
          <v-select
            v-show="nom"
            v-model="typeSystème"
            :label="t('ennikkai.nouveau.étiquetteTypeSystème')"
            :hint="t('ennikkai.nouveau.indiceTypeSystème')"
          />
        </v-expand-transition>
        <v-expand-transition>
          <v-text-field
            v-show="nom && typeSystème"
            v-model="symboles"
            :label="t('ennikkai.nouveau.étiquetteSymboles')"
            :hint="t('ennikkai.nouveau.indiceSymboles')"
          />
        </v-expand-transition>
        <v-expand-transition>
          <v-text-field
            v-show="nom && typeSystème && symboles"
            v-model="unicode"
            :label="t('ennikkai.nouveau.étiquetteUnicode')"
            :hint="t('ennikkai.nouveau.indiceUnicode')"
          />
        </v-expand-transition>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="!prêtÀAjouter"
          @click="() => proposer()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {எண்ணிக்கையை_கண்டுப்பிடி, கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {type எண்_வகை} from 'ennikkai';
import {computed, ref} from 'vue';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const எண்ணிக்கை = எண்ணிக்கையை_கண்டுப்பிடி();

defineEmits<{
  (e: 'suggestion', code: {système: string}): void
}>();

// Spécification système
const nom = ref<string>();
const typeSystème = ref<எண்_வகை['வகை']>();
const symboles = ref<string>();
const bases = ref<{[base: string]: number}>();

const unicode = ref<string>();
const décimal = ref<string>();
const exposant = ref<string>();

const prêtÀAjouter = computed(() => {
  if (nom.value && typeSystème.value && symboles.value?.length && (
    typeSystème.value === 'அடிமானம்' ? (Object.keys(bases.value || []).length) : true
  )) {
    return {
      nom: nom.value,
      typeSystème: typeSystème.value,
      symboles: symboles.value,
      exposant: exposant.value,
      unicode: unicode.value,
      décimal: décimal.value,
      bases: bases.value,
    };
  };
  return undefined;
});

const proposer = async () => {
  const vals = prêtÀAjouter.value;
  if (vals){
    await எண்ணிக்கை.பரிந்துரையு({
      குறியீடு: vals.nom,
      வகை: vals.typeSystème,
      ஒருங்குறி: vals.unicode,
      குறிகள்: vals.symboles,
      அடுக்குக்குறி: vals.exposant,
      அடிமானங்கள்: vals.bases ? JSON.stringify(vals.bases): undefined,
      பிரிப்பு: vals.décimal,
    });
  }
  effacer();
};
const effacer = () => {
  nom.value = typeSystème.value = symboles.value = unicode.value = undefined;
};
</script>
