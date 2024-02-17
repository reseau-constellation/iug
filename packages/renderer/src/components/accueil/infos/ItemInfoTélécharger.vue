<template>
  <base-item-info 
    :titre="t('accueil.page.notifications.connecterInstallé.titre')"
    :sous-titre="t('accueil.page.notifications.connecterInstallé.sousTitre')"
    :texte-action="t('accueil.page.notifications.connecterInstallé.texteAction')"
    :info="info"
  >
    <template #contenu>
      <span>
        <p>
          {{ t('accueil.page.notifications.connecterInstallé.détails') }}
        </p>
        <p>
          Premièrement, installez et ouvrez Constellation sur un ordinateur.
        </p>
        <v-btn
          color="primary"
          variant="tonal"
          append-icon="mdi-download"
          @click="() => ouvrirLien(URL_TÉLÉCHARGEMENTS)"
        >
          Télécharger
        </v-btn>
        <p>
          Ensuite, connectez vos comptes :
        </p>
        <inviter-dispositif>
          <template #activator="{props: propsActivateur}">
            <v-btn
              v-bind="propsActivateur"
              class="mt-2"
              color="primary"
              variant="tonal"
              :append-icon="connectéÀAuMoinsUnOrdi ? 'mdi-check' : 'mdi-lan-connect'"
              :active="!connectéÀAuMoinsUnOrdi"
            >
              {{ connectéÀAuMoinsUnOrdi ? 'Compte connecté' : 'Connecter compte' }}
            </v-btn>
          </template>
        </inviter-dispositif>
          
      </span>
    </template>
  </base-item-info>
</template>
<script setup lang="ts">
import type {InfoAvecId, InfoInstaller} from '/@/état/infos';

import BaseItemInfo from './BaseItemInfo.vue';
import { constellation, suivre } from '../../utils';
import { computed } from 'vue';
import InviterDispositif from '../../compte/InviterDispositif.vue';
import { கிளிமூக்கை_பயன்படுத்து } from '@lassi-js/kilimukku-vue';
import { ouvrirLien } from '/@/utils';
import { URL_TÉLÉCHARGEMENTS } from '/@/consts';

defineProps<{
  info: InfoAvecId<InfoInstaller>;
}>();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const constl = constellation();

const dispositifs = suivre(constl.suivreNomsDispositifs);
const connectéÀAuMoinsUnOrdi = computed(()=>{
  return dispositifs.value && !!Object.values(dispositifs.value).find(d=>d.type === 'ordinateur' || d.type === 'serveur');
});

</script>
