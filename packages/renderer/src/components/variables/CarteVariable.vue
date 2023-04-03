<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
  >
    <template #activator="{props: propsActivateur}">
      <slot
        name="activator"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <division-carte
      :titre="t('variables.catégorie')"
      :en-attente="!catégorie"
    />
    <v-select v-if="monAutorisation && catégorie" />
    <v-chip
      v-else-if="catégorie"
      label
      variant="outlined"
      :prepend-icon="icône"
    >
      {{
        t(
          `variables.catégories.${
            catégorie.type === 'simple' ? catégorie.catégorie : catégorie.catégorieBase
          }`,
        )
      }}
    </v-chip>

    <division-carte
      :titre="t('variables.règles')"
      :en-attente="!règles"
    />
    <v-list v-if="règles">
      <item-règle
        v-for="r in règles"
        :key="r.id"
        :regle="r"
      ></item-règle>
    </v-list>
  </base-carte-objet>
</template>
<script setup lang="ts">
import type ClientConstellation from '@constl/ipa/dist/src/client';
import type {infoAuteur} from '@constl/ipa/dist/src/utils';
import type {catégorieVariables} from '@constl/ipa/dist/src/variables';
import type {règleVariable, règleVariableAvecId} from '@constl/ipa/dist/src/valid';
import {computed, inject, ref} from 'vue';

import {enregistrerÉcoute} from '/@/composables/utils';
import BaseCarteObjet from '../communs/BaseCarteObjet.vue';
import {கிளிமூக்கை_உபயோகி} from '/@/plugins/kilimukku/kilimukku-vue';
import {icôneCatégorieVariable} from '/@/utils';
import DivisionCarte from '../communs/DivisionCarte.vue';
import ItemRègle from '/@/components/règles/ItemRègle.vue';

const props = defineProps<{id: string}>();

const constl = inject<ClientConstellation>('constl');

const {useI18n} = கிளிமூக்கை_உபயோகி();
const {t} = useI18n();

// Autorisation
const monAutorisation = ref<'MODÉRATEUR' | 'MEMBRE' | undefined>();
enregistrerÉcoute(
  constl?.suivrePermission({
    idObjet: props.id,
    f: x => (monAutorisation.value = x),
  }),
);

// Nom variable
const noms = ref<{[langue: string]: string}>({});
enregistrerÉcoute(
  constl?.variables?.suivreNomsVariable({
    id: props.id,
    f: x => (noms.value = x),
  }),
);

// Descriptions variable
const descriptions = ref<{[lng: string]: string}>({});

enregistrerÉcoute(
  constl?.variables?.suivreDescrVariable({
    id: props.id,
    f: x => (descriptions.value = x),
  }),
);

// Catégorie
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = ref<catégorieVariables>();
enregistrerÉcoute(
  constl?.variables?.suivreCatégorieVariable({
    id: props.id,
    f: x => (catégorie.value = x),
  }),
);

// Auteurs
const auteurs = ref<infoAuteur[]>();
enregistrerÉcoute(
  constl?.réseau?.suivreAuteursVariable({
    idVariable: props.id,
    f: x => (auteurs.value = x),
  }),
);

// Règles
const règles = ref<règleVariableAvecId<règleVariable>[]>();
enregistrerÉcoute(
  constl?.variables?.suivreRèglesVariable({
    id: props.id,
    f: x => (règles.value = x),
  }),
);
</script>
