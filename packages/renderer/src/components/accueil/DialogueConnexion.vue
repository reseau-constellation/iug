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
          <div v-if="mode === 'numériser'">
            <v-progress-circular v-if="enCoursDeConnexion"></v-progress-circular>
            <p v-else-if="erreurConnexion">Erreur de connexion. <v-btn @click="() => erreurConnexion = false">Ressayer</v-btn></p>
            <lecteur-code-r2
              v-else-if="!connectéeÀ"
              :schema="schémaCodeR2Connexion"
              @detecte="({valJSON}) => lorsqueDétecté({adresses: valJSON?.adresses})"
            />
            <p v-else>Connecté à {{ connectéeÀ }}.</p>
          </div>
          <qrcode-vue
            v-else
            :value="adressesTexte"
            :size="200"
          />
        </div>
        <v-btn-toggle v-model="mode">
          <v-btn value="afficher">
            <v-icon start>mdi-qrcode</v-icon>
            {{ t('accueil.connexion.afficherCode') }}
          </v-btn>
          <v-btn value="numériser">
            <v-icon start>mdi-qrcode-scan</v-icon>
            {{ t('accueil.connexion.numériserCode') }}
          </v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import {suivre} from '@constl/vue';
import QrcodeVue from 'qrcode.vue';
import {computed} from 'vue';
import {utiliserConstellation} from '../utils';

import LecteurCodeR2 from '/@/components/communs/LecteurCodeR2.vue';
import {schémaCodeR2Connexion} from '/@/codesR2';

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

const adressesDétectées = ref<string[]>();

function lorsqueDétecté({adresses}: {adresses?: string[]}) {
  adressesDétectées.value = adresses;
}

const connectéeÀ = ref<string>();
const enCoursDeConnexion = ref(false);
const erreurConnexion = ref(false);
watchEffect(async () => {
  connectéeÀ.value = undefined;
  enCoursDeConnexion.value = true;
  erreurConnexion.value = false;
  if (adressesDétectées.value) {
    try {
      for (const a of adressesDétectées.value) {
        await constl.réseau.connecterÀAdresse({adresse: a});
        connectéeÀ.value = a;
        erreurConnexion.value = false;
        break;
      }
    } catch {
      erreurConnexion.value = true;
    }
  }
});
</script>
