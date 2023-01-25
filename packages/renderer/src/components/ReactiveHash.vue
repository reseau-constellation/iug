<script lang="ts" setup>
import {ref, onMounted, inject} from 'vue';

import type {MandataireClientConstellation} from '@constl/mandataire';
import type {GestionnaireServeur} from '@constl/mandataire-electron-rendu';

const constl: MandataireClientConstellation | undefined = inject('constl');
const serveur = inject<GestionnaireServeur>('serveurConstl');

const rawString = ref('Hello World');
/**
 * window.nodeCrypto was exposed from {@link module:preload}
 */
// const hashedString = computed(() => sha256sum(rawString.value));

const idCompte = ref<string | undefined>();
const portServeur = ref<number | undefined>();

onMounted(async () => {
  idCompte.value = constl && (await constl.obtIdCompte());
  portServeur.value = serveur && (await serveur.initialiser());
});
</script>

<template>
  <label>
    Raw value
    <input
      v-model="rawString"
      type="text"
    />
  </label>
  <br />
  <label> Hashed by node:crypto </label>
  <br />
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
  <br /><br />
  <code>packages/renderer/src/components/ReactiveHash.vue</code>
</template>
