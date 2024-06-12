<template>
  <TexteTronque
    v-if="noms"
    :texte="nomTraduit || clef"
    :longueur-max="20"
  />
  <v-skeleton-loader
    v-else
    type="text"
  />
  <DialogueNoms
    :etiquette-nom="t('objet.étiquetteNom')"
    :indice-nom="t('objet.indiceNom')"
    :indice-langue="t('objet.indiceLangue')"
    :texte-aucun-nom="t('objet.texteAucunNom')"
    :noms-initiaux="noms"
    :titre="t('objet.titreDialogueNoms')"
    :sous-titre="t('objet.sousTitreDialogueNoms')"
    :autorisation-modification="!!monAutorisation"
    @ajuster-noms="noms => changerNoms(noms)"
  >
    <template #activator="{props: propsActivateur}">
      <v-icon
        v-bind="propsActivateur"
        class="ms-2"
        :icon="monAutorisation ? 'mdi-pencil' : 'mdi-earth'"
        variant="flat"
        size="small"
      />
    </template>
  </DialogueNoms>
</template>
<script setup lang="ts">
import { கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import { constellation, suivre } from '../utils';

import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';

const props = defineProps<{id: string, clef: string}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = constellation();

// Noms
const noms = suivre(constl.tableaux.suivreNomsTableau, {idTableau: props.id});  // À faire - voir comment utiliser constl.nuées.suivreNomsTableauNuée
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);
const changerNoms = async (noms: { [langue: string]: string } ) => {
  await constl.tableaux.sauvegarderNomsTableau({idTableau: props.id, noms});
};

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: props.id});

</script>