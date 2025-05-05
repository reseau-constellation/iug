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
          <v-window-item :key="listeÉtapes.indexOf('cheminement')">
            <v-list>
              <v-list-item
                prepend-icon="mdi-creation-outline"
                :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                :title="t('bds.nouvelle.créerNouvelle')"
                @click="() => suivreCheminementNouvelle()"
              />
              <v-list-item
                prepend-icon="mdi-table"
                :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                :title="t('bds.nouvelle.copierDeBd')"
                @click="() => suivreCheminementGabarit('bd')"
              />
              <v-list-item
                prepend-icon="mdi-table-multiple"
                :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                :title="t('bds.nouvelle.copierDeNuée')"
                @click="() => suivreCheminementGabarit('nuée')"
              />
            </v-list>
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('gabaritBd')">
            <SelecteurBd
              :multiples="false"
              @selectionnee="ids => ids[0] && choisirGabaritBd(ids[0])"
            ></SelecteurBd>
            <v-checkbox
              v-model="copierDonnées"
              :label="t('bds.copier.copierDonnées')"
              color="primary"
            />
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('gabaritNuée')">
            <selecteur-nuee
              :multiples="false"
              @selectionnee="id => id.length && choisirGabaritNuée(id[0])"
            />
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('noms')">
            <liste-noms
              :texte-aucun-nom="t('communs.texteAucunNom')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('communs.étiquetteNom')"
              :indice-nom="t('bds.nouvelle.texteIndiceNom')"
              :noms-initiaux="noms"
              :autorisation-modification="true"
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('descriptions')">
            <liste-noms
              :texte-aucun-nom="t('bds.nouvelle.texteAucuneDescription')"
              :indice-langue="t('communs.indiceLangue')"
              :etiquette-nom="t('bds.nouvelle.texteÉtiquetteDescription')"
              :indice-nom="t('bds.nouvelle.texteIndiceDescription')"
              :noms-initiaux="descriptions"
              :autorisation-modification="true"
              longue
              @ajuster-noms="ajusterDescriptions"
            />
          </v-window-item>
          <v-window-item :value="5">
            <selecteur-mot-clef
              multiples
              :originaux="motsClefs"
              @selectionnee="ids => (motsClefs = ids)"
            />
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('licence')">
            <v-alert
              v-if="partageÉgale"
              class="mb-4"
              variant="outlined"
              type="info"
              density="compact"
              :title="t('licences.titrePartageÉgale')"
              :text="t('licences.infoPartageÉgale')"
            />
            <choix-licence
              :licence="licence"
              :permission-modifier="!partageÉgale"
              @changer-licence="l => (licence = l)"
            />
            <v-checkbox
              v-show="licence"
              v-model="licenceContenuPareil"
              :label="t('licences.pareilPourContenu')"
              :disabled="!!partageÉgale"
              color="primary"
            />
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('licenceContenu')">
            <v-alert
              v-if="partageÉgaleContenu && copierDonnées"
              class="mb-4"
              variant="outlined"
              type="info"
              density="compact"
              :title="t('licences.titrePartageÉgale')"
              :text="t('licences.infoPartageÉgale')"
            />
            <choix-licence
              :licence="licenceContenu"
              :permission-modifier="!partageÉgale"
              @changer-licence="l => (licenceContenu = l)"
            />
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('statut')">
            <choisir-statut
              :initial="statut"
              @choisir="stt => (statut = stt)"
            >
              <template #sélecteur="{choisirNouvelle}">
                <selecteur-bd
                  :multiples="false"
                  @selectionnee="ids => choisirNouvelle(ids[0])"
                />
              </template>
            </choisir-statut>
          </v-window-item>
          <v-window-item :value="listeÉtapes.indexOf('confirmation')">
            <div class="text-center">
              <v-btn
                class="mt-3"
                variant="outlined"
                :loading="enCréation"
                @click="() => créerBd()"
              >
                {{ t('bds.nouvelle.texteBtnCréation') }}
              </v-btn>
              <v-checkbox
                v-model="ouvrirAprèsCréation"
                color="primary"
                :label="t('bds.nouvelle.ouvrirAprèsCréation')"
              />
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
import type {bds, types} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {computed, ref, watchEffect} from 'vue';
import {useRouter} from 'vue-router';
import {useDisplay, useRtl} from 'vuetify';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../utils';
import SelecteurBd from './SélecteurBd.vue';
import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import ChoisirStatut from '/@/components/communs/ChoisirStatut.vue';
import ListeNoms from '/@/components/communs/listeNoms/ListeNoms.vue';
import ChoixLicence from '/@/components/licences/ChoixLicence.vue';
import SelecteurMotClef from '/@/components/motsClefs/SélecteurMotClef.vue';
import SelecteurNuee from '/@/components/nuées/SélecteurNuée.vue';

const props = defineProps<{init?: {type: 'nuée' | 'bd'; id: string}}>();
const émettre = defineEmits<{(é: 'nouvelle', id: string): void}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const router = useRouter();
const {isRtl} = useRtl();
const {mdAndUp} = useDisplay();

// Navigation
const dialogue = ref(false);

