<template>
  <v-chip
    class="mb-2 me-2"
    prepend-icon="mdi-key"
    variant="outlined"
    size="small"
  >
    {{ nomTraduit || t('motsClefs.sansNom') }}
  </v-chip>
</template>

<script setup lang="ts">
import type {client} from '@constl/ipa';
import {enregistrerÉcoute} from '/@/components/utils';

import {ref, inject} from 'vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {traduireNom} = utiliserLangues();

// Nom du mot-clef
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.motsClefs?.suivreNomsMotClef({
    idMotClef: props.id,
    f: x => (noms.value = x),
  }),
);
</script>
