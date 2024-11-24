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

        <p>
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
        <v-list>
          <v-list-item>
            Ces applications auront accès à votre compte Constellation. Pour des raisons de
            sécurité, n'approuvez que les applications auxquelles vous faites confiance.
          </v-list-item>
          <v-fade-transition>
            <v-list-item v-if="!requêtes?.length">
              <p> Aucune requête en attente d'approbation. </p>
            </v-list-item>
          </v-fade-transition>
          <v-list-item
            v-for="r in requêtes"
            :key="r"
          >
            {{ r }}
            <template #append>
              <v-icon @click="() => approuverRequête(r)">mdi-check</v-icon>
              <v-icon @click="() => refuserRequête(r)">mdi-delete</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import type {Component} from 'vue';
import {ref} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {JavaScriptIcon, JuliaIcon, PythonIcon, RIcon} from 'vue3-simple-icons';
import {utiliserServeurLocalConstellation} from '/@/components/utils';
import {ouvrirLien} from '/@/utils';
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();
const {mdAndUp} = useDisplay();

const serveurLocal = utiliserServeurLocalConstellation();

// Navigation
const dialogue = ref(false);

// Serveur local - statut

// Serveur local - requêtes
const requêtes = suivre(serveurLocal.suivreRequêtesAuthServeur.bind(serveurLocal));
const approuverRequête = async (idRequête: string) => {
  await serveurLocal.approuverRequêteAuthServeur({idRequête});
};
const refuserRequête = async (idRequête: string) => {
  await serveurLocal.refuserRequêteAuthServeur({idRequête});
};

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
    lien: 'https://docu.réseau-constellation.ca/avancé/autresLangages/introduction.html',
  },
];
</script>
