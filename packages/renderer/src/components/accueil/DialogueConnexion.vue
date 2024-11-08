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
      :min-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          {{ t('accueil.page.connectivité.réseau.connexion.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text class="text-center">
        <div class="my-2">
          <qrcode-stream
            v-if="mode==='numériser'"
            :track="paintBoundingBox"
            @detect="onDetect"
            @error="onError"
          />
          <qrcode-vue
            v-else
            :value="adressesTexte"
            :size="200"
          />
        </div>
        <v-btn-toggle v-model="mode">
          <v-btn value="afficher">
            <v-icon start>mdi-qrcode</v-icon>
            "Afficher mon code"
          </v-btn>
          <v-btn value="numériser">
            <v-icon start>mdi-qrcode-scan</v-icon>
            "Numériser un code"
          </v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref, watchEffect} from 'vue';
import {QrcodeStream} from 'vue-qrcode-reader';
import {useDisplay} from 'vuetify';

import {suivre} from '@constl/vue';
import QrcodeVue from 'qrcode.vue';
import {computed} from 'vue';
import {utiliserConstellation} from '../utils';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();

const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const constl = utiliserConstellation();

// Contrôles
const dialogue = ref(false);
const mode = ref<'afficher' | 'numériser'>('afficher');

// Nos adresses
const adresses = suivre(constl.réseau.suivreMesAdresses);

const adressesTexte = computed(() => {
  return adresses.value ? JSON.stringify(adresses.value.map(a => a.toString())) : undefined;
});

// Détection d'adresse
type TypeCodeDétecté = {
  rawValue: string;
  boundingBox: {x: number; y: number; width: number; height: number};
};
function paintBoundingBox(detectedCodes: TypeCodeDétecté[], ctx: CanvasRenderingContext2D) {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: {x, y, width, height},
    } = detectedCode;

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#007bff';
    ctx.strokeRect(x, y, width, height);
  }
}
const adressesDétectées = ref<string>();

const erreur = ref<string>();
function onError(err: {value: string; name: string; message: string}) {
  erreur.value = `[${err.name}]: `;

  if (err.name === 'NotAllowedError') {
    erreur.value += 'you need to grant camera access permission';
  } else if (err.name === 'NotFoundError') {
    erreur.value += 'no camera on this device';
  } else if (err.name === 'NotSupportedError') {
    erreur.value += 'secure context required (HTTPS, localhost)';
  } else if (err.name === 'NotReadableError') {
    erreur.value += 'is the camera already in use?';
  } else if (err.name === 'OverconstrainedError') {
    erreur.value += 'installed cameras are not suitable';
  } else if (err.name === 'StreamApiNotSupportedError') {
    erreur.value += 'Stream API is not supported in this browser';
  } else if (err.name === 'InsecureContextError') {
    erreur.value +=
      'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.';
  } else {
    erreur.value += err.message;
  }
}

function onDetect(detectedCodes: TypeCodeDétecté[]) {
  try {
    adressesDétectées.value = JSON.stringify(detectedCodes.map(code => code.rawValue));
  } catch {
    adressesDétectées.value = undefined;
  }
}

const connectéeÀ = ref<string>();
watchEffect(async () => {
  connectéeÀ.value = undefined;
  if (adressesDétectées.value) {
    try {
      const listeAdresses = JSON.parse(adressesDétectées.value);
      if (Array.isArray(listeAdresses)) {
        for (const a of listeAdresses) {
          await constl.réseau.connecterÀAdresse({adresse: a});
          connectéeÀ.value = a;
        }
      }
    } catch {
      //
    }
  }
});
</script>
