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
      :min-width="mdAndUp ? 500 : 300"
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
            <div class="text-center">
              <v-btn
                class="ma-3"
                variant="flat"
                color="primary"
                @click="suivreCheminementNouveauCompte"
              >
                {{ t('accueil.initialiserCompte.nouveauCompte') }}
              </v-btn>
              <v-btn
                class="ma-3"
                variant="outlined"
                @click="suivreCheminementConnecterCompte"
              >
                {{ t('accueil.initialiserCompte.connecter') }}
              </v-btn>
            </div>
          </v-window-item>
          <v-window-item :value="1">
            <ListeNoms
              :noms-initiaux="noms"
              :indice-nom="t('listeNomsProfil.indiceNom')"
              :indice-langue="t('communs.indiceLangue')"
              :texte-aucun-nom="t('communs.texteAucunNom')"
              autorisation-modification
              @ajuster-noms="ajusterNoms"
            />
          </v-window-item>
          <v-window-item :value="2">
            <ImageÉditable
              :editable="true"
              :src-image="srcImgProfil"
              :img-defaut="imgDefaut"
              :max-taille-image="MAX_TAILLE_IMAGE"
              :taille-avatar="150"
              @image-changee="(img?: ArrayBuffer) => imageChangée(img)"
            />
            <p class="mt-3 text-center text-caption">
              {{ t('accueil.initialiserCompte.texteImage') }}
            </p>
          </v-window-item>
          <v-window-item :value="3">
            <v-fade-transition>
              <div v-show="connexionsSFIP.length">
                <p class="mb-4">
                  {{ t('accueil.initialiserCompte.texteCompteÀRejoindre') }}
                </p>
                <v-select
                  v-model="compteÀRejoindre"
                  :items="comptesEnLigne.map(x => x.idBdCompte)"
                  :loading="!comptesEnLigne.length"
                  :disabled="!comptesEnLigne.length"
                  :label="t('accueil.initialiserCompte.indiceCompte')"
                  variant="outlined"
                >
                  <template #selection="{item}">
                    <JetonMembre :compte="item.value" />
                  </template>
                  <template #item="{item, props}">
                    <ItemMembre
                      v-bind="props"
                      :compte="item.value"
                      :montrer-anonymes="true"
                      simple
                    />
                  </template>
                </v-select>
                <p class="my-3 text-disabled">
                  {{
                    (comptesEnLigne.length
                      ? t('accueil.initialiserCompte.indiceComptePasVu')
                      : t('accueil.initialiserCompte.indiceRechercheComptes')) +
                    t('accueil.initialiserCompte.indiceEssaieDeConnecter')
                  }}
                </p>
              </div>
            </v-fade-transition>
            <v-fade-transition>
              <div v-show="!connexionsSFIP.length">
                {{ t('accueil.initialiserCompte.texteEnConnexion') }}
              </div>
            </v-fade-transition>
          </v-window-item>
          <v-window-item :value="4">
            <p class="mb-4">{{ t('accueil.initialiserCompte.texteCodeSecret') }}</p>
            <v-text-field
              v-model="codeSecret"
              :label="t('accueil.initialiserCompte.indiceCodeSecret')"
              variant="outlined"
            ></v-text-field>
          </v-window-item>
          <v-window-item :value="5">
            <p class="mb-4"> {{ t('accueil.initialiserCompte.textePersister.1') }} </p>
            <p class="mb-4"> {{ t('accueil.initialiserCompte.textePersister.2') }} </p>
            <p class="mb-4"> {{ t('accueil.initialiserCompte.textePersister.3') }} </p>

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
                @click="() => persisterDonnées()"
              >
                {{ t('accueil.initialiserCompte.persister') }}
              </v-btn>
              <v-btn
                class="mt-3 mx-3"
                variant="outlined"
                @click="étape++"
              >
                {{ t('accueil.initialiserCompte.pasPersister') }}
              </v-btn>
            </div>
          </v-window-item>
          <v-window-item :value="6">
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
              <p>
                <v-btn
                  class="mt-3"
                  variant="outlined"
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
import {computed, ref, inject} from 'vue';
import {useDisplay} from 'vuetify';
import {isBrowser} from 'wherearewe';
import type {client} from '@constl/ipa';
import type {réseau} from '@constl/ipa';
import {enregistrerÉcoute} from '/@/components/utils';

import {MAX_TAILLE_IMAGE} from '/@/consts';

import {utiliserImagesDéco} from '/@/composables/images';

import ImageÉditable from '/@/components/communs/ImageEditable.vue';
import ListeNoms from '/@/components/communs/listeNoms/ListeNoms.vue';
import ItemMembre from '/@/components/membres/ItemMembre.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import JetonMembre from './membres/JetonMembre.vue';

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const {mdAndUp} = useDisplay();

