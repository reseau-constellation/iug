<template>
  <v-list-item>
    <template #prepend>
      <v-icon
        left
        icon="mdi-database-sync"
      />
    </template>
    <v-list-item-title>
      <v-skeleton-loader
        v-if="réplications === undefined"
        type="chip"
      />
      <span v-else>
        {{ réplications ? t('réplications.nRéplications', {n: nRéplicationsFormatté}) : '' }}
      </span>
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import {VSkeletonLoader} from 'vuetify/labs/VSkeletonLoader';

import type {client, réseau} from '@constl/ipa';
import {inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {computed} from 'vue';
import {utiliserNumération} from '/@/plugins/localisation/localisation';

const props = defineProps<{id: string}>();

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {formatterChiffre} = utiliserNumération();

const constl = inject<client.ClientConstellation>('constl');

const réplications = ref<réseau.infoRéplications>();

enregistrerÉcoute(
  constl?.réseau?.suivreRéplications({
    idObjet: props.id,
    f: r => (réplications.value = r),
    profondeur: 10,
  }),
);

const nRéplications = computed(() => réplications.value?.dispositifs.length || 0);
const nRéplicationsFormatté = formatterChiffre(nRéplications);
</script>
