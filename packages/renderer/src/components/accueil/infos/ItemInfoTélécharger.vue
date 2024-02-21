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
            :title="t('accueil.page.notifications.connecterInstallé.avantages.connexion.titre')"
            :subtitle="
              t('accueil.page.notifications.connecterInstallé.avantages.connexion.sousTitre')
            "
            prepend-icon="mdi-wifi"
          />
          <v-list-item
            :title="t('accueil.page.notifications.connecterInstallé.avantages.sauvegardes.titre')"
            :subtitle="
              t('accueil.page.notifications.connecterInstallé.avantages.sauvegardes.sousTitre')
            "
            prepend-icon="mdi-content-save"
          />
          <v-list-item
            :title="t('accueil.page.notifications.connecterInstallé.avantages.mémoire.titre')"
            :subtitle="
              t('accueil.page.notifications.connecterInstallé.avantages.mémoire.sousTitre')
            "
            prepend-icon="mdi-wifi"
          />
          <v-list-item
            :title="t('accueil.page.notifications.connecterInstallé.avantages.plus.titre')"
            :subtitle="t('accueil.page.notifications.connecterInstallé.avantages.plus.sousTitre')"
            prepend-icon="mdi-plus"
          />
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
                <template #activator="{props: propsActivateur}">
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

import BaseItemInfo from './BaseItemInfo.vue';
import {constellation, suivre} from '../../utils';
import {computed, ref} from 'vue';
import InviterDispositif from '../../compte/InviterDispositif.vue';
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {obtenirDernièreVersion} from '/@/components/accueil/infos/utils';
import {ouvrirLien, plateforme} from '/@/utils';
import {URL_TÉLÉCHARGEMENTS} from '/@/consts';
import {useDisplay} from 'vuetify/lib/framework.mjs';

defineProps<{
  info: InfoAvecId<InfoInstaller>;
}>();

const {mdAndUp} = useDisplay();
const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து({});

const constl = constellation();

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
