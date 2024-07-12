<script lang="ts" setup>
import {ref} from 'vue';

import {மொழிகளைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {lancerInfos} from './components/accueil/infos/utils';
import DialogueErreurInit from './components/communs/DialogueErreurInit.vue';
import MenuLangues from './components/langues/MenuLangues.vue';
import AccueilInitial from './misesEnPage/AccueilInitial.vue';
import PagePrincipale from './misesEnPage/PagePrincipale.vue';

const initialisé = ref(false);

// Direction texte
const {வலதிலிருந்து_இடது_மொழி} = மொழிகளைப்_பயன்படுத்து();
const dàg = வலதிலிருந்து_இடது_மொழி();

lancerInfos();
</script>

<template>
  <v-app>
    <v-locale-provider :rtl="dàg">
      <v-main>
        <MenuLangues />
        <DialogueErreurInit />
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
