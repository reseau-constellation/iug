<template>
  <v-list-item>
    <v-list-item-title>
      <TexteSurlignéRecherche
        v-if="infoSourceNom"
        :info="infoSourceNom"
      />
      <span v-else>{{ nomTraduit || t('nuées.aucunNom') }}</span>
    </v-list-item-title>
    <v-list-item-subtitle>
      <TexteSurlignéRecherche
        v-if="infoSourcDescr"
        :info="infoSourcDescr"
      />
      <span v-else>{{ descriptionTraduite || t('nuées.aucuneDescription') }}</span>
    </v-list-item-subtitle>
    <AuteursObjet
      :auteurs="auteurs"
      :n-max="1"
    ></AuteursObjet>
    <jeton-id-objet :id="résultat.id">
      <TexteSurlignéRecherche
        v-if="infoSourceId"
        :info="infoSourceId"
      />
      <span v-else>{{ résultat.id }}</span>
    </jeton-id-objet>
    <JetonVariable
      v-if="infoSourceVariable"
      :id="infoSourceVariable.id"
    >
      <TexteSurlignéRecherche :info="infoSourceVariable.info.info" />
    </JetonVariable>
    <JetonMotClef
      v-if="infoSourceMotClef"
      :id="infoSourceMotClef.id"
    >
      <TexteSurlignéRecherche :info="infoSourceMotClef.info.info" />
    </JetonMotClef>
    <JetonBd
      v-if="infoSourceBdDirecte"
      :id="infoSourceBdDirecte.id"
    >
      <TexteSurlignéRecherche :info="infoSourceBdDirecte.info.info" />
    </JetonBd>
    <JetonBd
      v-if="infoSourceBdIndirecte"
      :id="infoSourceBdIndirecte.id"
    >
      <TexteSurlignéRecherche :info="infoSourceBdIndirecte.info.info" />
    </JetonBd>
  </v-list-item>
</template>
<script setup lang="ts">
import type {client, utils} from '@constl/ipa';

import {computed, inject, ref} from 'vue';
import type {ComputedRef} from 'vue';

import AuteursObjet from '/@/components/communs/AuteursObjet.vue';
import JetonIdObjet from '/@/components/communs/JetonIdObjet.vue';
import JetonVariable from '/@/components/variables/JetonVariable.vue';
import JetonMotClef from '/@/components/motsClefs/JetonMotClef.vue';
import TexteSurlignéRecherche from './TexteSurlignéRecherche.vue';

import {enregistrerÉcoute} from '/@/components/utils';
import {utiliserLangues} from '/@/plugins/localisation/localisation';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import JetonBd from '../bds/JetonBd.vue';

const props = defineProps<{
  résultat: utils.résultatRecherche<
    | utils.infoRésultatTexte
    | utils.infoRésultatRecherche<
        utils.infoRésultatTexte | utils.infoRésultatRecherche<utils.infoRésultatTexte>
      >
  >;
}>();

const constl = inject<client.ClientConstellation>('constl');

const {traduireNom} = utiliserLangues();
const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Sources résultat directes (nom, description, id de la nuée)
const sourceDirecte = (de: string): ComputedRef<utils.infoRésultatTexte | undefined> => {
  return computed(() => {
    const {de: sourceRésultat, info} = props.résultat.résultatObjectif;
    if (info.type === 'texte' && sourceRésultat === de) {
      return info;
    } else {
      return undefined;
    }
  });
};

const infoSourceNom = sourceDirecte('nom');
const infoSourcDescr = sourceDirecte('descr');
const infoSourceId = sourceDirecte('id');

// Source BD directe
const infoSourceBdIndirecte = computed(
  ():
    | {
        id: string;
        info: utils.infoRésultatRecherche<utils.infoRésultatTexte>;
      }
    | undefined => {
    const {de, clef, info} = props.résultat.résultatObjectif;
    if (info.type === 'résultat' && de === 'bd' && clef && info.info.type === 'résultat') {
      return {
        id: clef,
        info: info.info,
      };
    } else {
      return undefined;
    }
  },
);

// Sources objets connexes
const sourceObjetConnexe = (
  de: string,
): ComputedRef<
  | {
      id: string;
      info: utils.infoRésultatRecherche<utils.infoRésultatTexte>;
    }
  | undefined
> => {
  return computed(() => {
    const {de: sourceRésultat, clef, info} = props.résultat.résultatObjectif;
    if (info.type === 'résultat' && sourceRésultat === de && clef && info.info.type === 'texte') {
      return {
        id: clef,
        info: info as utils.infoRésultatRecherche<utils.infoRésultatTexte>,
      };
    } else {
      return undefined;
    }
  });
};
const infoSourceVariable = sourceObjetConnexe('variable');
const infoSourceMotClef = sourceObjetConnexe('motClef');
const infoSourceBdDirecte = sourceObjetConnexe('bd');

// Nom
const noms = ref<{[lng: string]: string}>({});
const nomTraduit = traduireNom(noms);

enregistrerÉcoute(
  constl?.variables?.suivreNomsVariable({
    id: props.résultat.id,
    f: x => (noms.value = x),
  }),
);

// Descriptions
const descriptions = ref<{[lng: string]: string}>({});
const descriptionTraduite = traduireNom(descriptions);

enregistrerÉcoute(
  constl?.variables?.suivreDescrVariable({
    id: props.résultat.id,
    f: x => (descriptions.value = x),
  }),
);

// Auteurs
const auteurs = ref<utils.infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursVariable({
    idVariable: props.résultat.id,
    f: x => (auteurs.value = x),
  }),
);
</script>
