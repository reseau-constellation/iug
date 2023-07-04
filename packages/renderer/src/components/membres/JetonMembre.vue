<template>
  <v-chip
    variant="outlined"
    class="me-2 mb-2"
  >
    <image-profil
      :id="compte"
      start
    />
    {{ nomTraduit || t('communs.anonyme') }}
    <template #append>
      <v-tooltip
        :text="messageConfiance"
        location="bottom"
      >
        <template #activator="{props: propsActivateur}">
          <v-icon
            v-bind="propsActivateur"
            :color="couleurIcône"
            size="small"
            end
          >
            {{ icône }}
          </v-icon>
        </template>
      </v-tooltip>

      <slot name="post"></slot>
    </template>
  </v-chip>
</template>

<script setup lang="ts">
import type {client} from '@constl/ipa';
import {ref, inject, computed} from 'vue';

import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {enregistrerÉcoute} from '/@/components/utils';
import ImageProfil from '/@/components/communs/ImageProfil.vue';

const props = defineProps<{compte: string}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Nom d'utilisatrice
const {traduireNom} = utiliserLangues();

const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.profil?.suivreNoms({
    idCompte: props.compte,
    f: x => (noms.value = x),
  }),
);

// Mon compte
const monCompte = ref<string>();
enregistrerÉcoute(constl?.suivreIdBdCompte({f: id => (monCompte.value = id)}));

// Confiance
const confiance = ref(0);
enregistrerÉcoute(
  constl?.réseau?.suivreConfianceMonRéseauPourMembre({
    idBdCompte: props.compte,
    f: x => (confiance.value = x),
    profondeur: 5,
  }),
);

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
    return props.compte === monCompte.value
      ? t('membres.moi')
      : t('membres.confiance.connaissance');
  } else {
    return '';
  }
});

// Icône
const icône = computed(() => {
  if (confiance.value < 0) {
    return 'mdi-cancel';
  } else {
    return props.compte === monCompte.value ? 'mdi-check' : 'mdi-hands-pray';
  }
});
const couleurIcône = computed(() => {
  if (confiance.value < 0) {
    return 'error';
  } else if (confiance.value === 1) {
    return 'success';
  } else {
    return `rgba(22, 151, 246, ${0.1 + confiance.value * 0.9})`;
  }
});
</script>
