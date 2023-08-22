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
            {{ t('compte.rejoindreCompte.titre') }}
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
        <v-window>
          <v-window-item>
            <span class="text-error font-weight-bold">{{
              t('compte.rejoindreCompte.avertissement')
            }}</span>
            {{ t('compte.rejoindreCompte.explication') }}
          </v-window-item>
          <v-window-item>
            <v-btn @click="rejoindreCompte" />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import type {MandataireClientConstellation} from '@constl/mandataire';


import {inject, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const constl = inject<MandataireClientConstellation>('constl');

const {mdAndUp} = useDisplay();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Navigation
const dialogue = ref(false);

// Rejoindre compte
const idCompte = ref<string>();
const codeSecret = ref<string>();

const rejoindreCompte = async () => {
  if (!idCompte.value || !codeSecret.value) return;
  await constl?.demanderEtPuisRejoindreCompte({
    idCompte: idCompte.value,
    codeSecret: codeSecret.value,
  });
};
</script>
