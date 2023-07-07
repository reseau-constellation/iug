<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props}">
      <slot
        name="activator"
        v-bind="{props}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="text-h5 justify-space-between">
          <span>{{ titreCarte }}</span>
        </v-card-title>
        <v-card-subtitle> {{ sousTitreCarte }} </v-card-subtitle>
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
              :indice-nom="t('communs.indiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :value="1">
            <liste-noms
              :texte-aucun-nom="t('projets.nouveau.texteAucuneDescription')"
              :indice-langue="t('communs.indiceLangue')"
              :indice-nom="t('projets.nouveau.texteIndiceDescription')"
              :noms-initiaux="descriptions"
              :autorisation-modification="true"
              @ajuster-noms="ajusterDescriptions"
            />
          </v-window-item>
          <v-window-item :value="2">
            <SelecteurMotClef
              multiples
              @selectionnee="ids => (motsClefs = ids)"
            />
          </v-window-item>
          <v-window-item :value="3">
            <SelecteurBd
              multiples
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
                  @click="() => créerBd()"
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
        <v-btn
          v-show="retourActif.visible"
          variant="text"
          :disabled="!retourActif.actif"
          @click="retour"
        >
          {{ t('communs.retour') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-show="suivantActif.visible"
          color="primary"
          variant="flat"
          :disabled="!suivantActif.actif"
          @click="suivant"
        >
          {{ t('communs.suivant') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import {useDisplay} from 'vuetify';

import SelecteurBd from '/@/components/bds/SélecteurBd.vue';
import SelecteurMotClef from '/@/components/motsClefs/SélecteurMotClef.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {useRouter} from 'vue-router';

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {mdAndUp} = useDisplay();
const router = useRouter();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = ['noms', 'descriptions', 'motsClefs', 'ajouterBds', 'confirmation'] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
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

const créerBd = async () => {
  enCréation.value = true;

  const idProjet = await constl?.projets?.créerProjet();
  if (!idProjet) throw new Error('Projet non créé.');

  await constl?.projets?.ajouterNomsProjet({
    id: idProjet,
    noms: Object.fromEntries(Object.entries(noms.value)),
  });
  await constl?.projets?.ajouterDescriptionsProjet({
    id: idProjet,
    descriptions: Object.fromEntries(Object.entries(descriptions.value)),
  });
  await constl?.projets?.ajouterMotsClefsProjet({idProjet, idsMotsClefs: motsClefs.value});
  await Promise.all(
    bds.value.map(async idBd => await constl?.projets?.ajouterBdProjet({idProjet, idBd})),
  );

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
