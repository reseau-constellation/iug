<template>
  <v-list-item
    v-show="visible"
    class="text-start"
    density="compact"
  >
    <template #prepend>
      <image-profil :id="compte" />
    </template>
    <template #title>
      {{ nomTraduit || t('communs.anonyme') }}
    </template>
    <template #append>
      <lien-objet :id="compte" />
    </template>
  </v-list-item>
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';
import {ref, inject, computed} from 'vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/components/utils';

import ImageProfil from '/@/components/communs/ImageProfil.vue';
import LienObjet from '../communs/LienObjet.vue';

const props = defineProps<{compte: string; montrerAnonymes: boolean}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Nom d'utilisatrice
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.profil?.suivreNoms({
    idCompte: props.compte,
    f: x => (noms.value = x),
  }),
);

// Visibilité
const visible = computed(() => {
  return props.montrerAnonymes || nomTraduit.value;
});
</script>