const listeÉtapes = [
  'cheminement',
  'gabaritBd',
  'gabaritNuée',
  'noms',
  'descriptions',
  'motsClefs',
  'licence',
  'licenceContenu',
  'statut',
  'confirmation',
] as const;
const étape = ref(props.init?.type === undefined ? 0 : listeÉtapes.indexOf('statut'));

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return 'bds.nouvelle.titreCheminement';
    case 'gabaritBd':
      return 'bds.nouvelle.titreGabaritBd';
    case 'gabaritNuée':
      return 'bds.nouvelle.titreGabaritNuée';
    case 'noms':
      return 'bds.nouvelle.titreNoms';
    case 'descriptions':
      return 'bds.nouvelle.titreDescriptions';
    case 'motsClefs':
      return 'bds.nouvelle.titreMotsClefs';
    case 'licence':
      return 'bds.nouvelle.titreLicence';
    case 'licenceContenu':
      return 'bds.nouvelle.titreLicenceContenu';
    case 'statut':
      return 'bds.nouvelle.titreStatut';
    case 'confirmation':
      return 'bds.nouvelle.titreConfirmation';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return 'bds.nouvelle.sousTitreCheminement';
    case 'gabaritBd':
      return 'bds.nouvelle.sousTitreGabaritBd';
    case 'gabaritNuée':
      return 'bds.nouvelle.sousTitreGabaritNuée';
    case 'noms':
      return 'bds.nouvelle.sousTitreNoms';
    case 'descriptions':
      return 'bds.nouvelle.sousTitreDescriptions';
    case 'motsClefs':
      return 'bds.nouvelle.sousTitreMotsClefs';
    case 'licence':
      return 'bds.nouvelle.sousTitreLicence';
    case 'licenceContenu':
      return 'bds.nouvelle.sousTitreLicenceContenu';
    case 'statut':
      return 'bds.nouvelle.sousTitreStatut';
    case 'confirmation':
      return 'bds.nouvelle.sousTitreConfirmation';
    default:
      return '';
  }
});

const cheminement = ref<'nouvelle' | 'bd' | 'nuée' | undefined>(props.init?.type);
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

    case 'licence':
      étape.value = listeÉtapes.indexOf(licenceContenuPareil.value ? 'statut' : 'licenceContenu');
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

    case 'statut':
      étape.value = listeÉtapes.indexOf(licenceContenuPareil.value ? 'licence' : 'licenceContenu');
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
    case 'licenceContenu':
      return {actif: !!licenceContenu.value, visible: true};
    case 'confirmation':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'statut':
      return {actif: !props.init, visible: !props.init};
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
  const schéma = await constl.nuées.générerSchémaBdNuée({
    idNuée,
    licence: 'ODbl-1_0', // À faire : incorporer dans la spécification de la nuée
  });
  if (schéma) {
    gabaritNuée.value = schéma;
    licence.value = schéma.licence;
    licenceContenu.value = schéma.licenceContenu;
  }
};
const copierDonnées = ref(true);

watchEffect(() => {
  if (props.init) {
    if (props.init.type === 'bd') choisirGabaritBd(props.init.id);
    else if (props.init.type === 'nuée') choisirGabaritNuée(props.init.id);
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

// Licences
const infoLicences = suivre(constl.licences.suivreLicences);

const licence = ref<string>();
const licenceContenuPareil = ref(true);
const licenceContenu = ref<string>();

const licenceBdÀCopier = suivre(constl.bds.suivreLicenceBd, {idBd: idBdÀCopier});
const partageÉgale = computed(() => {
  return (
    licenceBdÀCopier.value &&
    infoLicences.value?.[licenceBdÀCopier.value]?.conditions.includes('partageÉgal')
  );
});
watchEffect(() => {
  if (partageÉgale.value) licence.value = licenceBdÀCopier.value;
});

const licenceContenuBdÀCopier = suivre(constl.bds.suivreLicenceContenuBd, {idBd: idBdÀCopier});
const partageÉgaleContenu = computed(() => {
  return (
    licenceContenuBdÀCopier.value &&
    infoLicences.value?.[licenceContenuBdÀCopier.value]?.conditions.includes('partageÉgal')
  );
});
watchEffect(() => {
  if (partageÉgaleContenu.value) licenceContenu.value = licenceContenuBdÀCopier.value;
});

// Statut
const statut = ref<types.schémaStatut>({statut: 'active'});

// Création
const prêtÀCréer = computed(() => {
  if (!licence.value) return undefined;
  return {licenceChoisie: licence.value};
});

const ouvrirAprèsCréation = ref(true);

const enCréation = ref(false);

const créerBd = async () => {
  enCréation.value = true;

  let idBd: string | undefined;

  if (cheminement.value === 'nouvelle') {
    if (!prêtÀCréer.value) return;
    const {licenceChoisie} = prêtÀCréer.value;
    idBd = await constl.bds.créerBd({
      licence: licenceChoisie,
      licenceContenu: licenceContenu.value,
    });
    if (!idBd) throw new Error('Bd non créée.');

    await constl.bds.sauvegarderNomsBd({
      idBd,
      noms: Object.fromEntries(Object.entries(noms.value)),
    });
    await constl.bds.sauvegarderDescriptionsBd({
      idBd,
      descriptions: Object.fromEntries(Object.entries(descriptions.value)),
    });
    await constl.bds.ajouterMotsClefsBd({idBd, idsMotsClefs: motsClefs.value});
  } else if (cheminement.value === 'nuée') {
    if (!gabaritNuée.value) return;
    idBd = await constl.bds.créerBdDeSchéma({schéma: gabaritNuée.value});
  } else {
    if (!idBdÀCopier.value) return;
    idBd = await constl.bds.copierBd({
      idBd: idBdÀCopier.value,
      copierDonnées: copierDonnées.value,
    });
  }

  await constl.bds.changerStatutBd({
    idBd,
    statut: statut.value,
  });

  émettre('nouvelle', idBd);
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
