<template>
  <v-list-item>
    <template #prepend>
      <v-icon
        start
        :color="licenceApprouvée ? 'primary' : 'error'"
      >
        {{ licenceApprouvée ? 'mdi-scale-balance' : 'mdi-alert' }}
      </v-icon>
    </template>
    <v-list-item-title>
      {{ licenceApprouvée ? t(`licences.info.${licence}.abr`) : licence }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import type {licences} from '@constl/ipa';
import type {MandataireClientConstellation} from '@constl/mandataire';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const constl = inject<MandataireClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const props = defineProps<{licence: string | undefined}>();

// Info licence
const infoLicences = ref<{[clef: string]: licences.InfoLicence}>();
enregistrerÉcoute(
  constl?.licences.suivreLicences({
    f: x => (infoLicences.value = x),
  }),
);
const licenceApprouvée = computed(() => {
  return (
    props.licence && infoLicences.value && Object.keys(infoLicences.value).includes(props.licence)
  );
});
</script>
