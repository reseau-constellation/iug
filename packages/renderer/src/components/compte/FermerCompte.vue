<template>
  <v-dialog v-model="dialogue">
    <template #activator="{props}">
      <slot
        name="activator"
        v-bind="{props}"
      ></slot>
    </template>
    <v-card
      class="mx-auto"
      :max-width="mdAndUp ? 500 : 300"
    >
      <v-card-item>
        <v-card-title class="d-flex">
          <span class="text-error">
            {{ t('compte.effacerCompte.titre') }}
          </span>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="flat"
            @click="dialogue = false"
          ></v-btn>
        </v-card-title>
      </v-card-item>
      <v-divider></v-divider>
      <v-card-text>
        <span class="text-error font-weight-bold">{{
          t('compte.effacerCompte.avertissement')
        }}</span>
        {{ t('compte.effacerCompte.explication') }}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="outlined"
          @click="dialogue = false"
        >
          {{ t('communs.annuler') }}
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          append-icon="mdi-delete"
          :loading="effaçageEnCours"
          @click="effacerCompte"
        >
          {{ t('compte.effacerCompte.btnEffacer') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';

import {inject, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const constl = inject<client.ClientConstellation>('constl');

const {mdAndUp} = useDisplay();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Navigation
const dialogue = ref(false);

// Gestion compte
const effaçageEnCours = ref(false);

const effacerCompte = async () => {
  effaçageEnCours.value = true;
  await constl?.effacerDispositif();
  dialogue.value = false;
  effaçageEnCours.value = false;
  location.reload();
};
</script>
