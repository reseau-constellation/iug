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
          <v-window-item :key="0">
            <v-list>
              <v-list-item
                prepend-icon="mdi-creation-outline"
                :append-icon="isRtl ? 'chevron-left' : 'chevron-right'"
                :title="t('bds.nouvelle.créerNouvelle')"
                @click="() => suivreCheminementNouvelle()"
              />
              <v-list-item
                prepend-icon="mdi-table"
                :append-icon="isRtl ? 'chevron-left' : 'chevron-right'"
                :title="t('bds.nouvelle.copierDeBd')"
                @click="() => suivreCheminementGabarit('bd')"
              />
              <v-list-item
                prepend-icon="mdi-table-multiple"
                :append-icon="isRtl ? 'chevron-left' : 'chevron-right'"
                :title="t('bds.nouvelle.copierDeNuée')"
                @click="() => suivreCheminementGabarit('nuée')"
              />
            </v-list>
          </v-window-item>
          <v-window-item :value="1">
            <SelecteurBd
              :multiples="false"
              @selectionnee="ids => ids[0] && choisirGabaritBd(ids[0])"
            ></SelecteurBd>
            <v-checkbox
              v-model="copierDonnées"
              :label="t('bds.nouvelle.copierDonnéesBd')"
            />
          </v-window-item>
          <v-window-item :value="2">
            <SelecteurNuee @selectionnee="id => id && choisirGabaritNuée(id)" />
          </v-window-item>
          <v-window-item :value="3">
            <liste-noms
              :texte-aucun-nom="t('communs.texteAucunNom')"
              :indice-langue="t('communs.indiceLangue')"
              :indice-nom="t('communs.indiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :value="4">
            <liste-noms
              :texte-aucun-nom="t('bds.nouvelle.texteAucuneDescription')"
              :indice-langue="t('communs.indiceLangue')"
              :indice-nom="t('bds.nouvelle.texteIndiceDescription')"
              :noms-initiaux="descriptions"
              :autorisation-modification="true"
              @ajuster-noms="ajusterDescriptions"
            />
          </v-window-item>
          <v-window-item :value="5">
            <SelecteurMotClef
              multiples
              @selectionnee="ids => (motsClefs = ids)"
            />
          </v-window-item>
          <v-window-item :value="6">
            <dialogue-licence
              :licence="licence"
              @changer-licence="l => (licence = l)"
            >
              <template #activator="{props}">
                <JetonLicence
                  v-bind="props"
                  :licence="licence"
                />
              </template>
            </dialogue-licence>
          </v-window-item>
          <v-window-item :value="7">
            <div class="text-center">
              <h3 class="text-h6 font-weight-light mb-2">
                {{ t('bds.nouvelle.texteCréer') }}
              </h3>
              <p>
                <v-btn
                  class="mt-3"
                  variant="outlined"
                  :loading="enCréation"
                  @click="() => créerBd()"
                >
                  {{ t('bds.nouvelle.texteBtnCréation') }}
                </v-btn>
              </p>
              <v-checkbox v-model="ouvrirAprèsCréation">
                {{ t('bds.nouvelle.ouvrirAprèsCréation') }}
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
import type {bds, client} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import {useDisplay, useRtl} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {useRouter} from 'vue-router';
import SelecteurBd from './SélecteurBd.vue';
import SelecteurNuee from '/@/components/nuées/SélecteurNuée.vue';
import SelecteurMotClef from '/@/components/motsClefs/SélecteurMotClef.vue';
import JetonLicence from '../licences/JetonLicence.vue';
import DialogueLicence from '../licences/DialogueLicence.vue';

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const router = useRouter();
const {isRtl} = useRtl();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

const étape = ref(0);
const listeÉtapes = [
  'cheminement',
  'gabaritBd',
  'gabaritNuée',
  'noms',
  'descriptions',
  'motsClefs',
  'licence',
  'confirmation',
] as const;

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return t('bds.nouvelle.titreCheminement');
    case 'gabaritBd':
      return t('bds.nouvelle.titreGabaritBd');
    case 'gabaritNuée':
      return t('bds.nouvelle.titreGabaritNuée');
    case 'noms':
      return t('bds.nouvelle.titreNoms');
    case 'descriptions':
      return t('bds.nouvelle.titreFescriptions');
    case 'motsClefs':
      return t('bds.nouvelle.titreMotsClefs');
    case 'licence':
      return t('bds.nouvelle.titreLicence');
    case 'confirmation':
      return t('bds.nouvelle.titreConfirmation');
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return t('bds.nouvelle.sousTitreCheminement');
    case 'gabaritBd':
      return t('bds.nouvelle.sousTitreGabaritBd');
    case 'gabaritNuée':
      return t('bds.nouvelle.sousTitreGabaritNuée');
    case 'noms':
      return t('bds.nouvelle.sousTitreNoms');
    case 'descriptions':
      return t('bds.nouvelle.sousTitreFescriptions');
    case 'motsClefs':
      return t('bds.nouvelle.sousTitreMotsClefs');
    case 'licence':
      return t('bds.nouvelle.sousTitreLicence');
    case 'confirmation':
      return t('bds.nouvelle.sousTitreConfirmation');
    default:
      return '';
  }
});

