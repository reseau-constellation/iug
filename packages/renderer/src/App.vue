<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import ReactiveHash from '/@/components/ReactiveHash.vue';
import LogoAnimé from '/@/components/LogoAnimé.vue';

const APP_VERSION = import.meta.env.VITE_APP_VERSION;

const t = ref(0);

onMounted(()=>{
  const annuler = setInterval(
    () => {
      t.value+=0.01;
      if (t.value >= 1) clearInterval(annuler);
    }, 
    100,
  );
});
</script>

<template>
  <LogoAnimé 
    :t="t"
    :largeur="400"
  />

  <h1>Constellation</h1>

  <p>
    <!-- Example how to inject current app version to UI -->
    Version: {{ APP_VERSION }}
  </p>
  <p>
    Julien Malard-Adam
  </p>

  <fieldset>
    <legend>Test Node.js API</legend>
    <reactive-hash />
  </fieldset>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 700px;
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
