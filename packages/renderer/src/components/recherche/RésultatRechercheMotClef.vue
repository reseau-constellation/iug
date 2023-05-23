<template>
  <v-list-item>
    <v-list-item-title>
      <TexteSurlignéRecherche
        v-if="source === 'nom'"
        :info="résultat.résultatObjectif.info"
      />
      <span v-else>{{ nomTraduit || t('motsClefs.aucunNom') }}</span>
    </v-list-item-title>
    <v-list-item-subtitle>
      <TexteSurlignéRecherche
        v-if="source === 'descr'"
        :info="résultat.résultatObjectif.info"
      />
      <span v-else>{{ descriptionTraduite || t('motsClefs.aucunNom') }}</span>
    </v-list-item-subtitle>
    <AuteursObjet
      :auteurs="auteurs"
      :n-max="1"
    ></AuteursObjet>
    <jeton-id-objet :id="résultat.id">
      <TexteSurlignéRecherche
        v-if="source === 'id'"
        :info="résultat.résultatObjectif.info"
      />
      <span v-else>{{ résultat.id }}</span>
    </jeton-id-objet>
  </v-list-item>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {infoAuteur, infoRésultatTexte, résultatRecherche} from '@constl/ipa/dist/src/utils';

import {computed, inject, ref} from 'vue';

import AuteursObjet from '../communs/AuteursObjet.vue';
import JetonIdObjet from '../communs/JetonIdObjet.vue';

import {enregistrerÉcoute} from '/@/components/utils';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';

const props = defineProps<{résultat: résultatRecherche<infoRésultatTexte>}>();

const constl = inject<ClientConstellation>('constl');

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
  constl?.motsClefs?.suivreNomsMotClef({
    id: props.résultat.id,
    f: x => (noms.value = x),
  }),
);

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});
const descriptionTraduite = traduireNom(descriptions);

enregistrerÉcoute(
  constl?.motsClefs?.suivreDescriptionsMotClef({
    id: props.résultat.id,
    f: x => (descriptions.value = x),
  }),
);

// Auteurs
const auteurs = ref<infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursMotClef({
    idMotClef: props.résultat.id,
    f: x => (auteurs.value = x),
  }),
);
</script>