const cheminement = ref<'nouvelle' | 'bd' | 'nuée'>();
const suivreCheminementGabarit = (type: 'nuée' | 'bd') => {
  cheminement.value = type;
  étape.value = listeÉtapes.indexOf(type === 'bd' ? 'gabaritBd' : 'gabaritNuée');
};
const suivreCheminementNouvelle = () => {
  cheminement.value = 'nouvelle';
  étape.value = listeÉtapes.indexOf('noms');
};

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'gabaritBd':
    case 'gabaritNuée':
      // On saute directement à la confirmation de la licence pour les gabarits
      étape.value = listeÉtapes.indexOf('licence');
      break;

    default:
      étape.value++;
      break;
  }
};

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'gabaritBd':
    case 'gabaritNuée':
    case 'noms':
      étape.value = listeÉtapes.indexOf('cheminement');
      break;

    case 'licence':
      étape.value = listeÉtapes.indexOf(
        cheminement.value === 'bd'
          ? 'gabaritBd'
          : cheminement.value === 'nuée'
          ? 'gabaritNuée'
          : 'motsClefs',
      );
      break;

    default:
      étape.value--;
      break;
  }
};

const suivantActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return {actif: false, visible: false};
    case 'gabaritBd':
      return {actif: !!idBdÀCopier.value, visible: true};
    case 'gabaritNuée':
      return {actif: !!gabaritNuée.value, visible: true};
    case 'noms':
      return {actif: Object.keys(noms.value).length > 0, visible: true};
    case 'licence':
      return {actif: !!licence.value, visible: true};
    case 'confirmation':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return {actif: false, visible: false};
    case 'confirmation':
      return {actif: !enCréation.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});

// Gabarits
const gabaritNuée = ref<bds.schémaSpécificationBd>();
const idBdÀCopier = ref<string>();
const choisirGabaritBd = async (idBd: string) => {
  idBdÀCopier.value = idBd;
};
const choisirGabaritNuée = async (idNuée: string) => {
  const schéma = await constl?.nuées?.générerSchémaBdNuée({
    idNuée,
    licence: 'ODbl-1_0', // À faire : incorporer dans la spécification de la nuée
  });
  if (schéma) {
    gabaritNuée.value = schéma;
    licence.value = schéma.licence;
    licenceContenu.value = schéma.licenceContenu;
  }
};
const copierDonnées = ref(false);

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

// Licences
const licence = ref<string>();
const licenceContenu = ref<string>();

// Création
const prêtÀCréer = computed(() => {
  if (!licence.value) return undefined;
  return {licenceChoisie: licence.value};
});

const ouvrirAprèsCréation = ref(false);

const enCréation = ref(false);

const créerBd = async () => {
  enCréation.value = true;

  let idBd: string | undefined;

  if (cheminement.value === 'nouvelle') {
    if (!prêtÀCréer.value) return;
    const {licenceChoisie} = prêtÀCréer.value;
    idBd = await constl?.bds?.créerBd({
      licence: licenceChoisie,
      licenceContenu: licenceContenu.value,
    });
    if (!idBd) throw new Error('Bd non créée.');

    await constl?.bds?.ajouterNomsBd({
      id: idBd,
      noms: Object.fromEntries(Object.entries(noms.value)),
    });
    await constl?.bds?.ajouterDescriptionsBd({
      id: idBd,
      descriptions: Object.fromEntries(Object.entries(descriptions.value)),
    });
    await constl?.bds?.ajouterMotsClefsBd({idBd, idsMotsClefs: motsClefs.value});
  } else if (cheminement.value === 'nuée') {
    if (!gabaritNuée.value) return;
    idBd = await constl?.bds?.créerBdDeSchéma({schéma: gabaritNuée.value});
  } else {
    if (!idBdÀCopier.value) return;
    idBd = await constl?.bds?.copierBd({
      id: idBdÀCopier.value,
      copierDonnées: copierDonnées.value,
    });
  }

  if (!idBd) throw new Error('Bd non créée.');
  fermer();
  if (ouvrirAprèsCréation.value) router.push(encodeURI(`/données/bd/${encodeURIComponent(idBd)}`));
};

// Fermer
const fermer = () => {
  noms.value = {};
  descriptions.value = {};
  licence.value = undefined;
  licenceContenu.value = undefined;
  motsClefs.value = [];
  étape.value = 0;
  enCréation.value = false;
  dialogue.value = false;
};
</script>
