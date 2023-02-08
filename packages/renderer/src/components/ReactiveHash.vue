<script lang="ts" setup>
import {ref, onMounted, inject} from 'vue';

import type {MandataireClientConstellation} from '@constl/mandataire';
import type {GestionnaireServeur} from '@constl/mandataire-electron-rendu';

const constl: MandataireClientConstellation | undefined = inject('constl');
const serveur = inject<GestionnaireServeur>('serveurConstl');

const idCompte = ref<string | undefined>();
const portServeur = ref<number | undefined>();

onMounted(async () => {
  idCompte.value = constl && (await constl.obtIdCompte());
  portServeur.value = serveur && (await serveur.initialiser());
});
</script>

<template>
  <label>
    Id compte Constellation
    <input
      v-model="idCompte"
      readonly
      type="text"
    />
  </label>
  <br />
  <label>
    Port serveur Constellation
    <input
      v-model="portServeur"
      readonly
      type="text"
    />
  </label>
</template>
