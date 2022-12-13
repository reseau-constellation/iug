<script lang="ts" setup>
import {computed, ref, onMounted, inject} from 'vue';
import {sha256sum} from '#preload';
import type { ProxyClientConstellation } from '@constl/ipa/dist/proxy/proxy';

const constl: ProxyClientConstellation = inject('constl')!;

const rawString = ref('Hello World');
/**
 * window.nodeCrypto was exposed from {@link module:preload}
 */
const hashedString = computed(() => sha256sum(rawString.value));

const idCompte = ref<string|undefined>(undefined);
onMounted(async () => {
  idCompte.value = await constl.obtIdCompte();
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
  <label>
    Hashed by node:crypto
    <input
      v-model="hashedString"
      readonly
      type="text"
    />
  </label>
  <br />
  <label>
    Id compte Constellation
    <input
      v-model="idCompte"
      readonly
      type="text"
    />
  </label>
  <br /><br />
  <code>packages/renderer/src/components/ReactiveHash.vue</code>
</template>