const {obtImageDéco} = utiliserImagesDéco();
const constl = inject<client.ClientConstellation>('constl');

// Navigation générale
const dialogue = ref(false);
const étape = ref(0);
const listeÉtapes = [
  'cheminement',
  'noms',
  'image',
  'compteÀRejoindre',
  'motDePasse',
  'persister',
  'cestParti',
] as const;
const cheminement = ref<'nouveau' | 'connecter'>();

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
    case 'compteÀRejoindre':
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
    case 'compteÀRejoindre':
      return {actif: !!compteÀRejoindre.value, visible: true};
    case 'motDePasse':
      return {actif: !!codeSecret.value, visible: true};
    case 'cestParti':
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
    case 'cestParti':
      return {actif: !enCréation.value, visible: true};
    default:
      return {actif: true, visible: true};
  }
});

const suivreCheminementNouveauCompte = () => {
  cheminement.value = 'nouveau';
  étape.value = listeÉtapes.indexOf('noms');
};
const suivreCheminementConnecterCompte = () => {
  cheminement.value = 'connecter';
  étape.value = listeÉtapes.indexOf('compteÀRejoindre');
};

const titreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return t('accueil.initialiserCompte.titreCheminement');
    case 'noms':
      return t('accueil.initialiserCompte.titreNoms');
    case 'image':
      return t('accueil.initialiserCompte.titreImage');
    case 'compteÀRejoindre':
      return t('accueil.initialiserCompte.titreCompteÀRejoindre');
    case 'motDePasse':
      return t('accueil.initialiserCompte.titreMotDePasse');
    case 'persister':
      return t('accueil.initialiserCompte.titrePersister');
    case 'cestParti':
      return t('accueil.initialiserCompte.titreCestParti');
    default:
      return '';
  }
});

const sousTitreCarte = computed(() => {
  const é = listeÉtapes[étape.value];
  switch (é) {
    case 'cheminement':
      return t('accueil.initialiserCompte.sousTitreCheminement');
    case 'noms':
      return t('accueil.initialiserCompte.sousTitreNoms');
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
const imageSélectionnée = ref<ArrayBuffer>();
const srcImgProfil = computed(() => {
  if (imageSélectionnée.value) {
    return URL.createObjectURL(new Blob([imageSélectionnée.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
const imgDefaut = obtImageDéco('profil');

const imageChangée = (img?: ArrayBuffer) => {
  imageSélectionnée.value = img;
};

// Rejoindre compte
const codeSecret = ref<string>();
const compteÀRejoindre = ref<string>();
const comptesEnLigne = ref<réseau.infoMembreRéseau[]>([]);
const connexionsSFIP = ref<
  {
    adresse: string;
    pair: string;
  }[]
>([]);
const monIdCompte = ref<string>();

enregistrerÉcoute(
  constl?.réseau?.suivreConnexionsPostesSFIP({
    f: connexions => (connexionsSFIP.value = connexions),
  }),
);
enregistrerÉcoute(constl?.suivreIdBdCompte({f: idCompte => (monIdCompte.value = idCompte)}));
enregistrerÉcoute(
  constl?.réseau?.suivreComptesRéseauEtEnLigne({
    f: comptes => (comptesEnLigne.value = comptes.filter(c => c.idBdCompte !== monIdCompte.value)),
    profondeur: Infinity,
  }),
);

// Persister les données
const persisterDonnées = async () => {
  const persisté = await navigator.storage.persist();
  if (persisté) {
    suivant();
    donnéesPersistées.value = true;
  }
};
const donnéesPersistées = ref(false);
navigator.storage.persisted().then(x => (donnéesPersistées.value = x));

// Création ou connexion compte
const srcImageLogo = ref<string>();
import('/@/assets/logo.svg').then(x => (srcImageLogo.value = x.default));

const enCréation = ref(false);
const créerCompte = async () => {
  enCréation.value = true;
  if (!constl) return;
  if (cheminement.value === 'nouveau') {
    for (const [lng, nom] of Object.entries(noms.value)) {
      await constl.profil?.sauvegarderNom({langue: lng, nom});
    }
    if (imageSélectionnée.value) {
      await constl.profil?.sauvegarderImage({image: imageSélectionnée.value});
    }
  } else {
    if (!compteÀRejoindre.value || !codeSecret.value) return;
    await constl.demanderEtPuisRejoindreCompte({
      idCompte: compteÀRejoindre.value,
      codeSecret: codeSecret.value,
    });
  }

  enCréation.value = false;
};

const idCompte = ref();
constl?.suivreIdBdCompte({f: id => (idCompte.value = id)});
</script>
