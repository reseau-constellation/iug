<template>
  <v-list-item>
    <v-list-item-title>
      <v-row>
        <v-col
          v-if="mdAndUp"
          cols="4"
        >
          <v-autocomplete
            v-model="nouvelleLangue"
            class="pt-1"
            density="compact"
            variant="underlined"
            item-title="மொழி"
            item-value="குறியீடு"
            :readonly="!autorisationModification"
            :items="மொழிகளும்_குறியீடுகளும்"
          >
            <template #no-data>
              <gestionnaire-ennikkai />
            </template>
          </v-autocomplete>
        </v-col>
        <v-col :cols="mdAndUp ? 8 : 12">
          <v-locale-provider :rtl="langueDÀG">
            <v-text-field
              v-if="!longue"
              v-model="nouveauNom"
              :label="mdAndUp ? '' : nomNouvelleLangue"
              :readonly="!autorisationModification"
              :rules="règlesNouveauNom"
              class="pt-1"
              density="compact"
              variant="underlined"
              clear-icon="mdi-close"
              clearable
              @click:clear="effacer"
              @blur="sauvegarder"
            ></v-text-field>
            <v-textarea
              v-else
              v-model="nouveauNom"
              :label="mdAndUp ? '' : nomNouvelleLangue"
              :readonly="!autorisationModification"
              :rules="règlesNouveauNom"
              class="pt-1"
              density="compact"
              variant="underlined"
              clear-icon="mdi-close"
              clearable
              auto-grow
              @click:clear="effacer"
              @blur="sauvegarder"
            ></v-textarea>
          </v-locale-provider>
        </v-col>
      </v-row>
    </v-list-item-title>
  </v-list-item>
</template>

<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, onMounted, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import GestionnaireEnnikkai from '/@/components/langues/contribuer/ennikkai/GestionnaireEnnikkai.vue';
import {utiliserNuchabäl} from '/@/components/utils';

const {கிடைக்கும்_மொழிகளை_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {மொழிகளும்_குறியீடுகளும், மொழியின்_பெயர்} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const {வலதிலிருந்து_இடது_மொழி} = மொழிகளைப்_பயன்படுத்து();

const {mdAndUp} = useDisplay();

const nuchabäl = utiliserNuchabäl();

const props = defineProps<{
  langue: string;
  nom: string;
  id: string;
  autorisationModification: boolean;
  longue?: boolean;
}>();
const émettre = defineEmits<{
  (é: 'changerNom', info: {id: string; nom: string; lng: string}): void;
  (é: 'effacer', info: {id: string}): void;
}>();

// Initialisation
const nouveauNom = ref<string>('');
const nouvelleLangue = ref<string>('');
onMounted(() => {
  nouveauNom.value = props.nom;
  nouvelleLangue.value = props.langue;
});
const langueDÀG = வலதிலிருந்து_இடது_மொழி(nouvelleLangue);

// Changements
const nomNouvelleLangue = மொழியின்_பெயர்(nouvelleLangue);

const règlesNouveauNom = computed<string[] | undefined>(() => {
  if (!nouveauNom.value?.length || !nouvelleLangue.value) return undefined;
  const exprégÉcriture = nuchabäl.rutzibTzibanem({runuk: nouvelleLangue.value});
  if (!exprégÉcriture) return;
  const erreurLangue = !nouveauNom.value.match(new RegExp(exprégÉcriture, 'g'));

  return erreurLangue ? [t('communs.erreurLangue', {langue: nomNouvelleLangue.value})] : undefined;
});

const effacer = () => {
  émettre('effacer', {id: props.id});
};
const sauvegarder = () => {
  if (!nouvelleLangue.value || !nouveauNom.value) return;
  if (règlesNouveauNom.value?.length) return;

  const nom = nouveauNom.value.trim();
  if (nom === props.nom.trim() && nouvelleLangue.value === props.langue) return;
  émettre('changerNom', {id: props.id, nom: nouveauNom.value, lng: nouvelleLangue.value});
};
watchEffect(() => {
  if (nouvelleLangue.value !== props.langue) sauvegarder();
});
</script>
