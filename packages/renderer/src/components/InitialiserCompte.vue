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
          <v-window-item :value="iÉtape('cheminement')">
            <v-list>
              <v-list-item
                prepend-icon="mdi-creation-outline"
                :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                @click="suivreCheminementNouveauCompte"
              >
                {{ t('accueil.initialiserCompte.nouveauCompte') }}
              </v-list-item>
              <v-list-item
                prepend-icon="mdi-login-variant"
                :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
                @click="suivreCheminementConnecterCompte"
              >
                {{ t('accueil.initialiserCompte.connecter') }}
              </v-list-item>
            </v-list>
          </v-window-item>
          <v-window-item :value="iÉtape('noms')">
            <ListeNoms
              :noms-initiaux="noms"
              :etiquette-nom="t('listeNomsProfil.étiquetteNom')"
              :indice-nom="t('listeNomsProfil.indiceNom')"
              :indice-langue="t('communs.indiceLangue')"
              :texte-aucun-nom="t('communs.texteAucunNom')"
              autorisation-modification
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :value="iÉtape('image')">
            <ImageEditable
              :editable="true"
              :src-image="srcImgProfil"
              :img-defaut="imgDefaut"
              :max-taille-image="MAX_TAILLE_IMAGE"
              :taille-avatar="150"
              @image-changee="(img?) => imageChangée(img)"
            />
            <p class="mt-3 text-center text-caption">
              {{ t('accueil.initialiserCompte.texteImage') }}
            </p>
          </v-window-item>
          <v-window-item :value="iÉtape('rejoindreCompte')">
            <v-btn-toggle
              v-model="modeRejoindreCompte"
              color="primary"
              class="mb-2"
            >
              <v-btn value="automatique">
                <v-icon start>mdi-qrcode</v-icon>
                {{ t('accueil.initialiserCompte.rejoindreAutomatiquement') }}
              </v-btn>
              <v-btn value="manuel">
                <v-icon start>mdi-account-search</v-icon>
                {{ t('accueil.initialiserCompte.rejoindreManuellement') }}
              </v-btn>
            </v-btn-toggle>
            <div v-if="modeRejoindreCompte === 'manuel'">
              <v-fade-transition>
                <div v-show="connexionsSFIP?.length">
                  <v-select
                    v-model="compteÀRejoindre"
                    :items="comptesEnLigneSansMoi.map(x => x.idCompte)"
                    :loading="!comptesEnLigneSansMoi.length"
                    :disabled="!comptesEnLigneSansMoi.length"
                    :label="t('accueil.initialiserCompte.indiceCompte')"
                    variant="outlined"
                  >
                    <template #selection="{item}">
                      <JetonMembre :compte="item.value" />
                    </template>
                    <template #item="{item, props: propsActivateur}">
                      <ItemMembre
                        v-bind="propsActivateur"
                        :compte="item.value"
                        :montrer-anonymes="true"
                        simple
                      />
                    </template>
                  </v-select>
                  <p class="my-3 text-disabled">
                    {{
                      (comptesEnLigneSansMoi.length
                        ? t('accueil.initialiserCompte.indiceComptePasVu')
                        : t('accueil.initialiserCompte.indiceRechercheComptes')) +
                        t('accueil.initialiserCompte.indiceEssaieDeConnecter')
                    }}
                  </p>
                </div>
              </v-fade-transition>
              <v-fade-transition>
                <div v-show="!connexionsSFIP?.length">
                  {{ t('accueil.initialiserCompte.texteEnConnexion') }}
                </div>
              </v-fade-transition>
            </div>
            <div v-else>
              <lecteur-code-r2
                :schema="schémaCodeR2AjoutDispositif"
                @detecte="info => info.valJSON && compteÀRejoindreDétecté(info.valJSON)"
              />
            </div>
          </v-window-item>
          <v-window-item :value="4">
            <p class="mb-4">{{ t('accueil.initialiserCompte.texteCodeSecret') }}</p>
            <v-text-field
              v-model="codeSecretCompte"
              :label="t('accueil.initialiserCompte.indiceCodeSecret')"
              variant="outlined"
            ></v-text-field>
          </v-window-item>
          <v-window-item :value="iÉtape('persister')">
            <p class="mb-4"> {{ t('accueil.initialiserCompte.textePersister.0') }} </p>
            <span class="font-weight-bold">{{ t('accueil.initialiserCompte.plusDInfo') }}</span>
            <v-btn
              :icon="détailsPersister ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              size="xsmall"
              variant="flat"
              @click="() => (détailsPersister = !détailsPersister)"
            ></v-btn>
            <v-expand-transition>
              <div v-show="détailsPersister">
                <p class="mb-4"> {{ t('accueil.initialiserCompte.textePersister.1') }} </p>
                <p class="mb-4"> {{ t('accueil.initialiserCompte.textePersister.2') }} </p>
                <p class="mb-4"> {{ t('accueil.initialiserCompte.textePersister.3') }} </p>
              </div>
            </v-expand-transition>

            <div
              v-if="donnéesPersistées"
              class="text-center"
            >
              <v-btn
                class="mt-3 mx-3"
                variant="outlined"
                @click="étape++"
              >
                <v-icon start>mdi-check</v-icon>
                {{ t('accueil.initialiserCompte.déjàPersistées') }}
              </v-btn>
            </div>
            <div
              v-else
              class="text-center"
            >
              <v-btn
                class="mt-3 mx-3"
                color="primary"
                variant="flat"
                append-icon="mdi-content-save-outline"
                @click="() => persisterDonnées()"
              >
                {{ t('accueil.initialiserCompte.persister') }}
              </v-btn>
              <v-btn
                class="mt-3 mx-3"
                variant="outlined"
                append-icon="mdi-content-save-off-outline"
                @click="étape++"
              >
                {{ t('accueil.initialiserCompte.pasPersister') }}
              </v-btn>
            </div>
          </v-window-item>
          <v-window-item :value="iÉtape('cestParti')">
            <v-img
              class="mb-4"
              contain
              height="128"
              :src="srcImageLogo"
            ></v-img>
            <div class="text-center">
              <h3 class="text-h6 font-weight-light mb-2">
                {{ t('accueil.initialiserCompte.bienvenu') }}
              </h3>
              <span class="text-caption text-grey">{{
                t('accueil.initialiserCompte.sousTitreBienvenu')
              }}</span>

              <conditions-utilisation>
                <template #activateur="{props: propsActivateur}">
                  <v-checkbox
                    v-bind="propsActivateur"
                    v-model="état.acceptées"
                    color="primary"
                    hide-details
                    readonly
                  >
                    <template #label>
                      <div>
                        {{ t('conditions.jaccepte') }}
                        <v-icon
                          end
                          size="small"
                          icon="mdi-open-in-new"
                        />
                      </div>
                    </template>
                  </v-checkbox>
                </template>
              </conditions-utilisation>
              <p>
                <v-btn
                  variant="outlined"
                  :disabled="!état.acceptées"
                  :loading="enCréation"
                  @click="() => créerCompte()"
                >
                  {{ t('accueil.initialiserCompte.cestParti') }}
                </v-btn>
              </p>
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
import {rechercher, suivre} from '@constl/vue';
import {computed, ref} from 'vue';
import {useDisplay, useRtl} from 'vuetify';
import {isBrowser} from 'wherearewe';

