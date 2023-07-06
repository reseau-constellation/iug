<template>
  <v-list-item>
    <template #prepend>
      <ImageProfil :id="compte" />
    </template>
    <v-list-item-title>
      {{ nomTraduit || t('communs.anonyme') }}
      <jeton-confiance
        :id="compte"
        style-jeton="icône"
      />
    </v-list-item-title>
    <v-list-item-subtitle>
      {{
        t('pages.compte.connexions.dispositifs', {
          nDispositifs: nDispositifsFormatté,
          nDispositifsEnLigne: nDispositifsEnLigneFormatté,
        })
      }}
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script setup lang="ts">
import type {client, réseau} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import {enregistrerÉcoute} from '/@/components/utils';
import {utiliserLangues, utiliserNumération} from '/@/plugins/localisation/localisation';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

import ImageProfil from '/@/components/communs/ImageProfil.vue';
import JetonConfiance from '/@/components/membres/JetonConfiance.vue';

const props = defineProps<{compte: string; dispositifs: réseau.statutDispositif[]}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();
const {formatterChiffre} = utiliserNumération();

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

// Nombre de dispositifs
const nDispositifsFormatté = formatterChiffre(computed(() => props.dispositifs.length));
const nDispositifsEnLigne = computed(() => {
  return props.dispositifs.filter(d => !d.vuÀ).length;
});
const nDispositifsEnLigneFormatté = formatterChiffre(nDispositifsEnLigne);
</script>
