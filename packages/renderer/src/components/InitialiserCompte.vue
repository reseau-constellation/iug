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
      :width="mdAndUp ? 500 : 300"
    >
      <v-card-title class="text-h5 justify-space-between">
        <span>{{ titreCarte }}</span>
      </v-card-title>
      <v-window v-model="étape">
        <v-window-item :value="1">
          <v-card-text class="d-flex justify-center align-center">
            <span class="text-h2">Card 1</span>
          </v-card-text>
        </v-window-item>
        <v-window-item :value="2">
          <v-card-text class="text-center">
            <ImageÉditable
              :editable="true"
              :src-image="srcImgProfil"
              :img-defaut="imgDefaut"
              :max-taille-image="MAX_TAILLE_IMAGE"
              :taille-avatar="150"
              @image-changee="(img: ArrayBuffer)=>imageChangée(img)"
            />
            <p class="mt-3 text-center">Image</p>
          </v-card-text>
        </v-window-item>
        <v-window-item :value="3">
          <v-card-text class="align-center">
            <p class="mb-4"> {{ $t('accueil.initialiserCompte.textePersister.1') }} </p>
            <p class="mb-4"> {{ $t('accueil.initialiserCompte.textePersister.2') }} </p>
            <p class="mb-4"> {{ $t('accueil.initialiserCompte.textePersister.3') }} </p>

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
                {{ $t('accueil.initialiserCompte.déjàPersistées') }}
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
                @click="()=>persisterDonnées()"
              >
                {{ $t('accueil.initialiserCompte.persister') }}
              </v-btn>
              <v-btn
                class="mt-3 mx-3"
                variant="outlined"
                @click="étape++"
              >
                {{ $t('accueil.initialiserCompte.pasPersister') }}
              </v-btn>
            </div>
          </v-card-text>
        </v-window-item>
        <v-window-item :value="4">
          <v-card-text class="pa-4 text-center">
            <v-img
              class="mb-4"
              contain
              height="128"
              src="assets/logo.svg"
            ></v-img>
            <h3 class="text-h6 font-weight-light mb-2">
              {{ $t('accueil.initialiserCompte.bienvenu') }}
            </h3>
            <span class="text-caption text-grey">{{
              $t('accueil.initialiserCompte.sousTitreBienvenu')
            }}</span>
            <p>
              <v-btn
                class="mt-3"
                variant="outlined"
                :loading="enCréation"
                @click="()=>créerCompte()"
              >
                {{ $t('accueil.initialiserCompte.cestParti') }}
              </v-btn>
            </p>
          </v-card-text>
        </v-window-item>
      </v-window>
      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          v-if="étape > 1"
          variant="text"
          :disabled="!retourActif"
          @click="étape--"
        >
          {{ $t('communs.retour') }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="étape < 4"
          color="primary"
          variant="flat"
          :disabled="!suivantActif"
          @click="étape++"
        >
          {{ $t('communs.suivant') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {useI18n} from 'vue-i18n';

import ImageÉditable from '/@/components/communs/imageÉditable.vue';

const {mdAndUp} = useDisplay();
const {t} = useI18n();

// Navigation générale
const dialogue = ref(false);
const étape = ref(0);

const titreCarte = computed(() => {
  switch (étape.value) {
    case 1:
      return t('accueil.initialiserCompte.titreNoms');
    case 2:
      return t('accueil.initialiserCompte.titreImage');
    case 3:
      return t('accueil.initialiserCompte.titrePersister');
    case 4:
      return t('accueil.initialiserCompte.titreCestParti');
    default:
      return '';
  }
});

const retourActif = computed(()=>{
    switch (étape.value) {
    case 2:
      return true;
    case 3:
      return true;
    case 4:
      return !enCréation.value;
    default:
      return false;
  }
});

const suivantActif = computed(()=>{
    switch (étape.value) {
    case 1:
      return true;
    case 2:
      return true;
    case 3:
      return true;
    default:
      return false;
  }
});

// Image
const MAX_TAILLE_IMAGE = 500 * 1000; // 500 kilooctets
const imageSélectionnée = ref<ArrayBuffer>();
const srcImgProfil = computed(() => {
  if (imageSélectionnée.value) {
    return URL.createObjectURL(new Blob([imageSélectionnée.value], {type: 'image'}));
  } else {
    return undefined;
  }
});
const imgDefaut = ref('https://réseau-constellation.ca/img/logo.2a562100.svg');  // imagesDéco('profil');
const imageChangée = (img?: ArrayBuffer) => {
  imageSélectionnée.value = img;
};

// Persister les données
const persisterDonnées = async () => {
  const persisté = await navigator.storage.persist();
  if (persisté) {
    étape.value++;
    donnéesPersistées.value = true;
  }
};
const donnéesPersistées = ref(false);
navigator.storage.persisted().then(x => (donnéesPersistées.value = x));

// Création compte
const enCréation = ref(false);
const créerCompte = async () => {
    enCréation.value = true;
    
    enCréation.value = false;
};
</script>
