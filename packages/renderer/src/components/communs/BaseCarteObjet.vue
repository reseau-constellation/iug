<template>
  <v-card
    :width="mdAndUp ? 500 : 300"
    class="mx-auto"
  >
    <v-card-item>
      <v-card-title>
        {{ nom || t('communs.baseCarteObjet.sansNom') }}

        <lien-objet :id="id" />
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <p class="text-overline">{{ t('communs.baseCarteObjet.description') }}</p>
      <v-divider class="mb-2" />
      <p>{{ description || t('communs.baseCarteObjet.sansDescription') }}</p>

      <p class="text-overline">{{ t('communs.baseCarteObjet.auteurs') }}</p>
      <v-divider class="mb-2" />
      <auteurs-objet :auteurs="auteurs" />
      <GérerAuteurs>
        <v-chip
          v-if="monAutorisation === 'MODÉRATEUR'"
          variant="outlined"
        >
          {{ t('communs.baseCarteObjet.ajouterAuteur') }}
        </v-chip>
      </GérerAuteurs>

      <slot></slot>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="monAutorisation"
        variant="flat"
        color="primary"
      >
        {{ t('communs.sauvegarder') }} <v-icon end>mdi-check</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {infoAuteur} from '@constl/ipa/dist/src/utils';

import {ref, inject} from 'vue';
import {enregistrerÉcoute} from '/@/composables/utils';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {useDisplay} from 'vuetify';

const props = defineProps<{
  id: string;
  nom?: string;
  description?: string;
  auteurs?: infoAuteur[];
}>();
const constl = inject<ClientConstellation>('constl');

const {mdAndUp} = useDisplay();
const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Autorisation
const monAutorisation = ref<'MODÉRATEUR' | 'MEMBRE' | undefined>();
enregistrerÉcoute(
  constl?.suivrePermission({
    idObjet: props.id,
    f: x => (monAutorisation.value = x),
  }),
);
</script>
