<template>
  <v-chip
    class="mb-2 me-2"
    variant="outlined"
    label
  >
    <template #prepend>
      <v-icon
        start
        :color="licenceApprouvée ? 'primary' : 'error'"
      >
        {{ licenceApprouvée ? 'mdi-scale-balance' : 'mdi-alert' }}
      </v-icon>
    </template>
    {{ licenceApprouvée ? t(`licences.info.${licence}.abr`) : licence }}
  </v-chip>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {InfoLicence} from '@constl/ipa/dist/src/licences';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/composables/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const props = defineProps<{licence: string | undefined}>();

// Info licence
const infoLicences = ref<{[clef: string]: InfoLicence}>();
enregistrerÉcoute(
  constl?.suivreLicences({
    f: x => (infoLicences.value = x),
  }),
);
const licenceApprouvée = computed(() => {
  return (
    props.licence && infoLicences.value && Object.keys(infoLicences.value).includes(props.licence)
  );
});
</script>
