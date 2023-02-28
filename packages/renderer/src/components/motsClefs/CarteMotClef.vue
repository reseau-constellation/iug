<template>
  <v-card
    :width="mdAndUp ? 500 : 300"
    class="mx-auto"
  >
    <v-card-item>
      <v-card-title>
        {{ nom || t('motsClefs.sansNom') }}
        
        <lien-objet :id="id" />
      </v-card-title>
    </v-card-item>
    <v-card-text>
      <p class="text-overline">{{ t('motsClefs.description') }}</p>
      <v-divider class="mb-2" />
      <p>{{ description || t('motsClefs.sansDescription') }}</p>

      <p class="text-overline">{{ t('motsClefs.auteurs') }}</p>
      <v-divider class="mb-2" />
      <auteurs-objet :auteurs="auteurs" />
      <p
        v-if="monAutorisation"
        class="text-center mt-4"
      >
        <v-btn
          class="mx-auto"
          variant="outlined"
        >
          {{ t('motsClefs.ajouterAuteur') }}
        </v-btn>
      </p>
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
import {inject, ref} from 'vue';
import AuteursObjet from '../communs/AuteursObjet.vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/composables/utils';
import { கிளிமூக்கை_உபயோகி } from '/@/plugins/kilimukku/kilimukku-vue';
import LienObjet from '../communs/LienObjet.vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {mdAndUp} = useDisplay();
const {t} = useI18n();
const {traduireNom} = utiliserLangues();

// Autorisation
const monAutorisation = ref<'MODÉRATEUR' | 'MEMBRE' | undefined>();
enregistrerÉcoute(
  constl?.suivrePermission({
    idObjet: props.id,
    f: x => (monAutorisation.value = x),
  }),
);

// Nom mot-clef
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.motsClefs?.suivreNomsMotClef({
    id: props.id,
    f: x => (noms.value = x),
  }),
);
const nom = traduireNom(noms);

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.motsClefs?.suivreDescriptionsMotClef({
    id: props.id,
    f: x => (descriptions.value = x),
  }),
);
const description = traduireNom(descriptions);

// Permissions
const maPermission = ref<'MODÉRATEUR' | 'MEMBRE' | undefined>();
enregistrerÉcoute(
  constl?.suivrePermission({
    idObjet: props.id,
    f: x => (maPermission.value = x),
  }),
);

// Auteurs
const auteurs = ref<infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursMotClef({
    idMotClef: props.id,
    f: x => (auteurs.value = x),
  }),
);
</script>
