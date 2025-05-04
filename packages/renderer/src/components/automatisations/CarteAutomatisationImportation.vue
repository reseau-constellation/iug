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
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title>
          <nom-tableau :id-tableau="specification.idTableau" />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <division-carte
          :titre="t('automatisations.statut')"
          :en-attente="false"
        />
        <jeton-statut-automatisation
          v-if="statut"
          :statut="statut"
        />
        <jeton-fichier-importation :spécification="specification" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';

import {ref} from 'vue';
import {useDisplay} from 'vuetify';

import {suivre} from '@constl/vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed} from 'vue';
import DivisionCarte from '../communs/DivisionCarte.vue';
import JetonFichierImportation from './JetonFichierImportation.vue';
import JetonStatutAutomatisation from './JetonStatutAutomatisation.vue';
import {utiliserConstellation} from '/@/components/utils';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const props = defineProps<{
  specification: automatisation.SpécificationImporter;
}>();

const constl = utiliserConstellation();

// Navigation
const dialogue = ref(false);

// Statut
const statuts = suivre(constl.automatisations.suivreÉtatAutomatisations);
const statut = computed(() => statuts.value?.[props.specification.id]);

// Sauvegarde
/*const sauvegarder = async () => {
  const automatisation: automatisation.SpécificationAutomatisation = {
    
  }
  await constl.automatisations.modifierAutomatisation({
    id: props.specification.id,
    automatisation
  })
}*/
</script>
