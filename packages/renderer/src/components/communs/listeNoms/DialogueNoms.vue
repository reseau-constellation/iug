<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      :max-width="mdAndUp ? 500 : 300"
      class="mx-auto"
    >
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
          :autorisation-modification="autorisationModification"
          @ajuster-noms="ajusterNoms"
        ></ListeNoms>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          append-icon="mdi-close"
          @click="fermer"
        >
          {{ t('communs.fermer') }}
        </v-btn>

        <v-btn
          v-if="autorisationModification"
          color="primary"
          variant="outlined"
          append-icon="mdi-check"
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
import {useDisplay} from 'vuetify';
import ListeNoms from './ListeNoms.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import deepEqual from 'deep-equal';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {mdAndUp} = useDisplay();

const props = defineProps<{
  titre: string;
  sousTitre: string;
  nomsInitiaux: {[lng: string]: string};
  indiceNom: string;
  indiceLangue: string;
  texteAucunNom: string;
  autorisationModification: boolean;
}>();
const émettre = defineEmits<{
  (é: 'ajusterNoms', noms: {[lng: string]: string}): void;
}>();

// Navigation générale
const dialogue = ref(false);
const fermer = () => {
  dialogue.value = false;
  nomsChoisis.value = props.nomsInitiaux;
};
const sauvegarder = () => {
  émettre('ajusterNoms', nomsChoisis.value);
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
