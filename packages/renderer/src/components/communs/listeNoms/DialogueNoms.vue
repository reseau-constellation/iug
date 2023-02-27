<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props}">
      <slot
        name="activator"
        v-bind="{props}"
      ></slot>
    </template>
    <v-card>
      <v-card-item>
        <v-card-title>
          {{ titre }}
        </v-card-title>
        <v-card-subtitle>
          {{ sousTitre }}
        </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <ListeNoms
          :noms-initiaux="nomsInitiaux"
          :texte-aucun-nom="texteAucunNom"
          :indice-langue="indiceLangue"
          :indice-nom="indiceNom"
          @ajuster-noms="ajusterNoms"
        ></ListeNoms>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
        </v-btn>

        <v-btn
          color="primary"
          variant="flat"
          :disabled="!nomsChangés"
          @click="sauvegarder"
        >
          {{ t('communs.sauvegarder') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';
import ListeNoms from './ListeNoms.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import deepEqual from 'deep-equal';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const props = defineProps<{
  titre: string;
  sousTitre: string;
  nomsInitiaux: {[lng: string]: string};
  indiceNom: string;
  indiceLangue: string;
  texteAucunNom: string;
}>();
const emit = defineEmits<{
  (é: 'ajusterNoms', noms: {[lng: string]: string}): void;
}>();

// Navigation générale
const dialogue = ref(false);
const fermer = () => {
  dialogue.value = false;
  nomsChoisis.value = props.nomsInitiaux;
};
const sauvegarder = () => {
  emit('ajusterNoms', nomsChoisis.value);
  dialogue.value = false;
};

// Gestion noms
const nomsChoisis = ref<{[langue: string]: string}>(props.nomsInitiaux);
const ajusterNoms = (noms: {[langue: string]: string}) => {
  nomsChoisis.value = noms;
};
const nomsChangés = computed(() => {
  return !deepEqual(nomsChoisis.value, props.nomsInitiaux);
});
</script>