import {utiliserConstellation} from '/@/components/utils';

import {MAX_TAILLE_IMAGE} from '/@/consts';

import {utiliserImagesDéco} from '/@/composables/images';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import ConditionsUtilisation from './ConditionsUtilisation.vue';
import JetonMembre from './membres/JetonMembre.vue';
import BtnRetour from '/@/components/communs/BtnRetour.vue';
import BtnSuivant from '/@/components/communs/BtnSuivant.vue';
import ImageEditable from '/@/components/communs/ImageEditable.vue';
import LecteurCodeR2 from '/@/components/communs/LecteurCodeR2.vue';
import ListeNoms from '/@/components/communs/listeNoms/ListeNoms.vue';
import ItemMembre from '/@/components/membres/ItemMembre.vue';

import {schémaCodeR2AjoutDispositif} from '/@/codesR2';
import {utiliserÉtatConditions} from '/@/état/conditions';

const props = defineProps<{cheminement?: 'nouveau' | 'connecter'}>();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const {mdAndUp} = useDisplay();
const {isRtl} = useRtl();

const {obtImageDéco} = utiliserImagesDéco();
const constl = utiliserConstellation();

// Navigation générale
const dialogue = ref(false);
const listeÉtapes = [
  'cheminement',
  'noms',
  'image',
  'rejoindreCompte',
  'motDePasse',
  'persister',
  'cestParti',
] as const;
const iÉtape = (étape: (typeof listeÉtapes)[number]): number => {
  return listeÉtapes.indexOf(étape);
};
const étape = ref(
  props.cheminement === undefined
    ? 0
    : listeÉtapes.indexOf(props.cheminement === 'connecter' ? 'rejoindreCompte' : 'noms'),
);
const cheminement = ref<'nouveau' | 'connecter' | undefined>(props.cheminement);

const suivant = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'image':
      étape.value = listeÉtapes.indexOf(isBrowser ? 'persister' : 'cestParti');
      break;

    case 'motDePasse':
      étape.value = listeÉtapes.indexOf(isBrowser ? 'persister' : 'cestParti');
      break;

    default:
      étape.value++;
      break;
  }
};

const retour = () => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'rejoindreCompte':
      étape.value = listeÉtapes.indexOf('cheminement');
      break;

    case 'cestParti':
      étape.value = listeÉtapes.indexOf(
        isBrowser ? 'persister' : cheminement.value === 'connecter' ? 'motDePasse' : 'image',
      );
      break;

    case 'persister':
      étape.value = listeÉtapes.indexOf(cheminement.value === 'connecter' ? 'motDePasse' : 'image');
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
    case 'noms':
      return {actif: Object.keys(noms.value).length > 0, visible: true};
    case 'rejoindreCompte':
      return {actif: !!(compteÀRejoindre.value && codeSecretCompte.value), visible: true};
    case 'cestParti':
      return {actif: false, visible: false};
    default:
      return {actif: true, visible: true};
  }
});

