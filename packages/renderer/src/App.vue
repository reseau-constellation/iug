<script lang="ts" setup>
import {ref} from 'vue';

import PagePrincipale from './misesEnPage/PagePrincipale.vue';
import AccueilInitial from './misesEnPage/AccueilInitial.vue';
import MenuLangues from './components/langues/MenuLangues.vue';

const initialisé = ref(false);
</script>

<template>
  <v-app>
    <v-main>
      <MenuLangues />
      <v-fade-transition leave-absolute>
        <AccueilInitial
          v-if="!initialisé"
          @entrer="initialisé = true"
        />
        <PagePrincipale v-else />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<style></style>
