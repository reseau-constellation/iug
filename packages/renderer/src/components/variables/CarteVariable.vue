<template>
  <base-carte-objet
    :id="id"
    :noms="noms"
    :descriptions="descriptions"
    :auteurs="auteurs"
    :fichiers-epinglables="false"
    sauvegarde-possible
    @effacer="effacerVariable"
    @ajuster-noms="nms => ajusterNoms(nms)"
    @ajuster-descriptions="descrs => ajusterDescriptions(descrs)"
    @sauvegarder="() => sauvegarderCatégorie()"
  >
    <template #activateur="{props: propsActivateur}">
      <slot
        name="activateur"
        v-bind="{props: propsActivateur}"
      ></slot>
    </template>
    <template #epingler="{activateur, epingle}">
      <epingler-variable :id-variable="id">
        <template #activateur="{props: propsActivateur}">
          <component
            :is="activateur"
            v-bind="propsActivateur"
            :id="id"
            :epingle="epingle"
          />
        </template>
      </epingler-variable>
    </template>

    <division-carte
      :titre="t('variables.catégorie')"
      :en-attente="!catégorie"
    />
    <span v-if="monAutorisation && catégorie">
      <v-select
        v-model="choixCatégorieBase"
        :items="catégoriesBase"
        :label="t('variables.catégorie')"
        variant="outlined"
        hide-details
      >
        <template #selection="{item}">
          <v-icon
            start
            :icon="icôneCatégorieVariable({type: 'simple', catégorie: item.raw}) || 'mdi-variable'"
          />
          {{ t(`variables.catégories.${item.raw}`) }}
        </template>
        <template #item="{item, props: propsItem}">
          <v-list-item
            v-bind="propsItem"
            :title="t(`variables.catégories.${item.raw}`)"
            :subtitle="t(`variables.indicesCatégories.${item.raw}`)"
            :prepend-icon="
              icôneCatégorieVariable({type: 'simple', catégorie: item.raw}) || 'mdi-variable'
            "
          />
        </template>
      </v-select>
      <!--<v-checkbox
        v-model="choixCatégorieListe"
        :label="t('variables.nouvelle.typeListe')"
      />-->
    </span>
    <v-chip
      v-else-if="catégorie"
      label
      variant="outlined"
      :prepend-icon="icône"
    >
      {{ t(`variables.catégories.${catégorie.catégorie}`) }}
    </v-chip>

    <division-carte
      :titre="t('variables.règles')"
      :en-attente="!règles"
    />
    <v-list v-if="règles">
      <nouvelle-regle
        v-if="monAutorisation"
        :source="{
          type: 'variable',
        }"
        :categorie-variable="choixCatégorieBase"
        @sauvegarder="r => ajouterRègle(r)"
      >
        <template #activateur="{props: propsActivateurNouvelleRègle}">
          <v-list-item
            v-bind="propsActivateurNouvelleRègle"
            prepend-icon="mdi-plus"
          >
            <v-list-item-title>
              {{ t('variables.règles.nouvelle') }}
            </v-list-item-title>
          </v-list-item>
        </template>
      </nouvelle-regle>
      <v-divider />
      <item-regle
        v-for="r in règles"
        :key="r.id"
        :regle="r"
        :effacable="!!(monAutorisation && r.règle.typeRègle !== 'catégorie')"
        :autorisation-modifier="!!monAutorisation"
        @effacer="() => effacerRègle(r.id)"
      ></item-regle>
    </v-list>
  </base-carte-objet>
</template>
<script setup lang="ts">
import type {valid, variables} from '@constl/ipa';

import {suivre} from '@constl/vue';
import {computed, ref, watchEffect} from 'vue';

