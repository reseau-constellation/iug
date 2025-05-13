<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          <nom-tableau :id-tableau="idTableau" />
          <DialogueNoms
            :etiquette-nom="t('objet.étiquetteNom')"
            :indice-nom="t('objet.indiceNom')"
            :indice-langue="t('objet.indiceLangue')"
            :texte-aucun-nom="t('objet.texteAucunNom')"
            :noms-initiaux="noms"
            :titre="t('objet.titreDialogueNoms')"
            :sous-titre="t('objet.sousTitreDialogueNoms')"
            :autorisation-modification="!!monAutorisation"
            @ajuster-noms="nms => changerNoms(nms)"
          >
            <template #activateur="{props: propsActivateur}">
              <v-btn
                v-bind="propsActivateur"
                class="ms-2"
                :icon="monAutorisation ? 'mdi-pencil' : 'mdi-earth'"
                variant="flat"
                size="small"
              />
            </template>
          </DialogueNoms>
          <lien-objet :id="idTableau" />
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <division-carte :titre="t('tableaux.carte.optionsAvancées')" />
        <v-list-item
          variant="flat"
          :append-icon="clefCopiée ? 'mdi-check' : 'mdi-content-copy'"
          @click="()=>copierClef()"
        >
          {{ t('tableaux.carte.clef') }}
          {{ clefTableau }}
        </v-list-item>
        <carte-effacer
          v-if="monAutorisation"
          @effacer="() => émettre('effacer')"
        >
          <template #activateur="{props: propsActivateur}">
            <v-list-item
              v-bind="propsActivateur"
              class="text-error"
              variant="flat"
              append-icon="mdi-delete"
            >
              {{ t('communs.effacer') }}
            </v-list-item>
          </template>
        </carte-effacer>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import {useDisplay} from 'vuetify';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ajusterTexteTraductible, copier } from '/@/utils';
import { suivre } from '@constl/vue';
import { utiliserConstellation } from '../utils';
import LienObjet from '/@/components/communs/LienObjet.vue';
import NomTableau from '/@/components/tableaux/NomTableau.vue';
import CarteEffacer from '/@/components/communs/CarteEffacer.vue';
import DivisionCarte from '../communs/DivisionCarte.vue';

const props = defineProps<{idTableau: string, clefTableau: string}>();
const émettre = defineEmits<{
  (é: 'effacer'): void;
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Noms
const noms = suivre(constl.tableaux.suivreNomsTableau, {idTableau: computed(() => props.idTableau)}); // À faire - voir comment utiliser constl.nuées.suivreNomsTableauNuée

const changerNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const langue of àEffacer) {
    await constl.tableaux.effacerNomTableau({idTableau: props.idTableau, langue});
  }
  await constl.tableaux.sauvegarderNomsTableau({idTableau: props.idTableau, noms: àAjouter});
};

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: computed(() => props.idTableau)});


// Clef tableau
const clefCopiée = ref(false);
const copierClef = async () => {
  await copier(props.clefTableau);
  clefCopiée.value = true;
};
</script>