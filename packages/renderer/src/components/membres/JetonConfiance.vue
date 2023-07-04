<template>
  <carte-confiance-membre
    v-if="id !== monCompte"
    :id="id"
  >
    <template #activator="{props: propsActivateur}">
      <icône-confiance
        v-if="styleJeton === 'icône'"
        v-bind="propsActivateur"
        :confiance="confiance"
        :cest-moi="id === monCompte"
      />
      <v-chip
        v-else
        v-bind="propsActivateur"
        label
        variant="outlined"
        size="small"
      >
        <template #prepend>
          <icône-confiance
            :confiance="confiance"
            :cest-moi="id === monCompte"
          />
        </template>
        {{ messageConfiance }}
      </v-chip>
    </template>
  </carte-confiance-membre>
  <v-tooltip
    v-else
    :text="messageConfiance"
  >
    <template #activator="{props: propsActivateur}">
      <icône-confiance
        v-if="styleJeton === 'icône'"
        v-bind="propsActivateur"
        :confiance="confiance"
        :cest-moi="id === monCompte"
      />
      <v-chip
        v-else
        v-bind="propsActivateur"
        label
        variant="outlined"
        size="small"
      >
        <template #prepend>
          <icône-confiance
            :confiance="confiance"
            :cest-moi="id === monCompte"
          />
        </template>
        {{ messageConfiance }}
      </v-chip>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import type {client} from '@constl/ipa';

import {computed, inject, ref} from 'vue';

import {enregistrerÉcoute} from '/@/components/utils';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import IcôneConfiance from './IcôneConfiance.vue';
import CarteConfianceMembre from './CarteConfianceMembre.vue';

const props = defineProps<{
  id: string;
  styleJeton: 'jeton' | 'icône';
}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Mon compte
const monCompte = ref<string>();
enregistrerÉcoute(constl?.suivreIdBdCompte({f: id => (monCompte.value = id)}));

// Confiance
const confiance = ref(0);
enregistrerÉcoute(
  constl?.réseau?.suivreConfianceMonRéseauPourMembre({
    idBdCompte: props.id,
    f: x => (confiance.value = x),
    profondeur: 5,
  }),
);

// Message
const messageConfiance = computed(() => {
  if (confiance.value < 0) {
    return t('membres.confiance.bloqué');
  } else if (confiance.value === 0) {
    return t('membres.confiance.inconnu');
  } else if (confiance.value < 0.33) {
    return t('membres.confiance.peuDinteraction');
  } else if (confiance.value < 0.67) {
    return t('membres.confiance.interactionMoyenne');
  } else if (confiance.value < 1) {
    return t('membres.confiance.beaucoupDinteraction');
  } else if (confiance.value === 1) {
    return props.id === monCompte.value ? t('membres.moi') : t('membres.confiance.connaissance');
  } else {
    return '';
  }
});
</script>
