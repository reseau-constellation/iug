<template>
  <div>
    <navigation-principale />
    <router-view v-slot="{Component}">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>

    <p>
      <!-- Example how to inject current app version to UI -->
      Version: {{ APP_VERSION }}
    </p>
    <p> Julien Malard-Adam </p>
  </div>
</template>
<script setup lang="ts">
import NavigationPrincipale from '/@/components/NavigationPrincipale.vue';

const APP_VERSION = import.meta.env.VITE_APP_VERSION;
</script>
