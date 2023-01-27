<template>
  <div>
    <navigation-principale />
    <router-view v-slot="{Component}">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import NavigationPrincipale from '/@/components/NavigationPrincipale.vue';
</script>
