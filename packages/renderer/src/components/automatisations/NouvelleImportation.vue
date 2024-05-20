<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      />
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t(titreCarte) }}
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
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :value="étapes.indexOf('objetConstellation')">
            <v-chip-group
              v-model="typeObjet"
              color="primary"
              mandatory
            >
              <v-chip
                v-for="type in ['tableau', 'bd']"
                :key="type"
                class="mx-2"
                variant="outlined"
                :prepend-icon="icôneObjet(type)"
              />
            </v-chip-group>
            <SelecteurBd
              v-if="typeObjet === 'bd'"
              :multiples="false"
              @selectionnee="bds => (idObjet = bds[0])"
            />
            <SelecteurTableau
              v-else-if="typeObjet === 'tableau'"
              :multiples="false"
              @selectionne="tableau => (idObjet = tableau)"
            />
          </v-window-item>
          <v-window-item :value="étapes.indexOf('sourceImportation')">
            <v-file-input
              v-model="fichier"
              class="mt-2"
              variant="outlined"
              :label="t('importations.carte.étiquetteFichier')"
            ></v-file-input>
            <v-text-field
              v-model="url"
              prepend-icon="mdi-web"
              variant="outlined"
              :label="t('mportations.carte.étiquetteURL')"
            ></v-text-field>
            {{ url }}
            {{ donnéesSource }}
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';

import axios from 'axios';

import SelecteurBd from '/@/components/bds/SélecteurBd.vue';
import SelecteurTableau from '/@/components/tableaux/SélecteurTableau.vue';
import { icôneObjet } from '../utils';

const props = defineProps<{infoObjet?: {id: string; typeObjet: 'bd' | 'tableau'}}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);
const étapes = [
  'objetConstellation',
  'sourceImportation',
  'correspondancesImportation',
  'automatiser',
  'confirmation',
] as const;

const étape = ref(étapes.indexOf(props.infoObjet ? 'sourceImportation' : 'objetConstellation'));

const titreCarte = computed(() => {
  const é = étapes[étape.value];
  switch (é) {
    case 'objetConstellation':
      return 'importations.carte.titreObjetConstellation';
    case 'sourceImportation':
      return 'importations.carte.titreSourceImportation';
    case 'correspondancesImportation':
      return 'importations.carte.titreCorrespondancesImportation';
    case 'confirmation':
      return 'importations.carte.titreconfirmation';
    default:
      return '';
  }
});

// Objet Constellation
const typeObjet = ref(props.infoObjet?.typeObjet);
const idObjet = ref(props.infoObjet?.id);

// Source
const fichier = ref<File[]>();
const url = ref<string>();

watchEffect(() => {
  if (fichier.value) url.value = undefined;
});
watchEffect(() => {
  if (url.value) fichier.value = undefined;
});

const donnéesSource = ref<Uint8Array>();
const formatSource = ref<string>();

const erreurURL = ref(false);

watchEffect(() => {
  const nomDocument = fichier.value?.[0].name || url.value;
  formatSource.value = nomDocument?.split('.').pop();
});
watchEffect(async () => {
  if (url.value) {
    try {
      const réponse = await axios.get(url.value);
      donnéesSource.value = réponse.data;
    } catch {
      erreurURL.value = true;
    }
  } else if (fichier.value) {
    donnéesSource.value = new Uint8Array(await fichier.value[0].arrayBuffer());
  } else {
    donnéesSource.value = undefined;
  }
});

</script>
