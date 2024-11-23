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
        <v-icon start>mdi-information-outline</v-icon>Vous pouvez autoriser l'accès au nœud local afin
        de pouvoir accéder Constellation à partir d'applications tièrces (par exemple, Python, R). 
        Ces applications auront accès à votre compte Constellation. Pour des raisons de sécurité, n'approuvez que les applications auxquelles vous faites confiance.
        <v-divider />
        <v-list>
          <v-fade-transition>
            <v-list-item v-if="!requêtes?.length">
              <p>
                Aucune requête en attente d'approbation. Voir comment connecter une application dans les langages suivants :
              </p>
              <v-chip
                class="me-2"
                label
                variant="outlined"
                append-icon="mdi-open-in-new"
                @click="()=>ouvrirLien('https://docu.réseau-constellation.ca/avancé/autresLangages/python.html')"
              >
                Python
              </v-chip>
              <v-chip
                class="me-2"
                label
                variant="outlined"
                append-icon="mdi-open-in-new"
                @click="()=>ouvrirLien('https://docu.réseau-constellation.ca/avancé/autresLangages/r.html#serveur-existant')"
              >
                R
              </v-chip>
              <v-chip
                class="me-2"
                label
                variant="outlined"
                append-icon="mdi-open-in-new"
                @click="()=>ouvrirLien('https://docu.réseau-constellation.ca/avancé/autresLangages/julia.html')"
              >
                Julia
              </v-chip>
            </v-list-item>
          </v-fade-transition>
          <v-expand-transition>
            <v-list-item
              v-for="r in requêtes"
              :key="r"
            >
              {{ r }}
              <template #append>
                
              </template>
            </v-list-item>
          </v-expand-transition>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {suivre} from '@constl/vue';
import {ref} from 'vue';
import {useDisplay} from 'vuetify';

import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
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
</script>
