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
      :min-width="mdAndUp ? 750 : 300"
    >
      <v-card-item>
        <v-card-title class="text-h5 justify-space-between">
          <span>{{ t(titreCarte) }}</span>
        </v-card-title>
        <v-card-subtitle> {{ t(sousTitreCarte) }} </v-card-subtitle>
      </v-card-item>
      <v-card-text>
        <v-window
          v-model="étape"
          style="overflow-y: scroll"
        >
          <v-window-item :value="0">
            <liste-noms
              :texte-aucun-nom="t('communs.texteAucunNom')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('communs.étiquetteNom')"
              :indice-nom="t('projets.nouveau.texteIndiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :value="1">
            <liste-noms
              :texte-aucun-nom="t('projets.nouveau.texteAucuneDescription')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('projets.nouveau.texteÉtiquetteDescription')"
              :indice-nom="t('projets.nouveau.texteIndiceDescription')"
              :noms-initiaux="descriptions"
              :autorisation-modification="true"
              @ajuster-noms="ajusterDescriptions"
            />
          </v-window-item>
          <v-window-item :value="2">
            <selecteur-mot-clef
              multiples
              :originaux="motsClefs"
              @selectionnee="ids => (motsClefs = ids)"
            />
          </v-window-item>
          <v-window-item :value="3">
            <selecteur-bd
              :multiples="false"
              :originales="bds"
              @selectionnee="ids => (bds = ids)"
            />
          </v-window-item>
          <v-window-item :value="4">
            <div class="text-center">
              <h3 class="text-h6 font-weight-light mb-2">
                {{ t('projets.nouveau.texteCréer') }}
              </h3>
              <p>
                <v-btn
                  class="mt-3"
                  variant="outlined"
                  :loading="enCréation"
                  @click="() => créerProjet()"
                >
                  {{ t('projets.nouveau.texteBtnCréation') }}
                </v-btn>
              </p>
              <v-checkbox v-model="ouvrirAprèsCréation">
                {{ t('projets.nouveau.ouvrirAprèsCréation') }}
              </v-checkbox>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>

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
import {useDisplay} from 'vuetify';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {useRouter} from 'vue-router';
import {utiliserConstellation} from '../utils';
import SelecteurBd from '/@/components/bds/SélecteurBd.vue';
import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import ListeNoms from '/@/components/communs/listeNoms/ListeNoms.vue';
import SelecteurMotClef from '/@/components/motsClefs/SélecteurMotClef.vue';

const émettre = defineEmits<{(é: 'nouveau', id: string): void}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const router = useRouter();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['noms', 'descriptions', 'motsClefs', 'ajouterBds', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return 'projet.nouveau.titreNoms';
    case 'descriptions':
      return 'projet.nouveau.titreDescriptions';
    case 'motsClefs':
      return 'projet.nouveau.titreMotsClefs';
    case 'ajouterBds':
      return 'projet.nouveau.titreAjouterBds';
    case 'confirmation':
      return 'projet.nouveau.titreConfirmation';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return 'projet.nouveau.sousTitreNoms';
    case 'descriptions':
      return 'projet.nouveau.sousTitreDescriptions';
    case 'motsClefs':
      return 'projet.nouveau.sousTitreMotsClefs';
    case 'ajouterBds':
      return 'projet.nouveau.sousTitreAjouterBds';
    case 'confirmation':
      return 'projet.nouveau.sousTitreConfirmation';
    default:
      return '';
  }
});

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value++;
      break;
  }
};

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      étape.value--;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'noms':
      return {actif: Object.keys(noms.value).length > 0, visible: true};
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

// Mots-clefs
const motsClefs = ref<string[]>([]);

// Bds
const bds = ref<string[]>([]);

// Création
const ouvrirAprèsCréation = ref(false);

const enCréation = ref(false);

const créerProjet = async () => {
  enCréation.value = true;

  const idProjet = await constl.projets.créerProjet();
  if (!idProjet) throw new Error('Projet non créé.');

  await constl.projets.sauvegarderNomsProjet({
    idProjet,
    noms: Object.fromEntries(Object.entries(noms.value)),
  });
  await constl.projets.sauvegarderDescriptionsProjet({
    idProjet,
    descriptions: Object.fromEntries(Object.entries(descriptions.value)),
  });
  await constl.projets.ajouterMotsClefsProjet({idProjet, idsMotsClefs: motsClefs.value});
  await Promise.all(
    bds.value.map(async idBd => await constl.projets.ajouterBdProjet({idProjet, idBd})),
  );

  émettre('nouveau', idProjet);

  fermer();
  if (ouvrirAprèsCréation.value)
    router.push(encodeURI(`/données/projet/${encodeURIComponent(idProjet)}`));
};

// Fermer
const fermer = () => {
  noms.value = {};
  descriptions.value = {};
  motsClefs.value = [];
  bds.value = [];

  étape.value = 0;
  enCréation.value = false;
  dialogue.value = false;
};
</script>
