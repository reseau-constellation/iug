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
          {{ t('compte.rejoindreCompte.titre') }}
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
        <v-window v-model="étape">
          <v-window-item>
            <span class="text-error font-weight-bold">{{
              t('compte.rejoindreCompte.avertissement')
            }}</span>
            {{ t('compte.rejoindreCompte.explication') }}
          </v-window-item>
          <v-window-item>
            <v-otp-input
              v-model="codeSecret"
              :length="8"
              type="text"
            />
            <v-btn
              :disabled="!prêt"
              :loading="enProgrès"
              @click="rejoindreCompte"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions> </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import {கிளிமூக்கை_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import {computed, ref} from 'vue';
import {useDisplay} from 'vuetify';
import {utiliserConstellation} from '../utils';

const constl = utiliserConstellation();

const {mdAndUp} = useDisplay();

const {மொழியாக்கம்_பயன்படுத்து} = கிளிமூக்கை_பயன்படுத்து();
const {$மொ: t} = மொழியாக்கம்_பயன்படுத்து();

// Navigation
const dialogue = ref(false);

const étape = ref(0);

// Rejoindre compte
const enProgrès = ref(false);
const idCompte = ref<string>();
const codeSecret = ref<string>();

const prêt = computed(() => {
  if (!idCompte.value || !codeSecret.value) return;
  return {
    idCompte: idCompte.value,
    codeSecret: codeSecret.value,
  };
});

const rejoindreCompte = async () => {
  if (!prêt.value) return;
  const {idCompte, codeSecret} = prêt.value;

  enProgrès.value = true;
  await constl.demanderEtPuisRejoindreCompte({
    idCompte,
    codeSecret,
  });
  enProgrès.value = false;
};
</script>
