<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <LogoAnimé
        :class="{'my-7': !mdAndUp}"
        :largeur="mdAndUp ? 500 : 250"
        :delai="délai"
        :debut="début"
      />
      <h1 :class="['mt-6', mdAndUp ? 'text-h1' : 'text-h3']">
        {{ t('communs.constellation') }}
      </h1>
      <p class="text-subtitle-1 text-disabled">
        {{ t('accueil.version', {version: versionAppli}) }}
      </p>

      <div
        class="my-6"
        style="height: 150px"
      >
        <InitialiserCompte>
          <template #activateur="{props}">
            <v-fade-transition
              v-bind="props"
              leave-absolute
            >
              <v-btn
                v-show="animationTerminée && constellationPrète"
                variant="outlined"
              >
                {{ t('accueil.démarrer') }}
              </v-btn>
            </v-fade-transition>
          </template>
        </InitialiserCompte>
      </div>
      <p class="text-disabled">
        {{ t('accueil.piedDePage') }}
      </p>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import {suivre} from '@constl/vue';
import {onMounted, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import InitialiserCompte from '/@/components/InitialiserCompte.vue';
import LogoAnimé from '/@/components/LogoAnimé.vue';

import {எண்களைப்_பயன்படுத்து, மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {utiliserConstellation} from '../components/utils';

const {mdAndUp} = useDisplay();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();
const VERSION_APPLI = import.meta.env.VITE_APP_VERSION;

const {பதிப்பை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();
const versionAppli = பதிப்பை_வடிவூட்டு(VERSION_APPLI);

const emit = defineEmits(['entrer']);
const entrer = () => emit('entrer');

const délai = ref(3);
const début = ref(2);
const animationTerminée = ref(false);
onMounted(() => {
  setTimeout(() => (animationTerminée.value = true), (délai.value + début.value) * 1000);
});

const constellationPrète = ref(false);
constl.obtIdCompte().then(() => (constellationPrète.value = true));

const compteInitialisé = suivre(constl.profil.suivreInitialisé);

watchEffect(() => {
  if (animationTerminée.value && compteInitialisé.value) entrer();
});
</script>
