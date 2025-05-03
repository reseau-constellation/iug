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
        <v-card-title class="d-flex align-center">
          {{ t('accueil.page.connectivité.serveurLocal.titre') }}
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          />
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-icon start>mdi-information-outline</v-icon>Vous pouvez autoriser l'accès au nœud local
        afin de pouvoir accéder Constellation à partir d'applications tièrces. Voir comment
        connecter une application dans les langages suivants :

        <p class="text-center mt-2">
          <v-chip
            v-for="langage in langages"
            :key="langage.nom"
            class="me-2 mb-2"
            label
            variant="outlined"
            append-icon="mdi-open-in-new"
            @click="() => ouvrirLien(langage.lien)"
          >
            <template #prepend>
              <v-icon
                start
                :color="langage.couleur"
              >
                <component
                  :is="langage.icône"
                  class="icon-svg"
                ></component>
              </v-icon>
            </template>
            {{ t(`communs.langagesInformatiques.${langage.nom}.nom`) }}
          </v-chip>
        </p>
        <v-divider />
        <v-tabs
          v-model="onglet"
          class="mt-2"
          color="primary"
        >
          <v-tab value="requêtes">
            <v-badge
              :content="nRequêtesFormatté"
              color="primary"
              :model-value="!!nRequêtes"
            >
              Requêtes
            </v-badge>
          </v-tab>
          <v-tab value="connexions">
            <v-badge
              :content="nConnexionsFormatté"
              color="primary"
              :model-value="!!nConnexions"
            >
              Connexions
            </v-badge>
          </v-tab>
        </v-tabs>
        <v-window v-model="onglet">
          <v-window-item value="requêtes">
            <v-list>
              <v-list-item>
                Ces applications auront accès à votre compte Constellation. Pour des raisons de
                sécurité, n'approuvez que les applications auxquelles vous faites confiance.
              </v-list-item>
              <v-fade-transition>
                <v-list-item v-if="!requêtes?.length">
                  <p class="my-6 text-center text-h6 text-disabled">
                    Aucune requête en attente d'approbation.
                  </p>
                </v-list-item>
              </v-fade-transition>
              <item-requete-acces
                v-for="r in requêtes"
                :id="r"
                :key="r"
              />
            </v-list>
          </v-window-item>
          <v-window-item value="connexions">
            <v-list>
              <v-fade-transition>
                <v-list-item v-if="!requêtes?.length">
                  <p class="my-6 text-center text-h6 text-disabled">
                    Aucune application externe n'est présentement connectée à votre compte.
                  </p>
                </v-list-item>
              </v-fade-transition>
              <item-connexion
                v-for="c in connexions"
                :id="c"
                :key="c"
              />
            </v-list>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import type {Component} from 'vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';

import {எண்களைப்_பயன்படுத்து, கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {JavaScriptIcon, JuliaIcon, PythonIcon, RIcon} from 'vue3-simple-icons';
import ItemConnexion from './ItemConnexion.vue';
import ItemRequeteAcces from './ItemRequêteAccès.vue';
import {utiliserServeurLocalConstellation} from '/@/components/utils';
import {ouvrirLien} from '/@/utils';

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {எண்ணை_வடிவூட்டு} = எண்களைப்_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const serveurLocal = utiliserServeurLocalConstellation();

// Navigation
const dialogue = ref(false);
const onglet = ref<'connexions' | 'requêtes'>('requêtes');

// Serveur local - statut
const connexions = suivre(serveurLocal.suivreConnexionsAuthServeur.bind(serveurLocal));
const nConnexions = computed(() => connexions.value?.length);
const nConnexionsFormatté = எண்ணை_வடிவூட்டு(nConnexions);

// Serveur local - requêtes
const requêtes = suivre(serveurLocal.suivreRequêtesAuthServeur.bind(serveurLocal));
const nRequêtes = computed(() => requêtes.value?.length);
const nRequêtesFormatté = எண்ணை_வடிவூட்டு(nRequêtes);

// Liens clients autres langages
const langages: {
  nom: string;
  couleur: string;
  icône: Component;
  lien: string;
}[] = [
  {
    nom: 'py',
    couleur: '#3776AB',
    icône: PythonIcon,
    lien: 'https://docu.réseau-constellation.ca/avancé/autresLangages/python.html',
  },
  {
    nom: 'r',
    couleur: '#276DC3',
    icône: RIcon,
    lien: 'https://docu.réseau-constellation.ca/avancé/autresLangages/r.html#serveur-existant',
  },
  {
    nom: 'julia',
    couleur: '#9558B2',
    icône: JuliaIcon,
    lien: 'https://docu.réseau-constellation.ca/avancé/autresLangages/julia.html',
  },
  {
    nom: 'js',
    couleur: '#F7DF1E',
    icône: JavaScriptIcon,
    lien: 'https://docu.réseau-constellation.ca/avanc%C3%A9/autresLangages/nœudLocal.html#client',
  },
];
</script>