const retourActif = computed<{actif: boolean; visible: boolean}>(() => {
  const é = listeÉtapes[étape.value];
  const cheminementSpécifié = props.cheminement !== undefined;
  switch (é) {
    case 'rejoindreCompte':
    case 'noms':
      return {actif: !cheminementSpécifié, visible: !cheminementSpécifié};
    case 'cheminement':
      return {actif: false, visible: false};
    case 'cestParti':
      return {actif: !enCréation.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});

const suivreCheminementNouveauCompte = () => {
  cheminement.value = 'nouveau';
  étape.value = iÉtape('noms');
};
const suivreCheminementConnecterCompte = () => {
  cheminement.value = 'connecter';
  étape.value = iÉtape('rejoindreCompte');
};

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return 'accueil.initialiserCompte.titreCheminement';
    case 'noms':
      return 'accueil.initialiserCompte.titreNoms';
    case 'image':
      return 'accueil.initialiserCompte.titreImage';
    case 'rejoindreCompte':
      return t('accueil.initialiserCompte.titreCompteÀRejoindre');
    case 'motDePasse':
      return 'accueil.initialiserCompte.titreMotDePasse';
    case 'persister':
      return 'accueil.initialiserCompte.titrePersister';
    case 'cestParti':
      return 'accueil.initialiserCompte.titreCestParti';
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return 'accueil.initialiserCompte.sousTitreCheminement';
    case 'noms':
      return 'accueil.initialiserCompte.sousTitreNoms';
    default:
      return '';
  }
});

// Noms
const noms = ref<{[lng: string]: string}>({});
const ajusterNoms = (nms: {[lng: string]: string}) => {
  noms.value = nms;
};

// Image
const imageSélectionnée = ref<{contenu: ArrayBuffer; fichier: string}>();
const srcImgProfil = computed(() => {
  if (imageSélectionnée.value) {
    return URL.createObjectURL(new Blob([imageSélectionnée.value.contenu], {type: 'image'}));
  } else {
    return undefined;
  }
});
const imgDefaut = obtImageDéco('profil');

const imageChangée = (img?: {contenu: ArrayBuffer; fichier: string}) => {
  imageSélectionnée.value = img;
};

// Rejoindre compte
const modeRejoindreCompte = ref<'automatique' | 'manuel'>('automatique');

const codeSecretCompte = ref<string>();
const compteÀRejoindre = ref<string>();
const {résultats: comptesEnLigne} = rechercher(constl.réseau.suivreComptesRéseauEtEnLigne);
const comptesEnLigneSansMoi = computed(() =>
  (comptesEnLigne.value || []).filter(c => c.idCompte !== monIdCompte.value),
);

const monIdCompte = suivre(constl.suivreIdCompte);

const connexionsSFIP = suivre(constl.réseau.suivreConnexionsPostesSFIP, {});

const compteÀRejoindreDétecté = async ({
  idCompte,
  codeSecret,
  adresses,
}: {
  idCompte: string;
  codeSecret: string;
  adresses?: string[];
}) => {
  if (adresses) {
    for (const adresse of adresses) {
      try {
        await constl.réseau.connecterÀAdresse({adresse});
        break;
      } catch {
        // Tant pis
      }
    }
  }
  compteÀRejoindre.value = idCompte;
  codeSecretCompte.value = codeSecret;
};

// Persister les données
const persisterDonnées = async () => {
  const persisté = await navigator.storage.persist();
  if (persisté) {
    donnéesPersistées.value = true;
  }
  suivant();
};
const donnéesPersistées = ref(false);
navigator.storage.persisted().then(x => (donnéesPersistées.value = x));

const détailsPersister = ref(false);

// Conditions
const état = utiliserÉtatConditions();

// Création ou connexion compte
const srcImageLogo = ref<string>();
import('/@/assets/logo.svg').then(x => (srcImageLogo.value = x.default));

const enCréation = ref(false);
const créerCompte = async () => {
  enCréation.value = true;
  if (cheminement.value === 'nouveau') {
    for (const [lng, nom] of Object.entries(noms.value)) {
      await constl.profil?.sauvegarderNom({langue: lng, nom});
    }
    if (imageSélectionnée.value) {
      const {contenu, fichier} = imageSélectionnée.value;
      await constl.profil?.sauvegarderImage({
        image: {contenu: new Uint8Array(contenu), nomFichier: fichier},
      });
    }
    await constl.profil.initialiser();
  } else {
    if (!compteÀRejoindre.value || !codeSecretCompte.value) return;
    await constl.demanderEtPuisRejoindreCompte({
      idCompte: compteÀRejoindre.value,
      codeSecret: codeSecretCompte.value,
    });
  }

  enCréation.value = false;
};

const idCompte = ref();
constl.suivreIdCompte({f: id => (idCompte.value = id)});
</script>
