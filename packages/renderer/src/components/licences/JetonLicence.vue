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
import type {client} from '@constl/ipa';
import type {licences} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

const props = defineProps<{licence: string | undefined}>();

// Info licence
const infoLicences = ref<{[clef: string]: licences.InfoLicence}>();
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
