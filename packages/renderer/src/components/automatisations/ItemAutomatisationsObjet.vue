<template>
  <v-list-item prepend-icon="mdi-lightning-bolt">
    <v-list-item-title>
      {{
        t('automatisations.item.titre', nAutomatisationsObjet)
      }}
    </v-list-item-title>
  </v-list-item>
</template>
<script setup lang="ts">
import type {automatisation} from '@constl/ipa';
import type {ClientConstellation} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{
  idObjet: string;
}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Automatisations
const automatisations = ref<automatisation.SpécificationAutomatisation[]>();
enregistrerÉcoute(
  constl?.automatisations.suivreAutomatisations({
    f: x => (automatisations.value = x),
  }),
);
const automatisationsObjet = computed(() => {
  return automatisations.value
    ? automatisations.value.filter(
        a => (a.type === 'exportation' ? a.idObjet : a.idTableau) === props.idObjet,
      )
    : undefined;
});

const nAutomatisationsObjet = computed(() => {
  return automatisationsObjet.value?.length || 0;
});

</script>
