<template>
  <v-container>
    <TitrePage :titre="nomTraduit || couper(id, 50, t('communs.troisPetitsPoints'))" />
    <p>{{ id }}</p>
    <ExporterCode :id-nuee="id" />
  </v-container>
</template>

<script setup lang="ts">
import type {client} from '@constl/ipa';

import {inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {couper} from '/@/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import ExporterCode from '/@/components/nuées/ExporterCode.vue';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Nom de la nuée
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.nuées?.suivreNomsNuée({
    idNuée: props.id,
    f: x => (noms.value = x),
  }),
);
</script>
