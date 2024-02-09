<template>
  <v-list-item @click="() => lire()">
    <v-list-item-title>
      <v-avatar
        v-if="!info.lu"
        class="mx-2"
        color="error"
        size="10"
      />
      Constellation {{ info.info.détails.dernièreVersionDisponible }} est disponible
    </v-list-item-title>
    <v-list-item-subtitle>
      Vous êtes sur version {{ info.info.détails.versionActuelle }}
    </v-list-item-subtitle>
    <v-dialog v-model="dialogue">
      <template #activator="{props: propsActivateur}">
        <v-btn
          v-bind="propsActivateur"
          class="mt-2"
          variant="flat"
          size="small"
          :append-icon="isRtl ? 'mdi-chevron-left' : 'mdi-chevron-right'"
        >
          Installer
        </v-btn>
      </template>
      <v-card
        :min-width="mdAndUp ? 700 : 300"
        class="mx-auto"
      >
        <v-card-item>
          <v-card-title class="d-flex">Constellation {{ info.info.détails.dernièreVersionDisponible }} est disponible</v-card-title>
          <v-card-subtitle>
            Vous êtes sur version {{ info.info.détails.versionActuelle }}
          </v-card-subtitle>
        </v-card-item>
        <v-card-text>
          <v-btn
            color="primary"
            variant="tonal"
            append-icon="mdi-download"
            @click="() => ouvrirLien(URL_TÉLÉCHARGEMENTS)"
          >
            Installer maintenant
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            append-icon="mdi-close"
            @click="() => (dialogue = false)"
          >
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template #append>
      <v-icon
        icon="mdi-close"
        @click.stop="() => fermer()"
      />
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type {InfoAvecId, InfoMettreÀJour} from '/@/état/infos';

import {ref} from 'vue';
import {useDisplay, useRtl} from 'vuetify';

import {utiliserÉtatInfos} from '/@/état/infos';
import {ouvrirLien} from '/@/utils';
import {URL_TÉLÉCHARGEMENTS} from '/@/consts';

const props = defineProps<{
  info: InfoAvecId<InfoMettreÀJour>;
}>();

const {isRtl} = useRtl();
const {mdAndUp} = useDisplay();
const étatInfos = utiliserÉtatInfos();

const dialogue = ref(false);

const lire = () => {
  étatInfos.lireInfo(props.info.id);
};

const fermer = () => {
  étatInfos.effacerInfo(props.info.id);
};
</script>
