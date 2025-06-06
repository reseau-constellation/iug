<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props}">
      <slot
        name="activateur"
        v-bind="{props}"
      ></slot>
    </template>

    <v-card
      class="mx-auto"
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
          {{ t(titreCarte) }}
          <v-spacer />
          <v-btn
            variant="flat"
            size="small"
            icon="mdi-close"
            @click="fermer"
          />
        </v-card-title>
        <v-card-subtitle> {{ t(sousTitreCarte) }} </v-card-subtitle>
      </v-card-item>
      <v-card-text style="overflow-y: scroll">
        <v-window v-model="étape">
          <v-window-item :key="0">
            <liste-noms
              :texte-aucun-nom="t('communs.texteAucunNom')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('communs.étiquetteNom')"
              :indice-nom="t('motsClefs.nouveau.indiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :key="1">
            <liste-noms
              :texte-aucun-nom="t('motsClefs.nouveau.texteAucuneDescription')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('motsClefs.nouveau.texteIndiceDescription')"
              :indice-nom="t('motsClefs.nouveau.indiceDescription')"
              :noms-initiaux="descriptions"
              :autorisation-modification="true"
              longue
              @ajuster-noms="ajusterDescriptions"
            />
          </v-window-item>
          <v-window-item :key="2">
            <div class="text-center">
              <h3 class="text-h6 font-weight-light mb-2">
                {{ t('motsClefs.nouveau.texteCréer') }}
              </h3>
              <p>
                <v-btn
                  class="mt-3"
                  variant="outlined"
                  append-icon="mdi-check"
                  :loading="enCréation"
                  @click="() => créerMotClef()"
                >
                  {{ t('motsClefs.nouveau.texteBtnCréation') }}
                </v-btn>
              </p>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <btn-retour
          :visible="retourActif.visible"
          :actif="retourActif.actif"
          @retour="retour"
        />
        <v-spacer></v-spacer>
        <btn-suivant
          :visible="suivantActif.visible"
          :actif="suivantActif.actif"
          @suivant="suivant"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {computed, ref} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useDisplay} from 'vuetify';
import {utiliserConstellation} from '../utils';
import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import ListeNoms from '/@/components/communs/listeNoms/ListeNoms.vue';

const émettre = defineEmits<{(é: 'nouveau', id: string): void}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['noms', 'descriptions', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return 'motsClefs.nouveau.titreNoms';
    case 'descriptions':
      return 'motsClefs.nouveau.titreDescriptions';
    case 'confirmation':
      return 'motsClefs.nouveau.titreConfirmation';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return 'motsClefs.nouveau.sousTitreNoms';
    case 'descriptions':
      return 'motsClefs.nouveau.sousTitreDescriptions';
    case 'confirmation':
      return 'motsClefs.nouveau.sousTitreConfirmation';
    default:
      return '';
  }
});

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value--;
      break;
  }
};

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value++;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return {actif: !!Object.keys(noms.value).length, visible: true};
    case 'confirmation':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return {actif: false, visible: false};
    case 'confirmation':
      return {actif: !enCréation.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});

// Noms
const noms = ref<{[lng: string]: string}>({});
const ajusterNoms = (nms: {[lng: string]: string}) => {
  noms.value = nms;
};

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});
const ajusterDescriptions = (desrc: {[lng: string]: string}) => {
  descriptions.value = desrc;
};

// Création
const enCréation = ref(false);
const créerMotClef = async () => {
  enCréation.value = true;

  const idMotClef = await constl.motsClefs.créerMotClef();
  if (!idMotClef) throw new Error('Mot clef non créé.');

  await constl.motsClefs.sauvegarderNomsMotClef({
    idMotClef: idMotClef,
    noms: Object.fromEntries(Object.entries(noms.value)),
  });
  await constl.motsClefs.sauvegarderDescriptionsMotClef({
    idMotClef: idMotClef,
    descriptions: Object.fromEntries(Object.entries(descriptions.value)),
  });
  émettre('nouveau', idMotClef);
  fermer();
};

// Fermer
const fermer = () => {
  noms.value = {};
  descriptions.value = {};
  étape.value = 0;
  enCréation.value = false;
  dialogue.value = false;
};
</script>
