<script lang="ts" setup>
import {ref} from 'vue';

import PagePrincipale from './misesEnPage/PagePrincipale.vue';
import AccueilInitial from './misesEnPage/AccueilInitial.vue';
import MenuLangues from './components/langues/MenuLangues.vue';
import {utiliserLangues} from './plugins/localisation/localisation';

const initialisé = ref(false);

// Direction texte
const {langueDroiteÀGauche} = utiliserLangues();
const dàg = langueDroiteÀGauche();
</script>

<template>
  <v-app>
    <v-locale-provider :rtl="dàg">
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
    </v-locale-provider>
  </v-app>
</template>

<style></style>
