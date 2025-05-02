<template>
  <TexteTronque
    :texte="nomTraduit || clef"
    :longueur-max="15"
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
    @ajuster-noms="nms => changerNoms(nms)"
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
import {suivre} from '@constl/vue';
import {கிளிமூக்கை_பயன்படுத்து, மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../utils';

import {computed} from 'vue';
import DialogueNoms from '/@/components/communs/listeNoms/DialogueNoms.vue';
import TexteTronque from '/@/components/communs/TexteTronqué.vue';
import {ajusterTexteTraductible} from '/@/utils';

const props = defineProps<{id: string; clef: string}>();

const {அகராதியிலிருந்து_மொழிபெயர்ப்பு} = மொழிகளைப்_பயன்படுத்து();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

const constl = utiliserConstellation();

// Noms
const noms = suivre(constl.tableaux.suivreNomsTableau, {idTableau: computed(() => props.id)}); // À faire - voir comment utiliser constl.nuées.suivreNomsTableauNuée
const nomTraduit = அகராதியிலிருந்து_மொழிபெயர்ப்பு(noms);

const changerNoms = async (nms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({anciennes: noms.value, nouvelles: nms});
  for (const langue of àEffacer) {
    await constl.tableaux.effacerNomTableau({idTableau: props.id, langue});
  }
  await constl.tableaux.sauvegarderNomsTableau({idTableau: props.id, noms: àAjouter});
};

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: computed(() => props.id)});
</script>
