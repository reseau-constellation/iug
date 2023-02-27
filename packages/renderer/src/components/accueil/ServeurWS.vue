<script lang="ts" setup>
import {ref, inject, watchEffect} from 'vue';

import type {GestionnaireServeur} from '@constl/mandataire-electron-rendu';

const serveur = inject<GestionnaireServeur>('serveurConstl');

const dialogue = ref(false);

const serveurConnecté = ref(false);
const portServeurSpécifié = ref<number | undefined>();
const portServeur  = ref<number | undefined>();
watchEffect(async ()=>{
  if (serveurConnecté.value) {
    portServeur.value = await serveur?.initialiser(portServeurSpécifié.value);
  } else {
    portServeur.value = undefined;
    await serveur?.fermer();
  }
});
</script>

<template>
  <v-card
    class="text-start ma-2"
    variant="outlined"
    max-width="250"
  >
    <v-card-item>
      <v-card-title>
        Nœud WS local
        <v-tooltip
          text="Ouvrir un nœud local pour connecter d'autres applications."
          location="bottom"
        >
          <template #activator="{ props }">
            <v-icon
              size="xsmall"
              v-bind="props"
            >
              mdi-help-circle-outline
            </v-icon>
          </template>
        </v-tooltip>
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <v-switch
        v-model="serveurConnecté"
        class="text-start"
        color="primary"
        inset
        hide-details
        :prepend-icon="serveurConnecté ? 'mdi-server':'mdi-server-off'"
        :loading="serveurConnecté && !portServeur"
      >
        <template #label>
          {{ serveurConnecté ? 'Port : ' + portServeur : 'Déconnecté' }}
        </template>
      </v-switch>
      <v-dialog v-model="dialogue">
        <template #activator="{props}">
          <slot
            name="activator"
            v-bind="{props}"
          ></slot>
        </template>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>
