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
      max-width="90%"
      max-height="90%"
    >
      <v-card-item>
        <v-card-title class="d-flex align-center">
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
          <div
            v-if="mode === 'numériser'"
            style="max-width: 350"
            class="mx-auto"
          >
            <v-progress-circular v-if="enCoursDeConnexion"></v-progress-circular>
            <p v-else-if="erreurConnexion">
              Erreur de connexion.
              <v-btn @click="() => (erreurConnexion = false)">Ressayer</v-btn>
            </p>
            <lecteur-code-r2
              v-else-if="!connectéeÀ"
              :schema="schémaCodeR2Connexion"
              @detecte="({valJSON}) => lorsqueDétecté({adresses: valJSON?.adresses})"
            />
            <p v-else>Connecté à {{ connectéeÀ }}.</p>
          </div>
          <code-r2
            v-else
            :valeur="adressesTexte"
            :props-code="{size: 300}"
          />
        </div>
        <v-btn-toggle v-model="mode">
          <v-btn value="afficher">
            <v-icon :start="mdAndUp">mdi-qrcode</v-icon>
            <span v-if="mdAndUp">{{ t('accueil.connexion.afficherCode') }}</span>
          </v-btn>
          <v-btn value="numériser">
            <v-icon :start="mdAndUp">mdi-qrcode-scan</v-icon>
            <span v-if="mdAndUp">{{ t('accueil.connexion.numériserCode') }}</span>
          </v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import {suivre} from '@constl/vue';
import {computed} from 'vue';
import {utiliserConstellation} from '../utils';

import {schémaCodeR2Connexion} from '/@/codesR2';
import CodeR2 from '/@/components/communs/CodeR2.vue';
import LecteurCodeR2 from '/@/components/communs/LecteurCodeR2.vue';

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();
const {mdAndUp} = useDisplay();
const constl = utiliserConstellation();

// Contrôles
const dialogue = ref(false);
const mode = ref<'afficher' | 'numériser'>('afficher');

// Nos adresses
const adresses = suivre(constl.réseau.suivreMesAdresses);

const adressesTexte = computed(() => {
  return adresses.value ? JSON.stringify(adresses.value, undefined, 2) : undefined;
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
  erreurConnexion.value = false;
  if (adressesDétectées.value) {
    enCoursDeConnexion.value = true;
    try {
      for (const a of adressesDétectées.value) {
        await constl.réseau.connecterÀAdresse({adresse: a});
        connectéeÀ.value = a;
        erreurConnexion.value = false;
        enCoursDeConnexion.value = false;
        break;
      }
    } catch {
      erreurConnexion.value = true;
    }
  }
});
</script>
