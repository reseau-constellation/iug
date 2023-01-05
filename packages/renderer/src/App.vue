<script lang="ts" setup>
import ReactiveHash from '/@/components/ReactiveHash.vue';
import NavigationPrincipale from '/@/components/NavigationPrincipale.vue';

const APP_VERSION = import.meta.env.VITE_APP_VERSION;
</script>

<template>
  <v-app>
    <v-main>
      <navigation-principale />
      <router-view></router-view>
      <p>
        <!-- Example how to inject current app version to UI -->
        Version: {{ APP_VERSION }}
      </p>
      <p> Julien Malard-Adam </p>

      <fieldset>
        <legend>Test Node.js API</legend>
        <reactive-hash />
      </fieldset>
    </v-main>
  </v-app>
</template>

<style></style>
