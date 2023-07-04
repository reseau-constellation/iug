<template>
  <v-tooltip :text="texteIndice">
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
  </v-tooltip>
  <v-icon :icon="icône"></v-icon>
</template>
<script setup lang="ts">
import type {client} from '@constl/ipa';
import type {favoris} from '@constl/ipa';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import {inject, ref, computed} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';

const props = defineProps<{id: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Statut favoris
const statutFavoris = ref<favoris.ÉlémentFavoris>();
enregistrerÉcoute(
  constl?.favoris?.suivreÉtatFavori({
    id: props.id,
    f: statut => (statutFavoris.value = statut),
  }),
);

const estÉpingléSurCeDispositif = ref(false);
enregistrerÉcoute(
  constl?.favoris?.suivreEstÉpingléSurDispositif({
    idObjet: props.id,
    f: statut => (estÉpingléSurCeDispositif.value = statut.bd),
  }),
);

const icône = computed(() => {
  if (statutFavoris.value) {
    if (estÉpingléSurCeDispositif.value) {
      return 'mdi-pin';
    } else {
      return 'mdi-pin-outline';
    }
  }
  return 'mdi-pin-off-outline';
});

const texteIndice = computed(() => {
  if (statutFavoris.value) {
    if (estÉpingléSurCeDispositif.value) {
      return t('épingles.icône.épingléSurCeDispositif');
    } else {
      return t('épingles.icône.épingléSurDAutresDispositifs');
    }
  }
  return t('épingles.icône.pasÉpinglé');
});
</script>