import {மொழியாக்கத்தைப்_பயன்படுத்து} from '@lassi-js/kilimukku-vue';
import BaseCarteObjet from '/@/components/communs/BaseCarteObjet.vue';
import DivisionCarte from '/@/components/communs/DivisionCarte.vue';
import ItemRegle from '/@/components/règles/ItemRègle.vue';
import NouvelleRegle from '/@/components/règles/NouvelleRègle.vue';
import {utiliserConstellation} from '/@/components/utils';
import {icôneCatégorieVariable} from '/@/components/variables/utils';
import EpinglerVariable from '/@/components/épingles/ÉpinglerVariable.vue';
import {ajusterTexteTraductible} from '/@/utils';

import {catégoriesBase} from './utils';

const props = defineProps<{id: string}>();

const constl = utiliserConstellation();

const {$மொ: t} = மொழியாக்கத்தைப்_பயன்படுத்து();

// Autorisation
const monAutorisation = suivre(constl.suivrePermission, {idObjet: computed(() => props.id)});

// Nom variable
const noms = suivre(constl.variables.suivreNomsVariable, {idVariable: computed(() => props.id)});

const ajusterNoms = async (nouveauxNoms: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: noms.value,
    nouvelles: nouveauxNoms,
  });
  for (const langue of àEffacer) {
    await constl.variables.effacerNomVariable({
      idVariable: props.id,
      langue,
    });
  }
  return await constl.variables.sauvegarderNomsVariable({
    idVariable: props.id,
    noms: àAjouter,
  });
};

// Descriptions variable
const descriptions = suivre(constl.variables.suivreDescriptionsVariable, {
  idVariable: computed(() => props.id),
});

const ajusterDescriptions = async (descrs: {[langue: string]: string}) => {
  const {àEffacer, àAjouter} = ajusterTexteTraductible({
    anciennes: descriptions.value,
    nouvelles: descrs,
  });
  for (const langue of àEffacer) {
    await constl.variables.effacerDescriptionVariable({
      idVariable: props.id,
      langue,
    });
  }
  return await constl.variables.sauvegarderDescriptionsVariable({
    idVariable: props.id,
    descriptions: àAjouter,
  });
};

// Catégorie
const icône = computed(() =>
  catégorie.value ? icôneCatégorieVariable(catégorie.value) : 'mdi-variable',
);
const catégorie = suivre(constl.variables.suivreCatégorieVariable, {
  idVariable: computed(() => props.id),
});

const choixCatégorieListe = ref(false);
const choixCatégorieBase = ref<variables.catégorieBaseVariables>();
const choixCatégorie = computed<variables.catégorieVariables | undefined>(() => {
  if (!choixCatégorieBase.value) return;
  return {
    type: choixCatégorieListe.value ? 'liste' : 'simple',
    catégorie: choixCatégorieBase.value,
  };
});
watchEffect(() => {
  choixCatégorieListe.value = catégorie.value?.type === 'liste';
  choixCatégorieBase.value = catégorie.value?.catégorie;
});

const catégorieChangée = computed<boolean>(() => {
  if (choixCatégorie.value) {
    const {type: nouveauType, catégorie: nouvelleCatégorieBase} = choixCatégorie.value;
    return (
      nouveauType !== catégorie.value?.type || nouvelleCatégorieBase !== catégorie.value.catégorie
    );
  } else {
    return false;
  }
});

const sauvegarderCatégorie = async () => {
  if (choixCatégorie.value && catégorieChangée.value) {
    await constl.variables.sauvegarderCatégorieVariable({
      idVariable: props.id,
      catégorie: choixCatégorie.value,
    });
  }
};

// Auteurs
const auteurs = suivre(constl.réseau.suivreAuteursVariable, {idVariable: computed(() => props.id)});

// Règles
const règles = suivre(constl.variables.suivreRèglesVariable, {
  idVariable: computed(() => props.id),
});
const ajouterRègle = async (r: valid.règleVariable) => {
  await constl.variables.ajouterRègleVariable({
    idVariable: props.id,
    règle: r,
  });
};
const effacerRègle = async (idRègle: string) => {
  await constl.variables.effacerRègleVariable({
    idVariable: props.id,
    idRègle,
  });
};

// Effacer
const effacerVariable = async () => {
  await constl.variables.effacerVariable({idVariable: props.id});
};
</script>
