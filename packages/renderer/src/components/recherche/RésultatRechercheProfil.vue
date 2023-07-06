<template>
  <v-list-item>
    <template #prepend>
      <ImageProfil
        :id="résultat.id"
        start
      />
    </template>
    <template #title>
      <TexteSurlignéRecherche
        v-if="source === 'nom'"
        :info="résultat.résultatObjectif.info"
      />
      <span v-else>{{ nomTraduit || t('communs.anonyme') }}</span>
    </template>
    <v-chip
      v-if="source === 'id'"
      variant="outlined"
      label
      size="small"
      prepend-icon="mdi-link"
    >
      <TexteSurlignéRecherche
        :info="résultat.résultatObjectif.info"
        :max-taille="25"
      ></TexteSurlignéRecherche>
    </v-chip>
    <JetonContactMembre
      v-if="source === 'contact' && résultat.résultatObjectif.clef"
      :contact="résultat.résultatObjectif.info.texte"
      :type="résultat.résultatObjectif.clef"
    >
      <TexteSurlignéRecherche :info="résultat.résultatObjectif.info"></TexteSurlignéRecherche>
    </JetonContactMembre>
  </v-list-item>
</template>
<script setup lang="ts">
import type {client, utils} from '@constl/ipa';

import {computed, inject, ref} from 'vue';

import {utiliserLangues} from '/@/plugins/localisation/localisation';

import {enregistrerÉcoute} from '/@/components/utils';

import ImageProfil from '/@/components/communs/ImageProfil.vue';
import JetonContactMembre from '../membres/JetonContactMembre.vue';
import TexteSurlignéRecherche from './TexteSurlignéRecherche.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{résultat: utils.résultatRecherche<utils.infoRésultatTexte>}>();

const constl = inject<client.ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {traduireNom} = utiliserLangues();
const {t} = useI18n();

// Source résultat
const source = computed(() => {
  return props.résultat.résultatObjectif.de;
});

// Nom
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.profil?.suivreNoms({
    idCompte: props.résultat.id,
    f: x => (noms.value = x),
  }),
);
</script>
