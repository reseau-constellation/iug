<template>
  <v-chip
    class="mb-2 me-2"
    variant="outlined"
    label
  >
    <v-icon start>mdi-pin-outline</v-icon>
    {{ nRéplicationsDispositifsFormatté }}
    {{ t('réplications.réplications', nRéplicationsDispositifs) }}
    <span v-if="nRéplicationsDispositifs > 0">{{
      t('réplications.réplicationsEnLigne', [nRéplicationsEnLigneFormatté])
    }}</span>
  </v-chip>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {infoRéplications} from '@constl/ipa/dist/src/reseau';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/composables/utils';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserNumération} from '/@/plugins/localisation/localisation';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {formatterChiffre} = utiliserNumération();

// Réplications
const réplications = ref<infoRéplications>();
enregistrerÉcoute(
  constl?.réseau?.suivreRéplications({
    idObjet: props.id,
    f: x => (réplications.value = x),
    profondeur: 5,
  }),
);
const nRéplicationsDispositifs = computed(() => {
  return réplications.value?.dispositifs.length || 0;
});
const nRéplicationsDispositifsFormatté = formatterChiffre(nRéplicationsDispositifs);

const nRéplicationsEnLigne = computed(() => {
  return réplications.value?.dispositifs.filter(d => !d.vuÀ).length || 0;
});
const nRéplicationsEnLigneFormatté = formatterChiffre(nRéplicationsEnLigne);
</script>
