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
          {{ t('accueil.page.connectivité.serveurLocal.titre') }}
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
              <v-icon
                v-bind="propsActivateur"
                class="ms-2"
                :icon="monAutorisation ? 'mdi-pencil' : 'mdi-earth'"
                variant="flat"
                size="small"
              />
            </template>
          </DialogueNoms>
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
        <v-dialog v-model="dialogueEffacer">
          <template #activator="{props: propsActivateur}">
            <v-list-item
              v-bind="propsActivateur"
              class="text-error"
              variant="flat"
              append-icon="mdi-delete"
            >
              {{ t('communs.effacer') }}
            </v-list-item>
          </template>
          <v-card
            class="mx-auto"
            max-width="300"
          >
            <v-card-item>
              <p class="text-h5">
                {{ t('tableaux.confirmerEffacer') }}
              </p>
            </v-card-item>
            <v-card-actions>
              <v-btn @click="dialogueEffacer = false">{{ t('communs.non') }}</v-btn>
              <v-btn
                color="error"
                @click="() => émettre('effacer')"
              >
                {{ t('communs.oui') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import {useDisplay} from 'vuetify';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ajusterTexteTraductible } from '/@/utils';
import { suivre } from '@constl/vue';
import { utiliserConstellation } from '../utils';

const props = defineProps<{idTableau: string}>();
const émettre = defineEmits<{
  (é: 'effacer'): void;
}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);
const dialogueEffacer = ref(false);

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

</script>