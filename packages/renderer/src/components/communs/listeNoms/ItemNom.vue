<template>
  <v-list-item>
    <v-list-item-title>
      <v-row>
        <v-col
          cols="4"
          class="pb-0"
        >
          <v-autocomplete
            v-model="nouvelleLangue"
            class="pt-1"
            density="compact"
            variant="outlined"
            item-title="lng"
            item-value="code"
            :readonly="!autorisationModification"
            :items="languesEtCodes"
            :label="indiceLangue"
          ></v-autocomplete>
        </v-col>
        <v-col
          cols="8"
          class="pb-0"
        >
          <v-text-field
            v-model="nouveauNom"
            class="pt-1"
            density="compact"
            variant="outlined"
            :readonly="!autorisationModification"
            :rules="règlesNouveauNom"
            :label="indiceNom"
            @blur="sauvegarder"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-list-item-title>

    <template #append>
      <v-btn
        v-if="autorisationModification"
        class="mb-3"
        icon="mdi-delete"
        variant="text"
        @click="effacer"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watchEffect} from 'vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {Nuchabäl} from 'nuchabal';

const {கிடைக்கும்_மொழிகளை_பயன்படுத்து, useI18n} = கிளிமூக்கை_உபயோகி();
const {languesEtCodes, nomLangue} = கிடைக்கும்_மொழிகளை_பயன்படுத்து();
const {t} = useI18n();

const nuchabäl = new Nuchabäl({});

const props = defineProps<{
  langue: string;
  nom: string;
  id: string;
  indiceNom: string;
  indiceLangue: string;
  autorisationModification: boolean;
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

// Changements
const nomNouvelleLangue = nomLangue(nouvelleLangue);

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
