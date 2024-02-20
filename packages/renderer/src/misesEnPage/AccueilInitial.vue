<template>
  <!--
    <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <v-img height="300" src="@/assets/logo.svg" />

      
      <h1 class="text-h2 font-weight-bold">Constellation</h1>
      <div class="text-body-1 font-weight-light mb-n1">Le réseau distribué pour les données scientifiques</div>

      <div class="py-14" />

      <v-row class="d-flex align-center justify-center">
        <v-col cols="auto">
          <v-btn
            href="https://vuetifyjs.com/components/all/"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            <v-icon
              icon="mdi-view-dashboard"
              size="large"
              start
            />

            Components
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            color="primary"
            href="https://vuetifyjs.com/introduction/why-vuetify/#feature-guides"
            min-width="228"
            rel="noopener noreferrer"
            size="x-large"
            target="_blank"
            variant="flat"
          >
            <v-icon
              icon="mdi-speedometer"
              size="large"
              start
            />

            Get Started
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn
            href="https://community.vuetifyjs.com/"
            min-width="164"
            rel="noopener noreferrer"
            target="_blank"
            variant="text"
          >
            <v-icon
              icon="mdi-account-group"
              size="large"
              start
            />

            Community
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
  -->
  <div>
    <v-container
      class="text-center"
      style="height: 100%"
    >
      <v-row
        align="center"
        no-gutters
        style="height: 80%"
      >
        <v-col>
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
              <template #activator="{props}">
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
        </v-col>
      </v-row>
    </v-container>

    <v-footer>
      <v-container
        class="text-center"
        style="height: 100%"
      >
        <p class="text-disabled">
          {{ t('accueil.piedDePage') }}
        </p>
      </v-container>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from 'vue';
import {useDisplay} from 'vuetify';

import LogoAnimé from '/@/components/LogoAnimé.vue';
import InitialiserCompte from '/@/components/InitialiserCompte.vue';

import {கிளிமூக்கை_பயன்படுத்து, எண்களைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {constellation, suivre} from '../components/utils';

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const constl = constellation();
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
