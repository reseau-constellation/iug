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

        <v-list>
          <v-list-item
            v-for="avantage in avantages"
            :key="avantage.clef"
            :prepend-icon="avantage.icône"
          >
            <v-list-item-title class="text-wrap">{{ t(avantage.titre) }}</v-list-item-title>
            <p class="text-disabled text-body-2">{{ t(avantage.sousTitre) }}</p>
          </v-list-item>
        </v-list>
        <v-timeline
          class="my-6"
          side="end"
          truncate-line="both"
          :density="mdAndUp ? 'default' : 'compact'"
        >
          <v-timeline-item
            icon="mdi-download"
            dot-color="primary"
          >
            <div>
              <div class="text-h6">{{
                t('accueil.page.notifications.connecterInstallé.étape1.titre')
              }}</div>
              <p>
                {{ t('accueil.page.notifications.connecterInstallé.étape1.texte') }}
              </p>
              <v-btn
                class="my-2"
                color="primary"
                variant="tonal"
                append-icon="mdi-download"
                @click="() => ouvrirLien(urlTélécharger)"
              >
                {{ t('accueil.page.notifications.connecterInstallé.étape1.télécharger') }}
              </v-btn>
              <indice-installation-apple v-if="surPlateforme.so === 'mac'" />
            </div>
          </v-timeline-item>
          <v-timeline-item
            icon="mdi-lan-connect"
            dot-color="primary"
          >
            <div>
              <div class="text-h6">{{
                t('accueil.page.notifications.connecterInstallé.étape2.titre')
              }}</div>
              <p>
                {{ t('accueil.page.notifications.connecterInstallé.étape2.texte') }}
              </p>
              <inviter-dispositif>
                <template #activateur="{props: propsActivateur}">
                  <v-btn
                    v-bind="propsActivateur"
                    class="mt-2"
                    color="primary"
                    variant="tonal"
                    :append-icon="connectéÀAuMoinsUnOrdi ? 'mdi-check' : 'mdi-lan-connect'"
                    :active="!connectéÀAuMoinsUnOrdi"
                  >
                    {{
                      connectéÀAuMoinsUnOrdi
                        ? t('accueil.page.notifications.connecterInstallé.étape2.connecté')
                        : t('accueil.page.notifications.connecterInstallé.étape2.code')
                    }}
                  </v-btn>
                </template>
              </inviter-dispositif>
            </div>
          </v-timeline-item>
        </v-timeline>
      </span>
    </template>
  </base-item-info>
</template>
<script setup lang="ts">
import type {InfoAvecId, InfoInstaller} from '/@/état/infos';

import {onMounted} from 'vue';

import {suivre} from '@constl/vue';
import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';
import InviterDispositif from '../../compte/InviterDispositif.vue';
import {utiliserConstellation} from '../../utils';
import BaseItemInfo from './BaseItemInfo.vue';
import IndiceInstallationApple from '/@/components/accueil/infos/IndiceInstallationApple.vue';
import {obtenirDernièreVersion} from '/@/components/accueil/infos/utils';
import {URL_TÉLÉCHARGEMENTS} from '/@/consts';
import {ouvrirLien, plateforme} from '/@/utils';

defineProps<{
  info: InfoAvecId<InfoInstaller>;
}>();

const {mdAndUp} = useDisplay();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

const constl = utiliserConstellation();

// Avantages
const avantages: {
  clef: string;
  titre: string;
  sousTitre: string;
  icône: string;
}[] = [
  {
    clef: 'connexion',
    titre: 'accueil.page.notifications.connecterInstallé.avantages.connexion.titre',
    sousTitre: 'accueil.page.notifications.connecterInstallé.avantages.connexion.sousTitre',
    icône: 'mdi-wifi',
  },
  {
    clef: 'sauvegardes',
    titre: 'accueil.page.notifications.connecterInstallé.avantages.sauvegardes.titre',
    sousTitre: 'accueil.page.notifications.connecterInstallé.avantages.sauvegardes.sousTitre',
    icône: 'mdi-file-sync-outline',
  },
  {
    clef: 'mémoire',
    titre: 'accueil.page.notifications.connecterInstallé.avantages.mémoire.titre',
    sousTitre: 'accueil.page.notifications.connecterInstallé.avantages.mémoire.sousTitre',
    icône: 'mdi-content-save',
  },
  {
    clef: 'plus',
    titre: 'accueil.page.notifications.connecterInstallé.avantages.plus.titre',
    sousTitre: 'accueil.page.notifications.connecterInstallé.avantages.plus.sousTitre',
    icône: 'mdi-plus',
  },
];

// Options connexion
const dispositifs = suivre(constl.suivreNomsDispositifs);
const connectéÀAuMoinsUnOrdi = computed(() => {
  return (
    dispositifs.value &&
    !!Object.values(dispositifs.value).find(d => d.type === 'ordinateur' || d.type === 'serveur')
  );
});

const surPlateforme = plateforme();
const surOrdi = surPlateforme.so && ['linux', 'windows', 'mac'].includes(surPlateforme.so);
const urlVersionPlusRécente = ref<string>();
onMounted(async () => {
  const v = await obtenirDernièreVersion();
  urlVersionPlusRécente.value = v?.urlTéléchargement;
});
const urlTélécharger = computed<string>(() => {
  if (surOrdi) {
    return urlVersionPlusRécente.value || URL_TÉLÉCHARGEMENTS;
  }
  return URL_TÉLÉCHARGEMENTS;
});
</script>
